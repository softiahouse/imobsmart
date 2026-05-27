# DejaDeJugar — Automação VPS (n8n + Evolution API) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar n8n na VPS Hostinger, integrar com a Evolution API já existente e criar o fluxo de automação de leads: lead preenche formulário → Supabase → n8n → sequência WhatsApp + email (imediato + dias 2, 5, 10, 20).

**Architecture:** n8n via Docker Compose na VPS Hostinger. Evolution API já instalada. nginx como reverse proxy com SSL. Supabase Database Webhook dispara o fluxo ao inserir em `leads`.

**Tech Stack:** Docker Compose + n8n + nginx + Certbot + Evolution API + Supabase Webhooks

---

> **Pré-requisito:** Acesso SSH à VPS Hostinger. Docker e Docker Compose instalados.  
> **Pré-requisito:** Evolution API já instalada e funcional na VPS.  
> **Pré-requisito:** Tabela `leads` criada no Supabase (Task 12 do Plano 1).

---

## Task 1: Instalar n8n via Docker Compose

> Executar via SSH na VPS Hostinger.

- [ ] **Step 1: Criar directório para o n8n**

```bash
mkdir -p /opt/n8n
cd /opt/n8n
```

- [ ] **Step 2: Criar docker-compose.yml**

Criar `/opt/n8n/docker-compose.yml`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.dejadejugar.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.dejadejugar.com
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=SENHA_FORTE_AQUI
      - GENERIC_TIMEZONE=Europe/Madrid
      - TZ=Europe/Madrid
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
    driver: local
