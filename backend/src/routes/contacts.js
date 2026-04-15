const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/contacts
router.get('/', (req, res) => {
  const { search, status, assigned_to, page = 1, limit = 20 } = req.query;
  let query = 'SELECT c.*, u.name as assigned_name FROM contacts c LEFT JOIN users u ON c.assigned_to = u.id WHERE c.tenant_id = ?';
  const params = [req.tenantId];

  if (search) {
    query += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR c.company LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  if (status) { query += ' AND c.status = ?'; params.push(status); }
  if (assigned_to) { query += ' AND c.assigned_to = ?'; params.push(assigned_to); }

  query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  const contacts = db.prepare(query).all(...params);

  // Count total
  let countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE tenant_id = ?';
  const countParams = [req.tenantId];
  if (search) {
    countQuery += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)';
    const s = `%${search}%`;
    countParams.push(s, s, s, s);
  }
  if (status) { countQuery += ' AND status = ?'; countParams.push(status); }
  const { total } = db.prepare(countQuery).get(...countParams);

  res.json({
    data: contacts.map(c => ({ ...c, tags: JSON.parse(c.tags || '[]') })),
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
  });
});

// GET /api/contacts/:id
router.get('/:id', (req, res) => {
  const contact = db.prepare(`
    SELECT c.*, u.name as assigned_name
    FROM contacts c
    LEFT JOIN users u ON c.assigned_to = u.id
    WHERE c.id = ? AND c.tenant_id = ?
  `).get(req.params.id, req.tenantId);
  if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

  const deals = db.prepare(`
    SELECT d.*, ps.name as stage_name, ps.color as stage_color
    FROM deals d
    JOIN pipeline_stages ps ON d.stage_id = ps.id
    WHERE d.contact_id = ? AND d.tenant_id = ?
  `).all(req.params.id, req.tenantId);

  const activities = db.prepare(`
    SELECT a.*, u.name as user_name
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.contact_id = ? AND a.tenant_id = ?
    ORDER BY a.created_at DESC LIMIT 20
  `).all(req.params.id, req.tenantId);

  res.json({
    ...contact,
    tags: JSON.parse(contact.tags || '[]'),
    deals,
    activities,
  });
});

// POST /api/contacts
router.post('/', (req, res) => {
  const { name, email, phone, whatsapp, company, position, source, notes, assigned_to, status, tags } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO contacts (id, tenant_id, name, email, phone, whatsapp, company, position, source, notes, assigned_to, status, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.tenantId, name, email, phone, whatsapp, company, position, source || 'manual', notes, assigned_to, status || 'lead', JSON.stringify(tags || []));

  // Registrar atividade
  db.prepare('INSERT INTO activities (id, tenant_id, contact_id, user_id, type, description) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uuidv4(), req.tenantId, id, req.user.id, 'contact_created', `Contato "${name}" criado`);

  res.status(201).json({ id, message: 'Contato criado com sucesso' });
});

// PUT /api/contacts/:id
router.put('/:id', (req, res) => {
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

  const { name, email, phone, whatsapp, company, position, source, notes, assigned_to, status, tags } = req.body;

  db.prepare(`
    UPDATE contacts SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      whatsapp = COALESCE(?, whatsapp),
      company = COALESCE(?, company),
      position = COALESCE(?, position),
      source = COALESCE(?, source),
      notes = COALESCE(?, notes),
      assigned_to = COALESCE(?, assigned_to),
      status = COALESCE(?, status),
      tags = COALESCE(?, tags),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND tenant_id = ?
  `).run(name, email, phone, whatsapp, company, position, source, notes, assigned_to, status, tags ? JSON.stringify(tags) : null, req.params.id, req.tenantId);

  db.prepare('INSERT INTO activities (id, tenant_id, contact_id, user_id, type, description) VALUES (?, ?, ?, ?, ?, ?)')
    .run(uuidv4(), req.tenantId, req.params.id, req.user.id, 'contact_updated', `Contato "${contact.name}" atualizado`);

  res.json({ message: 'Contato atualizado' });
});

// DELETE /api/contacts/:id
router.delete('/:id', (req, res) => {
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!contact) return res.status(404).json({ error: 'Contato não encontrado' });

  db.prepare('DELETE FROM contacts WHERE id = ? AND tenant_id = ?').run(req.params.id, req.tenantId);
  res.json({ message: 'Contato removido' });
});

// GET /api/contacts/stats/summary
router.get('/stats/summary', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ?').get(req.tenantId).c;
  const leads = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ? AND status = 'lead'").get(req.tenantId).c;
  const clients = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ? AND status = 'cliente'").get(req.tenantId).c;
  const thisMonth = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ? AND created_at >= date('now', 'start of month')").get(req.tenantId).c;

  res.json({ total, leads, clients, thisMonth });
});

module.exports = router;
