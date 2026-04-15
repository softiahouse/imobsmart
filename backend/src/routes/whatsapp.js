const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');
const whatsappService = require('../services/whatsappService');

router.use(authenticate);

// GET /api/whatsapp/status
router.get('/status', (req, res) => {
  const status = whatsappService.getStatus(req.tenantId);
  const tenant = db.prepare('SELECT whatsapp_number FROM tenants WHERE id = ?').get(req.tenantId);
  res.json({ ...status, phone: tenant?.whatsapp_number });
});

// POST /api/whatsapp/connect
router.post('/connect', async (req, res) => {
  const result = await whatsappService.initializeSession(req.tenantId);
  res.json(result);
});

// POST /api/whatsapp/disconnect
router.post('/disconnect', async (req, res) => {
  await whatsappService.disconnectSession(req.tenantId);
  res.json({ message: 'WhatsApp desconectado' });
});

// GET /api/whatsapp/conversations
router.get('/conversations', (req, res) => {
  const { status, search } = req.query;
  let query = `
    SELECT cv.*, u.name as assigned_name,
           c.name as contact_name_linked
    FROM conversations cv
    LEFT JOIN users u ON cv.assigned_to = u.id
    LEFT JOIN contacts c ON cv.contact_id = c.id
    WHERE cv.tenant_id = ?
  `;
  const params = [req.tenantId];

  if (status) { query += ' AND cv.status = ?'; params.push(status); }
  if (search) {
    query += ' AND (cv.contact_name LIKE ? OR cv.contact_phone LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s);
  }

  query += ' ORDER BY cv.last_message_at DESC LIMIT 50';
  const convs = db.prepare(query).all(...params);
  res.json(convs);
});

// GET /api/whatsapp/conversations/:id/messages
router.get('/conversations/:id/messages', (req, res) => {
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!conv) return res.status(404).json({ error: 'Conversa não encontrada' });

  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC LIMIT 100').all(req.params.id);

  // Marcar como lida
  db.prepare('UPDATE conversations SET unread_count = 0 WHERE id = ?').run(req.params.id);

  res.json({ conversation: conv, messages });
});

// POST /api/whatsapp/conversations/:id/send
router.post('/conversations/:id/send', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Mensagem não pode ser vazia' });

  const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!conv) return res.status(404).json({ error: 'Conversa não encontrada' });

  try {
    await whatsappService.sendMessage(req.tenantId, conv.whatsapp_jid, content, false);
    res.json({ message: 'Mensagem enviada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/whatsapp/conversations/:id
router.put('/conversations/:id', (req, res) => {
  const { status, assigned_to } = req.body;
  db.prepare('UPDATE conversations SET status = COALESCE(?, status), assigned_to = COALESCE(?, assigned_to), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?')
    .run(status, assigned_to, req.params.id, req.tenantId);
  res.json({ message: 'Conversa atualizada' });
});

// GET /api/whatsapp/stats
router.get('/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM conversations WHERE tenant_id = ?').get(req.tenantId).c;
  const open = db.prepare("SELECT COUNT(*) as c FROM conversations WHERE tenant_id = ? AND status = 'open'").get(req.tenantId).c;
  const today = db.prepare("SELECT COUNT(*) as c FROM messages WHERE tenant_id = ? AND from_me = 0 AND date(timestamp) = date('now')").get(req.tenantId).c;
  const aiMessages = db.prepare('SELECT COUNT(*) as c FROM messages WHERE tenant_id = ? AND ai_generated = 1').get(req.tenantId).c;

  res.json({ total, open, todayMessages: today, aiMessages });
});

module.exports = router;
