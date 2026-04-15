const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/pipeline - Kanban completo
router.get('/', (req, res) => {
  const stages = db.prepare('SELECT * FROM pipeline_stages WHERE tenant_id = ? ORDER BY position').all(req.tenantId);

  const result = stages.map(stage => {
    const deals = db.prepare(`
      SELECT d.*, c.name as contact_name, c.company, c.whatsapp,
             u.name as assigned_name
      FROM deals d
      LEFT JOIN contacts c ON d.contact_id = c.id
      LEFT JOIN users u ON d.assigned_to = u.id
      WHERE d.stage_id = ? AND d.tenant_id = ?
      ORDER BY d.position, d.created_at
    `).all(stage.id, req.tenantId);

    const total = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    return { ...stage, deals, total };
  });

  res.json(result);
});

// GET /api/pipeline/stats
router.get('/stats', (req, res) => {
  const totalDeals = db.prepare('SELECT COUNT(*) as c FROM deals WHERE tenant_id = ?').get(req.tenantId).c;
  const totalValue = db.prepare('SELECT COALESCE(SUM(value), 0) as s FROM deals WHERE tenant_id = ?').get(req.tenantId).s;
  const wonDeals = db.prepare(`
    SELECT COUNT(*) as c, COALESCE(SUM(d.value), 0) as s
    FROM deals d
    JOIN pipeline_stages ps ON d.stage_id = ps.id
    WHERE d.tenant_id = ? AND ps.name LIKE '%Ganado%'
  `).get(req.tenantId);
  const lostDeals = db.prepare(`
    SELECT COUNT(*) as c
    FROM deals d
    JOIN pipeline_stages ps ON d.stage_id = ps.id
    WHERE d.tenant_id = ? AND ps.name LIKE '%Perdido%'
  `).get(req.tenantId);

  res.json({
    totalDeals,
    totalValue,
    wonDeals: wonDeals.c,
    wonValue: wonDeals.s,
    lostDeals: lostDeals.c,
  });
});

// POST /api/pipeline/stages
router.post('/stages', (req, res) => {
  const { name, color, position } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome da etapa é obrigatório' });

  const maxPos = db.prepare('SELECT COALESCE(MAX(position), -1) as m FROM pipeline_stages WHERE tenant_id = ?').get(req.tenantId).m;
  const id = uuidv4();
  db.prepare('INSERT INTO pipeline_stages (id, tenant_id, name, color, position) VALUES (?, ?, ?, ?, ?)')
    .run(id, req.tenantId, name, color || '#6366f1', position ?? maxPos + 1);

  res.status(201).json({ id, message: 'Etapa criada' });
});

// PUT /api/pipeline/stages/:id
router.put('/stages/:id', (req, res) => {
  const { name, color, position } = req.body;
  db.prepare('UPDATE pipeline_stages SET name = COALESCE(?, name), color = COALESCE(?, color), position = COALESCE(?, position) WHERE id = ? AND tenant_id = ?')
    .run(name, color, position, req.params.id, req.tenantId);
  res.json({ message: 'Etapa atualizada' });
});

// DELETE /api/pipeline/stages/:id
router.delete('/stages/:id', (req, res) => {
  const hasDeals = db.prepare('SELECT COUNT(*) as c FROM deals WHERE stage_id = ? AND tenant_id = ?').get(req.params.id, req.tenantId).c;
  if (hasDeals > 0) return res.status(400).json({ error: 'Etapa possui negociações. Mova-as antes de excluir.' });

  db.prepare('DELETE FROM pipeline_stages WHERE id = ? AND tenant_id = ?').run(req.params.id, req.tenantId);
  res.json({ message: 'Etapa removida' });
});

// POST /api/pipeline/deals
router.post('/deals', (req, res) => {
  const { title, contact_id, stage_id, value, currency, probability, expected_close_date, assigned_to, notes } = req.body;
  if (!title || !stage_id) return res.status(400).json({ error: 'Título e etapa são obrigatórios' });

  const stage = db.prepare('SELECT id FROM pipeline_stages WHERE id = ? AND tenant_id = ?').get(stage_id, req.tenantId);
  if (!stage) return res.status(404).json({ error: 'Etapa não encontrada' });

  const id = uuidv4();
  const maxPos = db.prepare('SELECT COALESCE(MAX(position), -1) as m FROM deals WHERE stage_id = ? AND tenant_id = ?').get(stage_id, req.tenantId).m;

  db.prepare(`
    INSERT INTO deals (id, tenant_id, title, contact_id, stage_id, value, currency, probability, expected_close_date, assigned_to, notes, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.tenantId, title, contact_id, stage_id, value || 0, currency || 'EUR', probability || 50, expected_close_date, assigned_to || req.user.id, notes, maxPos + 1);

  if (contact_id) {
    db.prepare('INSERT INTO activities (id, tenant_id, contact_id, deal_id, user_id, type, description) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(uuidv4(), req.tenantId, contact_id, id, req.user.id, 'deal_created', `Negociação "${title}" criada`);
  }

  res.status(201).json({ id, message: 'Negociação criada' });
});

// PUT /api/pipeline/deals/:id
router.put('/deals/:id', (req, res) => {
  const deal = db.prepare('SELECT * FROM deals WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!deal) return res.status(404).json({ error: 'Negociação não encontrada' });

  const { title, contact_id, stage_id, value, currency, probability, expected_close_date, assigned_to, notes, position } = req.body;

  db.prepare(`
    UPDATE deals SET
      title = COALESCE(?, title),
      contact_id = COALESCE(?, contact_id),
      stage_id = COALESCE(?, stage_id),
      value = COALESCE(?, value),
      currency = COALESCE(?, currency),
      probability = COALESCE(?, probability),
      expected_close_date = COALESCE(?, expected_close_date),
      assigned_to = COALESCE(?, assigned_to),
      notes = COALESCE(?, notes),
      position = COALESCE(?, position),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND tenant_id = ?
  `).run(title, contact_id, stage_id, value, currency, probability, expected_close_date, assigned_to, notes, position, req.params.id, req.tenantId);

  // Log stage change
  if (stage_id && stage_id !== deal.stage_id) {
    const newStage = db.prepare('SELECT name FROM pipeline_stages WHERE id = ?').get(stage_id);
    const oldStage = db.prepare('SELECT name FROM pipeline_stages WHERE id = ?').get(deal.stage_id);
    if (deal.contact_id) {
      db.prepare('INSERT INTO activities (id, tenant_id, contact_id, deal_id, user_id, type, description) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(uuidv4(), req.tenantId, deal.contact_id, deal.id, req.user.id, 'deal_stage_changed',
          `Negociação movida de "${oldStage?.name}" para "${newStage?.name}"`);
    }
  }

  res.json({ message: 'Negociação atualizada' });
});

// DELETE /api/pipeline/deals/:id
router.delete('/deals/:id', (req, res) => {
  db.prepare('DELETE FROM deals WHERE id = ? AND tenant_id = ?').run(req.params.id, req.tenantId);
  res.json({ message: 'Negociação removida' });
});

module.exports = router;
