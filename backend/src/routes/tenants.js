const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

// GET /api/tenants/me
router.get('/me', (req, res) => {
  const tenant = db.prepare('SELECT id, name, slug, logo_url, primary_color, secondary_color, tagline, plan, whatsapp_number FROM tenants WHERE id = ?').get(req.tenantId);
  res.json(tenant);
});

// PUT /api/tenants/me (apenas admin)
router.put('/me', requireAdmin, (req, res) => {
  const { name, logo_url, primary_color, secondary_color, tagline } = req.body;
  db.prepare(`
    UPDATE tenants SET
      name = COALESCE(?, name),
      logo_url = COALESCE(?, logo_url),
      primary_color = COALESCE(?, primary_color),
      secondary_color = COALESCE(?, secondary_color),
      tagline = COALESCE(?, tagline),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, logo_url, primary_color, secondary_color, tagline, req.tenantId);

  res.json({ message: 'Configurações atualizadas' });
});

// GET /api/tenants/dashboard
router.get('/dashboard', (req, res) => {
  const contacts = db.prepare('SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ?').get(req.tenantId).c;
  const leads = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE tenant_id = ? AND status = 'lead'").get(req.tenantId).c;
  const deals = db.prepare('SELECT COUNT(*) as c, COALESCE(SUM(value), 0) as v FROM deals WHERE tenant_id = ?').get(req.tenantId);
  const conversations = db.prepare("SELECT COUNT(*) as c FROM conversations WHERE tenant_id = ? AND status = 'open'").get(req.tenantId).c;
  const messages_today = db.prepare("SELECT COUNT(*) as c FROM messages WHERE tenant_id = ? AND date(timestamp) = date('now')").get(req.tenantId).c;
  const ai_messages = db.prepare('SELECT COUNT(*) as c FROM messages WHERE tenant_id = ? AND ai_generated = 1').get(req.tenantId).c;

  // Pipeline por etapa
  const pipeline = db.prepare(`
    SELECT ps.name, ps.color, COUNT(d.id) as count, COALESCE(SUM(d.value), 0) as total
    FROM pipeline_stages ps
    LEFT JOIN deals d ON ps.id = d.stage_id AND d.tenant_id = ps.tenant_id
    WHERE ps.tenant_id = ?
    GROUP BY ps.id ORDER BY ps.position
  `).all(req.tenantId);

  // Contatos recentes
  const recent_contacts = db.prepare('SELECT * FROM contacts WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 5').all(req.tenantId);

  res.json({
    stats: {
      contacts,
      leads,
      deals: deals.c,
      deals_value: deals.v,
      open_conversations: conversations,
      messages_today,
      ai_messages,
    },
    pipeline,
    recent_contacts,
  });
});

module.exports = router;
