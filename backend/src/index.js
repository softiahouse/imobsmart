require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const { setIO } = require('./services/whatsappService');

const app = express();

// Trust proxy — obrigatório no Railway/Render por estar atrás de reverse proxy
app.set('trust proxy', 1);

const server = http.createServer(app);

// CORS: aceita múltiplos domínios (local + produção)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sem origin (mobile apps, Postman, health checks)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado: ${origin}`));
  },
  credentials: true,
};

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
});

// Injetar socket.io no serviço de WhatsApp
setIO(io);

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/pipeline', require('./routes/pipeline'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/tenants', require('./routes/tenants'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0', timestamp: new Date() }));

// Socket.IO - autenticação e salas por tenant
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token necessário'));

  const jwt = require('jsonwebtoken');
  const db = require('./database');
  const JWT_SECRET = process.env.JWT_SECRET || 'soft-ia-house-secret-key';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
    if (!user) return next(new Error('Usuário não encontrado'));
    socket.user = user;
    socket.tenantId = user.tenant_id;
    next();
  } catch {
    next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  socket.join(`tenant_${socket.tenantId}`);
  console.log(`✅ Socket: ${socket.user?.name} conectado`);
  socket.on('disconnect', () => console.log(`❌ Socket: ${socket.user?.name} desconectado`));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 CRM Soft IA House - Backend      ║
║   📡 API: http://localhost:${PORT}/api   ║
║   🌍 Env: ${process.env.NODE_ENV || 'development'}                 ║
╚═══════════════════════════════════════╝
  `);

  // Auto-seed: popula o banco na primeira inicialização (se estiver vazio)
  try {
    const { runSeed } = require('./seed');
    runSeed();
  } catch (err) {
    console.error('⚠️  Erro no auto-seed:', err.message);
  }
});

module.exports = { app, server };