```

> Substituir `SENHA_FORTE_AQUI` por uma senha segura (mín. 16 caracteres).

- [ ] **Step 3: Iniciar n8n**

```bash
docker-compose up -d
```

Esperado: `Creating n8n_n8n_1 ... done`

- [ ] **Step 4: Verificar que n8n está a correr**

```bash
docker-compose ps
```

Esperado: `n8n_n8n_1   Up   0.0.0.0:5678->5678/tcp`

```bash
curl -I http://localhost:5678
```

Esperado: `HTTP/1.1 200 OK` ou `401 Unauthorized` (auth activa).

- [ ] **Step 5: Commit do docker-compose**

```bash
git add /opt/n8n/docker-compose.yml
# ou guardar numa cópia local e commitar depois
```

---

## Task 2: nginx Reverse Proxy + SSL

- [ ] **Step 1: Verificar se nginx está instalado**

```bash
nginx -v
```

Se não estiver: `apt-get install nginx -y`

- [ ] **Step 2: Criar configuração nginx para n8n**

Criar `/etc/nginx/sites-available/n8n.dejadejugar.com`:

```nginx
server {
    listen 80;
    server_name n8n.dejadejugar.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

- [ ] **Step 3: Activar o site**

```bash
ln -s /etc/nginx/sites-available/n8n.dejadejugar.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Esperado: `nginx: configuration file /etc/nginx/nginx.conf test is successful`

- [ ] **Step 4: Adicionar DNS — GoDaddy**

No GoDaddy → DNS Management para `dejadejugar.com`:
- Tipo: A
- Nome: `n8n`
- Valor: IP público da VPS Hostinger
- TTL: 600

Aguardar propagação (5-15 min).

- [ ] **Step 5: Verificar DNS**

```bash
nslookup n8n.dejadejugar.com
```

Esperado: resolver para o IP da VPS.

- [ ] **Step 6: Instalar Certbot e SSL**

```bash
apt-get install certbot python3-certbot-nginx -y
certbot --nginx -d n8n.dejadejugar.com
```

Seguir o prompt: email, aceitar termos, redireccionamento automático para HTTPS.

Esperado: `Certificate is saved at: /etc/letsencrypt/live/n8n.dejadejugar.com/`

- [ ] **Step 7: Verificar HTTPS**

```bash
curl -I https://n8n.dejadejugar.com
```

Esperado: `HTTP/2 200` ou `401` (auth activa).

Aceder a `https://n8n.dejadejugar.com` no browser → login com `admin` / senha definida.

---

## Task 3: Configurar Evolution API no n8n

> A Evolution API já está instalada na VPS. Vamos criar a credencial no n8n.

- [ ] **Step 1: Obter API Key da Evolution API**

```bash
# Verificar o docker-compose da Evolution API para encontrar a API key
cat /opt/evolution-api/docker-compose.yml | grep AUTHENTICATION_API_KEY
```

Ou aceder ao painel da Evolution API e copiar a Global API Key.

- [ ] **Step 2: Criar credencial no n8n**

Aceder a `https://n8n.dejadejugar.com`:
1. Settings → Credentials → New credential
2. Tipo: HTTP Header Auth
3. Nome: `Evolution API`
4. Header Name: `apikey`
5. Header Value: a API key copiada no Step 1
6. Guardar

- [ ] **Step 3: Verificar instância WhatsApp**

No painel da Evolution API, confirmar que existe uma instância conectada (QR Code lido, status "open"). Se não existir:

```bash
curl -X POST https://SEU_EVOLUTION_API_HOST/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{"instanceName": "dejadejugar", "qrcode": true}'
```

Ler QR Code com o WhatsApp Business.

---

## Task 4: Criar Workflow n8n — Fluxo de Leads

> Aceder a `https://n8n.dejadejugar.com` → Workflows → New Workflow.

- [ ] **Step 1: Criar nó Webhook (trigger)**

1. Add node → Webhook
2. HTTP Method: POST
3. Path: `nova-lead`
4. Authentication: None (o Supabase não envia auth por padrão)
5. Response Mode: Immediately
6. Copiar a URL do webhook: `https://n8n.dejadejugar.com/webhook/nova-lead`

> Esta URL vai para o Supabase Database Webhook (configurado na Task 12 do Plano 1, Step 6).

- [ ] **Step 2: Criar nó "Set" — extrair dados da lead**

Add node → Set (ou Edit Fields):

Definir campos a partir do body do webhook Supabase (formato `record.new`):

```
nome = {{ $json.record.name }}
email = {{ $json.record.email }}
telefone = {{ $json.record.phone }}
mensagem = {{ $json.record.message }}
data = {{ $json.record.created_at }}
```

- [ ] **Step 3: Criar nó HTTP Request — WhatsApp boas-vindas para lead**

Add node → HTTP Request:
- Method: POST
- URL: `https://SEU_EVOLUTION_HOST/message/sendText/dejadejugar`
- Authentication: Predefined Credential Type → HTTP Header Auth → "Evolution API"
- Body (JSON):

```json
{
  "number": "{{ $('Set').item.json.telefone }}",
  "text": "¡Hola {{ $('Set').item.json.nome }}! 👋\n\nGracias por contactar con DejaDeJugar. Has dado el primer paso más importante.\n\nEn breve recibirás orientación personalizada. Mientras tanto, puedes hacer el test gratuito en https://dejadejugar.com/quiz\n\n— Equipo DejaDeJugar"
}
```

- [ ] **Step 4: Criar nó HTTP Request — Notificação WhatsApp para Henrique**

Add node → HTTP Request (paralelo ao Step 3, ligar ambos ao nó Set):
- Method: POST
- URL: `https://SEU_EVOLUTION_HOST/message/sendText/dejadejugar`
- Body (JSON):

```json
{
  "number": "34XXXXXXXXX",
  "text": "🔔 *Nueva lead — DejaDeJugar*\n\n👤 Nome: {{ $('Set').item.json.nome }}\n📧 Email: {{ $('Set').item.json.email }}\n📱 Teléfono: {{ $('Set').item.json.telefone }}\n💬 Mensaje: {{ $('Set').item.json.mensagem }}\n\n🕐 {{ $('Set').item.json.data }}"
}
```

> Substituir `34XXXXXXXXX` pelo número de WhatsApp de Henrique (formato internacional sem `+`).

- [ ] **Step 5: Criar nó Wait — 2 dias**

Add node → Wait:
- Resume: At Specified Time
- Date and Time: `{{ $now.plus(2, 'days').toISO() }}`

- [ ] **Step 6: Criar nó HTTP Request — WhatsApp dia 2 (check-in)**

Add node → HTTP Request:
- URL: `https://SEU_EVOLUTION_HOST/message/sendText/dejadejugar`
- Body:

```json
{
  "number": "{{ $('Set').item.json.telefone }}",
  "text": "¡Hola {{ $('Set').item.json.nome }}! 🌱\n\nHace 2 días diste el primer paso. ¿Cómo te sientes hoy?\n\nRecuerda: el camino hacia el cambio empieza reconociendo el problema. Ya lo hiciste.\n\nSi tienes preguntas, estamos aquí. 💙\n\n— Equipo DejaDeJugar"
}
```

- [ ] **Step 7: Criar nó Wait — 3 dias (total 5 dias)**

Add node → Wait:
- Date and Time: `{{ $now.plus(3, 'days').toISO() }}`

- [ ] **Step 8: Criar nó HTTP Request — WhatsApp dia 5 (conteúdo de valor)**

Add node → HTTP Request:
- Body:

```json
{
  "number": "{{ $('Set').item.json.telefone }}",
  "text": "Hola {{ $('Set').item.json.nome }} 📖\n\n¿Sabías que el 85% de las personas con problemas de juego nunca buscan ayuda por no saber cómo empezar?\n\nHemos preparado un artículo gratuito que puede ayudarte: ¿Cómo funciona el ciclo del juego?\n\n👉 https://dejadejugar.com/blog\n\nLeer tarda 5 minutos y puede cambiar tu perspectiva.\n\n— Equipo DejaDeJugar"
}
```

- [ ] **Step 9: Criar nó Wait — 5 dias (total 10 dias)**

Add node → Wait:
- Date and Time: `{{ $now.plus(5, 'days').toISO() }}`

- [ ] **Step 10: Criar nó HTTP Request — WhatsApp dia 10 (oferta Módulo 1)**

Add node → HTTP Request:
- Body:

```json
{
  "number": "{{ $('Set').item.json.telefone }}",
  "text": "Hola {{ $('Set').item.json.nome }} 🎯\n\nHace 10 días preguntaste por DejaDeJugar. Queremos que sepas que el *Módulo 1 — Interrupción* está disponible por solo *€29,90*.\n\nEs el primer paso estructurado del método ISTOP:\n✅ 3 clases de 15-25 min\n✅ Contrato de Interrupción\n✅ 120 días de acceso\n\nEmpieza aquí 👉 https://dejadejugar.com/cadastrar\n\nCualquier duda, responde a este mensaje. 💙"
}
```

- [ ] **Step 11: Criar nó Wait — 10 dias (total 20 dias)**

Add node → Wait:
- Date and Time: `{{ $now.plus(10, 'days').toISO() }}`

- [ ] **Step 12: Criar nó HTTP Request — WhatsApp dia 20 (último follow-up)**

Add node → HTTP Request:
- Body:

```json
{
  "number": "{{ $('Set').item.json.telefone }}",
  "text": "Hola {{ $('Set').item.json.nome }} 👋\n\nEste es nuestro último mensaje automático.\n\nSi en algún momento decides dar el paso, estaremos aquí. El programa DejaDeJugar existe para ayudarte a recuperar el control — a tu ritmo.\n\nPuedes empezar cuando quieras en:\n👉 https://dejadejugar.com\n\nCuídate. 💙\n— Equipo DejaDeJugar"
}
```

- [ ] **Step 13: Ligar todos os nós em sequência**

Estrutura do workflow:

```
Webhook → Set → [WhatsApp lead (t=0) + WhatsApp Henrique (t=0)] → Wait 2d → WhatsApp dia 2 → Wait 3d → WhatsApp dia 5 → Wait 5d → WhatsApp dia 10 → Wait 10d → WhatsApp dia 20
```

Os dois nós de WhatsApp do t=0 correm em paralelo (ligar ambos ao nó Set).

- [ ] **Step 14: Activar workflow**

Clicar o toggle "Active" no topo direito do workflow.

- [ ] **Step 15: Guardar e testar**

1. Activar o Supabase Database Webhook para `leads` (se estava desactivado)
2. Preencher o formulário de lead em `http://localhost:5173/` (dev) ou `https://dejadejugar.com`
3. Verificar no n8n → Executions → deve aparecer uma execução bem sucedida
4. Verificar WhatsApp de teste (número de teste) — deve receber a mensagem de boas-vindas
5. Verificar WhatsApp de Henrique — deve receber o alerta de nova lead

---

## Task 5: Email de Notificação para Henrique (t=0)

> Adicionar um nó de email no passo t=0 (paralelo ao WhatsApp).

- [ ] **Step 1: Configurar credencial de email no n8n**

n8n Settings → Credentials → New:
- Tipo: SMTP
- Host: `smtp.resend.com`
- Port: 465
- SSL: true
- User: `resend`
- Password: Resend API Key

- [ ] **Step 2: Adicionar nó Send Email ao workflow**

Ligar ao nó Set (paralelo aos dois WhatsApp do t=0):
- To: `softiahouse@gmail.com`
- Subject: `🔔 Nueva lead — DejaDeJugar`
- Body HTML:

```html
<h2>Nueva lead recibida en DejaDeJugar.com</h2>
<table>
  <tr><td><strong>Nombre:</strong></td><td>{{ $('Set').item.json.nome }}</td></tr>
  <tr><td><strong>Email:</strong></td><td>{{ $('Set').item.json.email }}</td></tr>
  <tr><td><strong>Teléfono:</strong></td><td>{{ $('Set').item.json.telefone }}</td></tr>
  <tr><td><strong>Mensaje:</strong></td><td>{{ $('Set').item.json.mensagem }}</td></tr>
  <tr><td><strong>Fecha:</strong></td><td>{{ $('Set').item.json.data }}</td></tr>
</table>
```

- [ ] **Step 3: Salvar e re-testar**

Repetir o teste do Task 4 Step 15 — verificar chegada do email.

---

## Task 6: Activar Supabase Webhook em Produção

- [ ] **Step 1: Activar o webhook no Supabase**

Supabase Dashboard → Database → Webhooks → `lead-to-n8n`:
- Verificar que a URL é `https://n8n.dejadejugar.com/webhook/nova-lead`
- Estado: Enabled

- [ ] **Step 2: Teste end-to-end em produção**

1. Aceder a `https://dejadejugar.com`
2. Preencher o formulário de familiar/lead com número real
3. Verificar:
   - [ ] n8n recebe execução
   - [ ] WhatsApp de boas-vindas chega à lead
   - [ ] Email e WhatsApp de alerta chegam a Henrique
4. Aguardar dia 2 ou testar manualmente com execução forçada no n8n

---

## Notas de Operação

- **Logs do n8n:** `docker-compose logs -f n8n` (no directório `/opt/n8n`)
- **Reiniciar n8n:** `docker-compose restart n8n`
- **Update n8n:** `docker-compose pull && docker-compose up -d`
- **SSL auto-renewal:** Certbot configura cron automático. Verificar: `certbot renew --dry-run`
- **Numero Henrique no WhatsApp:** formato `34XXXXXXXXX` (ES) ou `55XXXXXXXXXXX` (BR) — sem `+`
- **Formato número lead:** verificar se Evolution API aceita `34XXXXXXXXX` ou `+34XXXXXXXXX` e ajustar template
