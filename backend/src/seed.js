require('dotenv').config();
const db = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function runSeed() {
  // Verificar se já existem tenants — se sim, pular seed
  const existing = db.prepare('SELECT COUNT(*) as count FROM tenants').get();
  if (existing.count > 0) {
    console.log('⏭️  Seed ignorado: banco já possui dados.');
    return;
  }

  console.log('🌱 Iniciando seed do banco de dados...');

  // ========== TENANT 1: FedChess Valencia ==========
  const fedchessId = uuidv4();
  db.prepare(`
    INSERT INTO tenants (id, name, slug, primary_color, secondary_color, tagline, plan, ai_enabled, ai_prompt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    fedchessId,
    'FedChess Valencia',
    'fedchess',
    '#1e3a5f',
    '#c9a227',
    'Gestión inteligente para tu federación de ajedrez',
    'professional',
    1,
    'Eres un asistente de la Federación de Ajedrez de Valencia. Ayuda a los usuarios con información sobre torneos, inscripciones, cursos y eventos de ajedrez. Sé amable y profesional. Responde siempre en español.'
  );

  // ========== TENANT 2: Demo PYME Valencia ==========
  const demoId = uuidv4();
  db.prepare(`
    INSERT INTO tenants (id, name, slug, primary_color, secondary_color, tagline, plan, ai_enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    demoId,
    'Demo PYME Valencia',
    'demo',
    '#6366f1',
    '#8b5cf6',
    'CRM Inteligente para tu negocio',
    'basic',
    0
  );

  // ========== USUÁRIOS ==========
  const adminPass = bcrypt.hashSync('admin123', 10);
  const agentPass = bcrypt.hashSync('agent123', 10);

  const adminId = uuidv4();
  const agent1Id = uuidv4();
  const agent2Id = uuidv4();

  db.prepare(`INSERT INTO users (id, tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(adminId, fedchessId, 'Carlos Martínez', 'admin@fedchess.es', adminPass, 'admin');

  db.prepare(`INSERT INTO users (id, tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(agent1Id, fedchessId, 'Ana López', 'ana@fedchess.es', agentPass, 'agent');

  db.prepare(`INSERT INTO users (id, tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(agent2Id, fedchessId, 'Miguel Torres', 'miguel@fedchess.es', agentPass, 'agent');

  // Admin do tenant demo
  db.prepare(`INSERT INTO users (id, tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(uuidv4(), demoId, 'Admin Demo', 'admin@demo.es', adminPass, 'admin');

  // ========== ESTÁGIOS DO FUNIL ==========
  const stages = [
    { name: 'Nuevo Contacto', color: '#6366f1', position: 0 },
    { name: 'Interesado', color: '#f59e0b', position: 1 },
    { name: 'Propuesta Enviada', color: '#3b82f6', position: 2 },
    { name: 'Negociación', color: '#8b5cf6', position: 3 },
    { name: 'Cerrado Ganado', color: '#10b981', position: 4 },
    { name: 'Cerrado Perdido', color: '#ef4444', position: 5 },
  ];

  const stageIds = [];
  for (const stage of stages) {
    const id = uuidv4();
    stageIds.push(id);
    db.prepare(`INSERT INTO pipeline_stages (id, tenant_id, name, color, position) VALUES (?, ?, ?, ?, ?)`)
      .run(id, fedchessId, stage.name, stage.color, stage.position);
  }

  // ========== CONTATOS ==========
  const contacts = [
    { name: 'Alejandro Pérez', email: 'alejandro@gmail.com', phone: '+34 612 345 678', whatsapp: '+34612345678', company: 'Club Ajedrez Valencia', status: 'cliente' },
    { name: 'Laura Sánchez', email: 'laura.sanchez@yahoo.es', phone: '+34 623 456 789', whatsapp: '+34623456789', company: 'Colegio San Vicente', status: 'lead' },
    { name: 'Roberto García', email: 'roberto@empresa.com', phone: '+34 634 567 890', whatsapp: '+34634567890', company: 'García & Asociados', status: 'lead' },
    { name: 'Isabel Martín', email: 'isabel@hotmail.com', phone: '+34 645 678 901', whatsapp: '+34645678901', company: 'Particular', status: 'lead' },
    { name: 'Fernando Ruiz', email: 'fernando.ruiz@correo.es', phone: '+34 656 789 012', whatsapp: '+34656789012', company: 'Club Deportivo Mestalla', status: 'cliente' },
    { name: 'Carmen Jiménez', email: 'carmen@empresa.es', phone: '+34 667 890 123', whatsapp: '+34667890123', company: 'Ayuntamiento de Valencia', status: 'lead' },
  ];

  const contactIds = [];
  for (const c of contacts) {
    const id = uuidv4();
    contactIds.push(id);
    db.prepare(`
      INSERT INTO contacts (id, tenant_id, name, email, phone, whatsapp, company, status, assigned_to, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, fedchessId, c.name, c.email, c.phone, c.whatsapp, c.company, c.status, agent1Id, 'whatsapp');
  }

  // ========== NEGOCIAÇÕES ==========
  const deals = [
    { title: 'Torneo Municipal 2025', contactIdx: 0, stageIdx: 4, value: 2500, prob: 90 },
    { title: 'Curso Ajedrez Escolar', contactIdx: 1, stageIdx: 2, value: 1800, prob: 60 },
    { title: 'Patrocinio Liga Regional', contactIdx: 2, stageIdx: 1, value: 5000, prob: 30 },
    { title: 'Membresía Anual Club', contactIdx: 3, stageIdx: 0, value: 350, prob: 20 },
    { title: 'Evento Corporativo Ajedrez', contactIdx: 4, stageIdx: 3, value: 3200, prob: 75 },
    { title: 'Subvención Educativa', contactIdx: 5, stageIdx: 2, value: 8000, prob: 50 },
  ];

  for (const d of deals) {
    db.prepare(`
      INSERT INTO deals (id, tenant_id, title, contact_id, stage_id, value, currency, probability, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), fedchessId, d.title, contactIds[d.contactIdx], stageIds[d.stageIdx], d.value, 'EUR', d.prob, agent1Id);
  }

  // ========== CONVERSAS E MENSAGENS ==========
  const conv1Id = uuidv4();
  db.prepare(`
    INSERT INTO conversations (id, tenant_id, contact_id, whatsapp_jid, contact_name, contact_phone, status, assigned_to, last_message, last_message_at, unread_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
  `).run(conv1Id, fedchessId, contactIds[0], '+34612345678@s.whatsapp.net', 'Alejandro Pérez', '+34 612 345 678', 'open', agent1Id, 'Hola, me interesa inscribirme al torneo', 2);

  const msgData = [
    { from_me: 0, content: 'Hola! Me interesa inscribirme al próximo torneo municipal' },
    { from_me: 1, content: 'Hola Alejandro! Claro, el torneo es el 15 de marzo. La inscripción es de 25€. ¿Te apunto?' },
    { from_me: 0, content: '¡Perfecto! Sí, apúntame por favor' },
    { from_me: 0, content: '¿Hay algún descuento para miembros del club?' },
  ];

  for (const m of msgData) {
    db.prepare(`INSERT INTO messages (id, conversation_id, tenant_id, from_me, content) VALUES (?, ?, ?, ?, ?)`)
      .run(uuidv4(), conv1Id, fedchessId, m.from_me, m.content);
  }

  console.log('✅ Seed concluído!');
  console.log('');
  console.log('📋 Credenciais de acesso:');
  console.log('  Tenant: FedChess Valencia (slug: fedchess)');
  console.log('  Admin: admin@fedchess.es / admin123');
  console.log('  Agente: ana@fedchess.es / agent123');
  console.log('');
  console.log('  Tenant: Demo PYME (slug: demo)');
  console.log('  Admin: admin@demo.es / admin123');
}

// Exportar para uso no index.js
module.exports = { runSeed };

// Permitir execução direta: node src/seed.js
if (require.main === module) {
  runSeed();
}
