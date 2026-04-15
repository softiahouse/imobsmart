const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { generateToken, authenticate } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, slug } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  let user;
  if (slug) {
    const tenant = db.prepare('SELECT id FROM tenants WHERE slug = ? AND active = 1').get(slug);
    if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado' });
    user = db.prepare('SELECT * FROM users WHERE email = ? AND tenant_id = ? AND active = 1').get(email, tenant.id);
  } else {
    user = db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email);
  }

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(user.tenant_id);
  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logo_url: tenant.logo_url,
      primary_color: tenant.primary_color,
      secondary_color: tenant.secondary_color,
      tagline: tenant.tagline,
    },
  });
});

// POST /api/auth/register (criar usuário - apenas admin)
router.post('/register', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas administradores podem criar usuários' });
  }
  const { name, email, password, role = 'agent' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ? AND tenant_id = ?').get(email, req.tenantId);
  if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

  const id = uuidv4();
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, req.tenantId, name, email, hashed, role);

  res.status(201).json({ id, name, email, role, message: 'Usuário criado com sucesso' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(req.tenantId);
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logo_url: tenant.logo_url,
      primary_color: tenant.primary_color,
      secondary_color: tenant.secondary_color,
      tagline: tenant.tagline,
    },
  });
});

// GET /api/auth/users
router.get('/users', authenticate, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, avatar, active, created_at FROM users WHERE tenant_id = ?').all(req.tenantId);
  res.json(users);
});

// PUT /api/auth/users/:id
router.put('/users/:id', authenticate, (req, res) => {
  const { name, role, active } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ? AND tenant_id = ?').get(req.params.id, req.tenantId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  db.prepare('UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role), active = COALESCE(?, active) WHERE id = ?')
    .run(name, role, active !== undefined ? (active ? 1 : 0) : null, req.params.id);

  res.json({ message: 'Usuário atualizado' });
});

module.exports = router;
