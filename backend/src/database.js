const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Railway monta o volume persistente em /app/data
// Localmente usa a pasta data/ relativa ao projecto
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'crm.db');

// Garantir que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Ativar WAL para melhor performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ========== SCHEMA ==========

db.exec(`
  -- Tenants (White Label)
  CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#6366f1',
    secondary_color TEXT DEFAULT '#8b5cf6',
    tagline TEXT,
    domain TEXT,
    plan TEXT DEFAULT 'basic',
    active INTEGER DEFAULT 1,
    openai_api_key TEXT,
    ai_prompt TEXT DEFAULT 'Você é um assistente de vendas prestativo. Responda de forma profissional e amigável.',
    ai_enabled INTEGER DEFAULT 0,
    whatsapp_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Usuários
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'agent',
    avatar TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, email)
  );

  -- Contatos / Leads
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    company TEXT,
    position TEXT,
    source TEXT DEFAULT 'manual',
    tags TEXT DEFAULT '[]',
    notes TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'lead',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
  );

  -- Estágios do Funil
  CREATE TABLE IF NOT EXISTS pipeline_stages (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  );

  -- Negociações (Cards do Kanban)
  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    contact_id TEXT,
    stage_id TEXT NOT NULL,
    value REAL DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    probability INTEGER DEFAULT 50,
    expected_close_date DATE,
    assigned_to TEXT,
    notes TEXT,
    position INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
  );

  -- Conversas WhatsApp
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    contact_id TEXT,
    whatsapp_jid TEXT NOT NULL,
    contact_name TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'open',
    assigned_to TEXT,
    last_message TEXT,
    last_message_at DATETIME,
    unread_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
  );

  -- Mensagens
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    from_me INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    status TEXT DEFAULT 'sent',
    ai_generated INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );

  -- Atividades / Timeline
  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    contact_id TEXT,
    deal_id TEXT,
    user_id TEXT,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  );

  -- Configurações do Agente IA
  CREATE TABLE IF NOT EXISTS ai_rules (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    trigger_keyword TEXT,
    response TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  );
`);

module.exports = db;
