/**
 * WhatsApp Service usando @whiskeysockets/baileys
 * Suporta múltiplos tenants (uma sessão por tenant)
 */

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { generateAIResponse } = require('./aiService');

// Armazenar sockets por tenant
const sessions = new Map();
const qrCodes = new Map();
const statusMap = new Map();

// io (Socket.IO) será injetado depois
let io = null;
const setIO = (socketIO) => { io = socketIO; };

async function initializeSession(tenantId) {
  if (sessions.has(tenantId)) {
    return { status: statusMap.get(tenantId) || 'connecting' };
  }

  let makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers;
  try {
    const baileys = require('@whiskeysockets/baileys');
    makeWASocket = baileys.default || baileys.makeWASocket;
    useMultiFileAuthState = baileys.useMultiFileAuthState;
    DisconnectReason = baileys.DisconnectReason;
    Browsers = baileys.Browsers;
  } catch (e) {
    console.error('Baileys não instalado:', e.message);
    return { status: 'error', message: 'Baileys não instalado. Execute: npm install' };
  }

  const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
  const authDir = path.join(DATA_DIR, 'whatsapp', tenantId);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  statusMap.set(tenantId, 'connecting');

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
      auth: state,
      browser: Browsers.ubuntu('CRM Soft IA'),
      printQRInTerminal: false,
      syncFullHistory: false,
    });

    sessions.set(tenantId, sock);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        const QRCode = require('qrcode');
        const qrImage = await QRCode.toDataURL(qr);
        qrCodes.set(tenantId, qrImage);
        statusMap.set(tenantId, 'qr_ready');
        io?.to(`tenant_${tenantId}`).emit('whatsapp:qr', { qr: qrImage });
      }

      if (connection === 'open') {
        statusMap.set(tenantId, 'connected');
        qrCodes.delete(tenantId);
        io?.to(`tenant_${tenantId}`).emit('whatsapp:connected', { tenantId });

        const number = sock.user?.id?.split(':')[0];
        if (number) {
          db.prepare('UPDATE tenants SET whatsapp_number = ? WHERE id = ?').run(number, tenantId);
        }
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        sessions.delete(tenantId);
        statusMap.set(tenantId, shouldReconnect ? 'disconnected' : 'logged_out');
        io?.to(`tenant_${tenantId}`).emit('whatsapp:disconnected', { tenantId });

        if (shouldReconnect) {
          setTimeout(() => initializeSession(tenantId), 5000);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Receber mensagens
    sock.ev.on('messages.upsert', async ({ messages: msgs, type }) => {
      if (type !== 'notify') return;
      for (const msg of msgs) {
        if (!msg.message || msg.key.fromMe) continue;
        await handleIncomingMessage(tenantId, sock, msg);
      }
    });

  } catch (error) {
    console.error(`Erro ao inicializar WhatsApp para tenant ${tenantId}:`, error);
    statusMap.set(tenantId, 'error');
  }

  return { status: statusMap.get(tenantId) };
}

async function handleIncomingMessage(tenantId, sock, msg) {
  const jid = msg.key.remoteJid;
  const phone = jid.split('@')[0].replace(/\D/g, '');
  const content = msg.message?.conversation ||
                  msg.message?.extendedTextMessage?.text ||
                  msg.message?.imageMessage?.caption || '';

  if (!content) return;

  const pushName = msg.pushName || phone;

  // Buscar ou criar conversa
  let conversation = db.prepare('SELECT * FROM conversations WHERE whatsapp_jid = ? AND tenant_id = ?').get(jid, tenantId);
  if (!conversation) {
    const convId = uuidv4();
    // Tentar associar a um contato existente
    const contact = db.prepare('SELECT * FROM contacts WHERE (whatsapp = ? OR phone LIKE ?) AND tenant_id = ?')
      .get(phone, `%${phone.slice(-9)}%`, tenantId);

    db.prepare(`
      INSERT INTO conversations (id, tenant_id, contact_id, whatsapp_jid, contact_name, contact_phone, last_message, last_message_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(convId, tenantId, contact?.id || null, jid, contact?.name || pushName, phone, content);

    conversation = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
  } else {
    db.prepare('UPDATE conversations SET last_message = ?, last_message_at = CURRENT_TIMESTAMP, unread_count = unread_count + 1 WHERE id = ?')
      .run(content, conversation.id);
  }

  // Salvar mensagem
  const msgId = uuidv4();
  db.prepare('INSERT INTO messages (id, conversation_id, tenant_id, from_me, content, type) VALUES (?, ?, ?, 0, ?, ?)')
    .run(msgId, conversation.id, tenantId, content, 'text');

  io?.to(`tenant_${tenantId}`).emit('whatsapp:message', {
    conversationId: conversation.id,
    message: { id: msgId, from_me: 0, content, type: 'text', timestamp: new Date() },
  });

  // Resposta de IA automática
  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(tenantId);
  if (tenant?.ai_enabled) {
    const history = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 20').all(conversation.id).reverse();
    const aiResponse = await generateAIResponse(tenantId, history, content);

    if (aiResponse) {
      await sendMessage(tenantId, jid, aiResponse, true);
    }
  }
}

async function sendMessage(tenantId, jid, content, aiGenerated = false) {
  const sock = sessions.get(tenantId);
  if (!sock) throw new Error('WhatsApp não conectado');

  await sock.sendMessage(jid, { text: content });

  // Buscar conversa
  const conversation = db.prepare('SELECT * FROM conversations WHERE whatsapp_jid = ? AND tenant_id = ?').get(jid, tenantId);
  if (conversation) {
    const msgId = uuidv4();
    db.prepare('INSERT INTO messages (id, conversation_id, tenant_id, from_me, content, ai_generated) VALUES (?, ?, ?, 1, ?, ?)')
      .run(msgId, conversation.id, tenantId, content, aiGenerated ? 1 : 0);
    db.prepare('UPDATE conversations SET last_message = ?, last_message_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(content, conversation.id);

    io?.to(`tenant_${tenantId}`).emit('whatsapp:message', {
      conversationId: conversation.id,
      message: { id: msgId, from_me: 1, content, ai_generated: aiGenerated, timestamp: new Date() },
    });
  }
}

function getStatus(tenantId) {
  return {
    status: statusMap.get(tenantId) || 'disconnected',
    qr: qrCodes.get(tenantId) || null,
  };
}

async function disconnectSession(tenantId) {
  const sock = sessions.get(tenantId);
  if (sock) {
    await sock.logout();
    sessions.delete(tenantId);
    statusMap.set(tenantId, 'logged_out');
  }

  // Remover auth files
  const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
  const authDir = path.join(DATA_DIR, 'whatsapp', tenantId);
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true });
  }
}

module.exports = { initializeSession, sendMessage, getStatus, disconnectSession, setIO };
