const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { generateAIResponse } = require('../services/aiService');

router.use(authenticate);

// GET /api/ai/config
router.get('/config', (req, res) => {
  const tenant = db.prepare('SELECT ai_enabled, ai_prompt, openai_api_key, whatsapp_number FROM tenants WHERE id = ?').get(req.tenantId);
  res.json({
    ai_enabled: !!tenant.ai_enabled,
    ai_prompt: tenant.ai_prompt,
    has_api_key: !!tenant.openai_api_key,
    whatsapp_number: tenant.whatsapp_number,
  });
});

// PUT /api/ai/config (apenas admin)
router.put('/config', requireAdmin, (req, res) => {
  const { ai_enabled, ai_prompt, openai_api_key } = req.body;
  db.prepare(`
    UPDATE tenants SET
      ai_enabled = COALESCE(?, ai_enabled),
      ai_prompt = COALESCE(?, ai_prompt),
      openai_api_key = COALESCE(?, openai_api_key),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(ai_enabled !== undefined ? (ai_enabled ? 1 : 0) : null, ai_prompt, openai_api_key, req.tenantId);

  res.json({ message: 'Configuração de IA atualizada' });
});

// GET /api/ai/rules
router.get('/rules', (req, res) => {
  const rules = db.prepare('SELECT * FROM ai_rules WHERE tenant_id = ? ORDER BY created_at DESC').all(req.tenantId);
  res.json(rules);
});

// POST /api/ai/rules
router.post('/rules', (req, res) => {
  const { trigger_keyword, response } = req.body;
  if (!response) return res.status(400).json({ error: 'Resposta é obrigatória' });

  const id = uuidv4();
  db.prepare('INSERT INTO ai_rules (id, tenant_id, trigger_keyword, response) VALUES (?, ?, ?, ?)')
    .run(id, req.tenantId, trigger_keyword, response);

  res.status(201).json({ id, message: 'Regra criada' });
});

// PUT /api/ai/rules/:id
router.put('/rules/:id', (req, res) => {
  const { trigger_keyword, response, active } = req.body;
  db.prepare('UPDATE ai_rules SET trigger_keyword = COALESCE(?, trigger_keyword), response = COALESCE(?, response), active = COALESCE(?, active) WHERE id = ? AND tenant_id = ?')
    .run(trigger_keyword, response, active !== undefined ? (active ? 1 : 0) : null, req.params.id, req.tenantId);
  res.json({ message: 'Regra atualizada' });
});

// DELETE /api/ai/rules/:id
router.delete('/rules/:id', (req, res) => {
  db.prepare('DELETE FROM ai_rules WHERE id = ? AND tenant_id = ?').run(req.params.id, req.tenantId);
  res.json({ message: 'Regra removida' });
});

// POST /api/ai/test - testar resposta da IA
router.post('/test', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

  const response = await generateAIResponse(req.tenantId, [], message);
  if (!response) return res.json({ response: null, message: 'IA não configurada ou desabilitada' });

  res.json({ response });
});

module.exports = router;
