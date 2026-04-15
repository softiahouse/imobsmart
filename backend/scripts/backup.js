/**
 * Backup automático do SQLite
 * Corre via cron no Railway: node scripts/backup.js
 * Guarda até 7 backups diários em /app/data/backups/
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR    = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH     = path.join(DATA_DIR, 'crm.db');
const BACKUP_DIR  = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 7;

if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Base de dados não encontrada:', DB_PATH);
  process.exit(1);
}

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Nome do ficheiro com timestamp
const ts       = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const destPath = path.join(BACKUP_DIR, `crm-${ts}.db`);

// Copiar ficheiro (SQLite é seguro de copiar em modo WAL)
fs.copyFileSync(DB_PATH, destPath);

const sizeMB = (fs.statSync(destPath).size / 1024 / 1024).toFixed(2);
console.log(`✅ Backup criado: ${path.basename(destPath)} (${sizeMB} MB)`);

// Manter apenas os últimos MAX_BACKUPS
const backups = fs.readdirSync(BACKUP_DIR)
  .filter(f => f.startsWith('crm-') && f.endsWith('.db'))
  .sort();

if (backups.length > MAX_BACKUPS) {
  const toDelete = backups.slice(0, backups.length - MAX_BACKUPS);
  toDelete.forEach(f => {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
    console.log(`🗑️  Backup antigo removido: ${f}`);
  });
}

console.log(`📦 Total de backups: ${Math.min(backups.length, MAX_BACKUPS)}/${MAX_BACKUPS}`);
