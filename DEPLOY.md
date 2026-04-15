# 🚀 Deploy — softiahouse.com

Stack: **Vercel** (frontend) + **Railway** (backend) + **GoDaddy** (DNS)  
Tempo estimado: **~30 minutos**

---

## Pré-requisitos

- [ ] Conta GitHub: https://github.com (grátis)
- [ ] Conta Railway: https://railway.app (grátis, depois $5/mês)
- [ ] Conta Vercel: https://vercel.com (grátis)
- [ ] Acesso ao GoDaddy DNS do domínio softiahouse.com
- [ ] Node.js 20+ instalado localmente

---

## PASSO 1 — GitHub: criar repositório

```bash
# Na pasta raiz do projecto (softiahousecrm/)
git init
git add .
git commit -m "feat: CRM Soft IA House MVP inicial"

# Criar repo no GitHub (github.com/new) e depois:
git remote add origin https://github.com/SEU_USER/crm-soft-ia-house.git
git branch -M main
git push -u origin main
```

> ⚠️ O `.gitignore` já exclui `node_modules/`, `.env` e a base de dados.

---

## PASSO 2 — Railway: deploy do backend

### 2.1 Criar projecto

1. Entrar em https://railway.app → **New Project**
2. Escolher **Deploy from GitHub repo**
3. Seleccionar o repositório `crm-soft-ia-house`
4. Railway vai detectar o `railway.json` automaticamente

### 2.2 Volume persistente (CRÍTICO para SQLite + WhatsApp)

1. No painel do serviço → **Volumes** → **Add Volume**
2. Mount path: `/app/data`
3. Guardar

> Sem este volume, a base de dados e as sessões WhatsApp perdem-se a cada deploy.

### 2.3 Variáveis de ambiente

No painel do serviço → **Variables** → adicionar cada uma:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | *(gerar abaixo)* |
| `FRONTEND_URL` | `https://app.softiahouse.com` |
| `DATA_DIR` | `/app/data` |
| `OPENAI_API_KEY` | `sk-...` *(opcional)* |

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Domínio personalizado no Railway

1. Settings → **Domains** → **Add Custom Domain**
2. Escrever: `api.softiahouse.com`
3. Railway mostra um valor CNAME — guardar para o Passo 4

### 2.5 Seed da base de dados (primeira vez)

Após o primeiro deploy ter sucesso:

1. Railway → painel do serviço → **Shell** (ou Settings → Deploy → Run Command)
2. Executar:
```bash
node src/seed.js
```

---

## PASSO 3 — Vercel: deploy do frontend

### 3.1 Criar projecto

1. Entrar em https://vercel.com → **Add New Project**
2. Importar o repositório `crm-soft-ia-house` do GitHub
3. **Root Directory**: `frontend`
4. Framework: **Vite** (detectado automaticamente)

### 3.2 Variáveis de ambiente

Em **Environment Variables** → adicionar:

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://api.softiahouse.com` |

> Adicionar para os três ambientes: Production, Preview, Development.

### 3.3 Domínio personalizado no Vercel

1. Settings → **Domains** → **Add**
2. Escrever: `app.softiahouse.com`
3. Vercel mostra um valor CNAME — guardar para o Passo 4

### 3.4 Deploy

Clicar **Deploy**. O Vercel faz `npm install` + `npm run build` automaticamente.  
A partir daqui, cada `git push main` faz deploy automático.

---

## PASSO 4 — GoDaddy: configurar DNS

1. Entrar em https://dcc.godaddy.com → **DNS** → domínio `softiahouse.com`
2. Adicionar dois registos do tipo **CNAME**:

| Tipo | Nome | Valor | TTL |
|---|---|---|---|
| CNAME | `app` | *(valor CNAME do Vercel)* | 1 hora |
| CNAME | `api` | *(valor CNAME do Railway)* | 1 hora |

> Os registos DNS podem demorar até 24h a propagar, mas normalmente ficam activos em menos de 1 hora.

### Verificar propagação

```bash
# No terminal:
nslookup app.softiahouse.com
nslookup api.softiahouse.com

# Ou online:
# https://dnschecker.org
```

---

## PASSO 5 — SSL (HTTPS)

Tanto o Vercel como o Railway emitem certificados SSL gratuitos via Let's Encrypt **automaticamente** depois de o DNS estar configurado. Não é necessário fazer nada.

Aguardar 5-10 minutos após o DNS propagar e o HTTPS estará activo.

---

## PASSO 6 — Backup automático (opcional mas recomendado)

No Railway, criar um segundo serviço do tipo **Cron Job**:

1. **New Service** → **Cron Job**
2. Command: `node scripts/backup.js`
3. Schedule: `0 3 * * *` *(todos os dias às 3h da manhã)*
4. Ligar o mesmo volume `/app/data`
5. Adicionar a mesma variável `DATA_DIR=/app/data`

Os backups ficam guardados em `/app/data/backups/` com os últimos 7 dias.

---

## Verificação final

Abrir no browser:

- `https://api.softiahouse.com/api/health` → deve responder `{"status":"ok"}`
- `https://app.softiahouse.com` → deve abrir a página de login

Login de teste:
- **Slug**: `fedchess`
- **Email**: `admin@fedchess.es`
- **Senha**: `admin123`

---

## URLs finais

| Serviço | URL |
|---|---|
| App (clientes) | https://app.softiahouse.com |
| API (backend) | https://api.softiahouse.com |
| Health check | https://api.softiahouse.com/api/health |

---

## Actualizações futuras

Para fazer um novo deploy basta:

```bash
git add .
git commit -m "fix: descrição da mudança"
git push origin main
```

O Vercel e o Railway detectam o push e fazem deploy automático em paralelo.

---

## Resolução de problemas

**"CORS bloqueado"** — verificar que `FRONTEND_URL` no Railway é exactamente `https://app.softiahouse.com` sem slash no final.

**"Cannot connect to WhatsApp"** — confirmar que o volume `/app/data` está montado no Railway e que `DATA_DIR=/app/data` está nas variáveis.

**"JWT invalid"** — confirmar que `JWT_SECRET` tem o mesmo valor em todos os serviços e não foi alterado após logins existentes.

**Frontend mostra ecrã em branco** — abrir a consola do browser (F12), verificar se `VITE_API_URL` está correcto e se a API responde em `https://api.softiahouse.com/api/health`.
