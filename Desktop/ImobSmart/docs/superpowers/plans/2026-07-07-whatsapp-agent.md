# WhatsApp Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy an AI-powered WhatsApp agent on +34 602 427 508 using Evolution API + n8n + GPT-4o for B2B sales automation (inbound + outbound drip).

**Architecture:** Evolution API runs as a Docker container on EasyPanel, connected to WhatsApp via QR code. n8n (already running on EasyPanel) receives webhooks from Evolution API, calls GPT-4o for responses, sends replies back via Evolution API, and persists leads/conversations to Supabase. A cron-based outbound flow sends drip messages to prospects from the Supabase prospects table.

**Tech Stack:** Evolution API v2 (Docker), n8n (existing), OpenAI GPT-4o, Supabase (existing), EasyPanel (existing)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `supabase/migrations/002_prospects_b2b_columns.sql` | Add missing B2B columns to prospects table |
| `n8n/whatsapp-inbound.json` | n8n workflow JSON for import — inbound message handling |
| `n8n/whatsapp-outbound-drip.json` | n8n workflow JSON for import — outbound drip campaign |
| `n8n/system-prompt.txt` | GPT-4o system prompt for the sales agent |
| `docs/evolution-api-setup.md` | Step-by-step EasyPanel setup guide for Evolution API |

---

### Task 1: Supabase Migration — Add B2B columns to prospects

The TypeScript types define `b2b_stage`, `email`, `contact_name`, `deal_value`, `next_followup`, `source` but the SQL schema is missing them. The prospect pipeline UI already references `b2b_stage`. This migration adds the missing columns.

**Files:**
- Create: `supabase/migrations/002_prospects_b2b_columns.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/002_prospects_b2b_columns.sql

-- Add B2B pipeline columns to prospects table
create type b2b_stage as enum ('new', 'contacted', 'meeting', 'proposal', 'negotiation', 'won', 'lost');

alter table prospects
  add column if not exists email text,
  add column if not exists contact_name text,
  add column if not exists b2b_stage b2b_stage default 'new',
  add column if not exists deal_value numeric(10, 2),
  add column if not exists next_followup timestamptz,
  add column if not exists source text default 'manual';

-- Index for outbound drip query: pick next prospect to contact
create index if not exists idx_prospects_b2b_stage on prospects(b2b_stage)
  where b2b_stage = 'new' and phone is not null;

-- Index for daily limit check
create index if not exists idx_prospects_contacted_at on prospects(contacted_at);
```

- [ ] **Step 2: Run migration on Supabase**

Go to the Supabase dashboard → SQL Editor → paste and execute the migration above.

Verify with:
```sql
select column_name, data_type from information_schema.columns
where table_name = 'prospects' order by ordinal_position;
```

Expected: all new columns appear (`email`, `contact_name`, `b2b_stage`, `deal_value`, `next_followup`, `source`).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/002_prospects_b2b_columns.sql
git commit -m "feat: add B2B pipeline columns to prospects table"
```

---

### Task 2: Deploy Evolution API on EasyPanel

This is an infrastructure task done via the EasyPanel web UI. No code files — but we document the steps.

**Files:**
- Create: `docs/evolution-api-setup.md`

- [ ] **Step 1: Create setup documentation**

```markdown
# Evolution API — EasyPanel Setup

## 1. Create new service in EasyPanel

- Login: http://46.202.129.29:3000
- Click "+ New" → "App"
- Name: `evolution`
- Image: `atendai/evolution-api:v2.2.3`
- Port: 8080

## 2. Environment variables

| Variable | Value |
|----------|-------|
| `SERVER_URL` | `https://evolution.imobsmart.es` |
| `AUTHENTICATION_TYPE` | `apikey` |
| `AUTHENTICATION_API_KEY` | *(generate a random 32-char key)* |
| `AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES` | `true` |
| `WEBHOOK_GLOBAL_ENABLED` | `true` |
| `WEBHOOK_GLOBAL_URL` | `https://n8n.imobsmart.es/webhook/whatsapp-inbound` |
| `WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS` | `false` |
| `WEBHOOK_EVENTS_MESSAGES_UPSERT` | `true` |
| `DATABASE_ENABLED` | `false` |
| `DATABASE_PROVIDER` | `postgresql` |
| `LOG_LEVEL` | `WARN` |

## 3. Domain

- Add domain: `evolution.imobsmart.es`
- Enable HTTPS (Let's Encrypt)
- Container port: 8080

## 4. Persistent volume

- Mount path: `/evolution/instances`
- This stores the WhatsApp session so it survives container restarts

## 5. Deploy and verify

- Click "Implantar"
- Access `https://evolution.imobsmart.es` — should show Evolution API welcome page
- Test health: `GET https://evolution.imobsmart.es/instance/fetchInstances` with header `apikey: YOUR_KEY`

## 6. Create WhatsApp instance

```bash
curl -X POST https://evolution.imobsmart.es/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "imobsmart",
    "integration": "WHATSAPP-BAILEYS",
    "qrcode": true
  }'
```

Response includes a QR code. Scan it with the iPhone WhatsApp (+34 602 427 508).

## 7. Verify connection

```bash
curl https://evolution.imobsmart.es/instance/connectionState/imobsmart \
  -H "apikey: YOUR_API_KEY"
```

Expected: `{ "state": "open" }`
```

- [ ] **Step 2: Commit**

```bash
git add docs/evolution-api-setup.md
git commit -m "docs: add Evolution API EasyPanel setup guide"
```

---

### Task 3: GPT-4o System Prompt

Store the system prompt as a standalone file for easy editing without touching n8n workflows.

**Files:**
- Create: `n8n/system-prompt.txt`

- [ ] **Step 1: Create system prompt file**

```
Eres un asesor comercial de ImobSmart, plataforma SaaS para inmobiliarias.
Detecta el idioma del mensaje y responde en el mismo idioma (ES/EN/PT).

Tu objetivo:
- Presentar ImobSmart (autopublicación en redes sociales, CRM Kanban, agente IA 24/7)
- Responder dudas sobre planes:
  • Starter: 9,90€/mes — hasta 20 inmuebles, 1 red social, CRM, dashboard básico. Incluye 1 mes gratis sin tarjeta de crédito.
  • Pro: 39,90€/mes — hasta 50 inmuebles, 4 redes sociales, CRM Kanban + Pipeline, agente IA WhatsApp 24/7, autopublicación TikTok, dashboard inteligente, soporte prioritario.
  • Turbo: 59,90€/mes — inmuebles ilimitados, todas las redes sociales, agente IA WhatsApp + Webchat, Google Ads integrado, dominio personalizado, prospección B2B, dashboard avanzado, soporte VIP.
- Enviar link de registro: https://imobsmart.es/signup
- Si piden hablar con una persona, responde: "Por supuesto, un asesor de nuestro equipo se pondrá en contacto contigo en breve."

Reglas:
- Tono profesional pero cercano
- Mensajes cortos: máximo 3 frases por respuesta
- No inventes funcionalidades que no existen
- No ofrezcas descuentos
- Nunca digas que eres una IA o un bot — preséntate como "el equipo de ImobSmart"
- Si el usuario dice "no", "no me interesa" o "para", responde: "Entendido, gracias por tu tiempo. Si en el futuro necesitas algo, aquí estamos. ¡Un saludo!" y no envíes más mensajes
```

- [ ] **Step 2: Commit**

```bash
git add n8n/system-prompt.txt
git commit -m "feat: add GPT-4o system prompt for WhatsApp agent"
```

---

### Task 4: n8n Inbound Workflow

Create the n8n workflow JSON that handles incoming WhatsApp messages. This JSON is imported into n8n via the UI.

**Files:**
- Create: `n8n/whatsapp-inbound.json`

- [ ] **Step 1: Create inbound workflow JSON**

The workflow has these nodes:

1. **Webhook** — receives POST from Evolution API at `/webhook/whatsapp-inbound`
2. **Extract Message** — parses Evolution API payload to get `phone` and `text`
3. **Filter** — ignores status updates (only processes `messages.upsert` with actual text)
4. **Lookup Lead** — Supabase query: select lead by phone
5. **IF Lead Exists** — branches on whether lead was found
6. **Create Lead** (if new) — Supabase insert into `leads` table
7. **Fetch History** (if existing) — Supabase query: get conversation messages
8. **Build Messages Array** — constructs OpenAI messages array with system prompt + history + new message
9. **GPT-4o** — OpenAI Chat Completion
10. **Send Reply** — HTTP POST to Evolution API `/message/sendText/imobsmart`
11. **Save Messages** — Supabase upsert conversation with new messages appended
12. **Check Escalation** — if GPT response mentions "asesor se pondrá en contacto", send alert to Paulo

```json
{
  "name": "WhatsApp Inbound Agent",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "whatsapp-inbound",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json.body || $input.first().json;\nconst event = body.event;\n\nif (event !== 'messages.upsert') return [];\n\nconst data = body.data;\nconst key = data.key || {};\nconst remoteJid = key.remoteJid || '';\nconst fromMe = key.fromMe || false;\n\nif (fromMe) return [];\nif (remoteJid.includes('@g.us')) return [];\n\nconst phone = remoteJid.replace('@s.whatsapp.net', '');\nconst text = data.message?.conversation || data.message?.extendedTextMessage?.text || '';\n\nif (!text) return [];\n\nreturn [{ json: { phone, text, messageId: key.id, timestamp: new Date().toISOString() } }];"
      },
      "id": "extract",
      "name": "Extract Message",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [470, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT l.*, c.id as conv_id, c.messages as history FROM leads l LEFT JOIN conversations c ON c.lead_id = l.id WHERE l.phone = '{{ $json.phone }}' AND l.source = 'whatsapp' ORDER BY l.created_at DESC LIMIT 1",
        "options": {}
      },
      "id": "lookup_lead",
      "name": "Lookup Lead",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [690, 300],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
          "conditions": [
            { "id": "has_lead", "leftValue": "={{ $json.id }}", "rightValue": "", "operator": { "type": "string", "operation": "exists" } }
          ]
        }
      },
      "id": "if_lead_exists",
      "name": "IF Lead Exists",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [910, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO leads (org_id, name, phone, source, temperature, kanban_stage) VALUES ((SELECT id FROM organizations LIMIT 1), 'WhatsApp Lead', '{{ $('Extract Message').item.json.phone }}', 'whatsapp', 'hot', 'new') RETURNING *, null as conv_id, '[]'::jsonb as history",
        "options": {}
      },
      "id": "create_lead",
      "name": "Create Lead",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [1130, 450],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    },
    {
      "parameters": {
        "jsCode": "const lead = $input.first().json;\nconst history = lead.history || [];\nconst recentHistory = Array.isArray(history) ? history.slice(-10) : [];\nconst userMsg = $('Extract Message').first().json.text;\n\nconst systemPrompt = `Eres un asesor comercial de ImobSmart, plataforma SaaS para inmobiliarias.\nDetecta el idioma del mensaje y responde en el mismo idioma (ES/EN/PT).\n\nTu objetivo:\n- Presentar ImobSmart (autopublicación en redes sociales, CRM Kanban, agente IA 24/7)\n- Responder dudas sobre planes:\n  • Starter: 9,90€/mes — hasta 20 inmuebles, 1 red social, CRM, dashboard básico. Incluye 1 mes gratis sin tarjeta de crédito.\n  • Pro: 39,90€/mes — hasta 50 inmuebles, 4 redes sociales, CRM Kanban + Pipeline, agente IA WhatsApp 24/7, autopublicación TikTok, dashboard inteligente, soporte prioritario.\n  • Turbo: 59,90€/mes — inmuebles ilimitados, todas las redes sociales, agente IA WhatsApp + Webchat, Google Ads integrado, dominio personalizado, prospección B2B, dashboard avanzado, soporte VIP.\n- Enviar link de registro: https://imobsmart.es/signup\n- Si piden hablar con una persona, responde: \"Por supuesto, un asesor de nuestro equipo se pondrá en contacto contigo en breve.\"\n\nReglas:\n- Tono profesional pero cercano\n- Mensajes cortos: máximo 3 frases por respuesta\n- No inventes funcionalidades que no existen\n- No ofrezcas descuentos\n- Nunca digas que eres una IA o un bot — preséntate como \"el equipo de ImobSmart\"\n- Si el usuario dice \"no\", \"no me interesa\" o \"para\", responde: \"Entendido, gracias por tu tiempo. Si en el futuro necesitas algo, aquí estamos. ¡Un saludo!\" y no envíes más mensajes`;\n\nconst messages = [\n  { role: 'system', content: systemPrompt },\n  ...recentHistory.map(m => ({ role: m.role, content: m.content })),\n  { role: 'user', content: userMsg }\n];\n\nreturn [{ json: { messages, leadId: lead.id, convId: lead.conv_id, phone: $('Extract Message').first().json.phone, userMsg } }];"
      },
      "id": "build_prompt",
      "name": "Build Prompt",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1350, 300]
    },
    {
      "parameters": {
        "resource": "chat",
        "model": "gpt-4o",
        "messages": {
          "values": []
        },
        "options": {
          "maxTokens": 300,
          "temperature": 0.7
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ model: 'gpt-4o', messages: $json.messages, max_tokens: 300, temperature: 0.7 }) }}"
      },
      "id": "gpt4o",
      "name": "GPT-4o",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1570, 300],
      "parameters_override": {
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "Authorization", "value": "=Bearer {{ $credentials.httpHeaderAuth.value }}" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ model: 'gpt-4o', messages: $json.messages, max_tokens: 300, temperature: 0.7 }) }}"
      }
    },
    {
      "parameters": {
        "jsCode": "const response = $input.first().json;\nconst reply = response.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.';\nconst prev = $('Build Prompt').first().json;\n\nreturn [{ json: { reply, leadId: prev.leadId, convId: prev.convId, phone: prev.phone, userMsg: prev.userMsg } }];"
      },
      "id": "extract_reply",
      "name": "Extract Reply",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1790, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $env.EVOLUTION_API_URL }}/message/sendText/imobsmart",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "apikey", "value": "={{ $env.EVOLUTION_API_KEY }}" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ number: $json.phone, text: $json.reply }) }}"
      },
      "id": "send_reply",
      "name": "Send Reply",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [2010, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO conversations (lead_id, channel, messages) VALUES ('{{ $('Extract Reply').item.json.leadId }}', 'whatsapp', '{{ JSON.stringify([{role:\"user\",content:$('Extract Reply').item.json.userMsg,timestamp:new Date().toISOString()},{role:\"assistant\",content:$('Extract Reply').item.json.reply,timestamp:new Date().toISOString()}]) }}'::jsonb) ON CONFLICT (lead_id, channel) DO UPDATE SET messages = conversations.messages || '{{ JSON.stringify([{role:\"user\",content:$('Extract Reply').item.json.userMsg,timestamp:new Date().toISOString()},{role:\"assistant\",content:$('Extract Reply').item.json.reply,timestamp:new Date().toISOString()}]) }}'::jsonb",
        "options": {}
      },
      "id": "save_conversation",
      "name": "Save Conversation",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [2230, 300],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    },
    {
      "parameters": {
        "jsCode": "const reply = $('Extract Reply').first().json.reply;\nconst phone = $('Extract Reply').first().json.phone;\nconst needsEscalation = reply.includes('se pondrá en contacto') || reply.includes('will contact you');\n\nif (needsEscalation) {\n  return [{ json: { escalate: true, phone, reply } }];\n}\nreturn [{ json: { escalate: false } }];"
      },
      "id": "check_escalation",
      "name": "Check Escalation",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2450, 300]
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [
            { "id": "needs_escalation", "leftValue": "={{ $json.escalate }}", "rightValue": true, "operator": { "type": "boolean", "operation": "equals" } }
          ]
        }
      },
      "id": "if_escalation",
      "name": "IF Escalation",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [2670, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $env.EVOLUTION_API_URL }}/message/sendText/imobsmart",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "apikey", "value": "={{ $env.EVOLUTION_API_KEY }}" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ number: $env.PAULO_WHATSAPP, text: '🔔 Lead pediu contato humano!\\nTelefone: ' + $json.phone + '\\nÚltima mensagem do agente: ' + $json.reply }) }}"
      },
      "id": "alert_paulo",
      "name": "Alert Paulo",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [2890, 200]
    },
    {
      "parameters": { "respondWith": "json", "responseBody": "={{ JSON.stringify({ status: 'ok' }) }}" },
      "id": "respond",
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [2890, 400]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Extract Message", "type": "main", "index": 0 }]] },
    "Extract Message": { "main": [[{ "node": "Lookup Lead", "type": "main", "index": 0 }]] },
    "Lookup Lead": { "main": [[{ "node": "IF Lead Exists", "type": "main", "index": 0 }]] },
    "IF Lead Exists": {
      "main": [
        [{ "node": "Build Prompt", "type": "main", "index": 0 }],
        [{ "node": "Create Lead", "type": "main", "index": 0 }]
      ]
    },
    "Create Lead": { "main": [[{ "node": "Build Prompt", "type": "main", "index": 0 }]] },
    "Build Prompt": { "main": [[{ "node": "GPT-4o", "type": "main", "index": 0 }]] },
    "GPT-4o": { "main": [[{ "node": "Extract Reply", "type": "main", "index": 0 }]] },
    "Extract Reply": { "main": [[{ "node": "Send Reply", "type": "main", "index": 0 }]] },
    "Send Reply": { "main": [[{ "node": "Save Conversation", "type": "main", "index": 0 }]] },
    "Save Conversation": { "main": [[{ "node": "Check Escalation", "type": "main", "index": 0 }]] },
    "Check Escalation": { "main": [[{ "node": "IF Escalation", "type": "main", "index": 0 }]] },
    "IF Escalation": {
      "main": [
        [{ "node": "Alert Paulo", "type": "main", "index": 0 }],
        [{ "node": "Respond", "type": "main", "index": 0 }]
      ]
    },
    "Alert Paulo": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
  },
  "settings": { "executionOrder": "v1" }
}
```

- [ ] **Step 2: Import into n8n**

1. Open n8n UI
2. Click "+" to create new workflow
3. Click "..." menu → "Import from File"
4. Select `n8n/whatsapp-inbound.json`
5. Configure Supabase credential (replace `SUPABASE_CREDENTIAL_ID`)
6. Add OpenAI HTTP Header Auth credential with API key
7. Set environment variables in n8n Settings → Variables:
   - `EVOLUTION_API_URL` = `https://evolution.imobsmart.es`
   - `EVOLUTION_API_KEY` = *(your Evolution API key)*
   - `PAULO_WHATSAPP` = *(Paulo's personal number)*
8. Activate the workflow

- [ ] **Step 3: Test inbound flow**

Send a WhatsApp message to +34 602 427 508 from a different phone:
```
Hola, quiero información sobre ImobSmart
```

Expected:
- n8n webhook receives the message
- GPT-4o generates a response about ImobSmart plans
- Reply arrives on WhatsApp within 5-10 seconds
- New lead appears in Supabase `leads` table
- Conversation saved in `conversations` table

- [ ] **Step 4: Commit**

```bash
git add n8n/whatsapp-inbound.json
git commit -m "feat: add n8n inbound WhatsApp agent workflow"
```

---

### Task 5: n8n Outbound Drip Workflow

Create the n8n workflow JSON for the outbound drip campaign that sends personalized messages to prospects from the Supabase prospects table.

**Files:**
- Create: `n8n/whatsapp-outbound-drip.json`

- [ ] **Step 1: Create outbound workflow JSON**

The workflow has these nodes:

1. **Cron** — every 30 minutes, 09:00–19:00 Madrid time, Mon–Fri
2. **Check Daily Limit** — count prospects contacted today
3. **IF Under Limit** — only proceed if < 10 sent today
4. **Pick Next Prospect** — select oldest `new` prospect with phone
5. **IF Prospect Found** — only proceed if there's someone to contact
6. **Build Message** — personalize the intro message with prospect data
7. **Send Message** — POST to Evolution API
8. **Update Prospect** — set `b2b_stage = 'contacted'`, `contacted_at = now()`

```json
{
  "name": "WhatsApp Outbound Drip",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "triggerAtMinute": 0,
              "triggerAtHour": 9
            }
          ]
        },
        "options": { "timezone": "Europe/Madrid" }
      },
      "id": "cron",
      "name": "Every 30min (9-19h)",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [250, 300],
      "notes": "Adjust cron: */30 9-18 * * 1-5 (every 30min, 9-19h, Mon-Fri, Madrid timezone)"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT count(*)::int as sent_today FROM prospects WHERE contacted_at >= current_date AND contacted_at < current_date + interval '1 day'",
        "options": {}
      },
      "id": "check_limit",
      "name": "Check Daily Limit",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [470, 300],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [
            { "id": "under_limit", "leftValue": "={{ $json.sent_today }}", "rightValue": 10, "operator": { "type": "number", "operation": "lt" } }
          ]
        }
      },
      "id": "if_under_limit",
      "name": "IF Under Limit",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [690, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM prospects WHERE b2b_stage = 'new' AND phone IS NOT NULL ORDER BY created_at ASC LIMIT 1",
        "options": {}
      },
      "id": "pick_prospect",
      "name": "Pick Next Prospect",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [910, 250],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [
            { "id": "has_prospect", "leftValue": "={{ $json.id }}", "rightValue": "", "operator": { "type": "string", "operation": "exists" } }
          ]
        }
      },
      "id": "if_prospect_found",
      "name": "IF Prospect Found",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1130, 250]
    },
    {
      "parameters": {
        "jsCode": "const p = $input.first().json;\nconst name = p.contact_name || p.business_name;\nconst msg = `Hola ${name}, soy del equipo de ImobSmart 👋\\nVi que ${p.business_name} trabaja con inmuebles en ${p.city}.\\n\\nTenemos una plataforma que publica automáticamente tus inmuebles en Instagram, Facebook y TikTok, y atiende leads con IA 24/7.\\n\\n¿Te gustaría ver cómo funciona? Es gratis probarlo 1 mes.\\n👉 https://imobsmart.es`;\n\nreturn [{ json: { phone: p.phone, message: msg, prospectId: p.id } }];"
      },
      "id": "build_message",
      "name": "Build Message",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1350, 200]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{ $env.EVOLUTION_API_URL }}/message/sendText/imobsmart",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "apikey", "value": "={{ $env.EVOLUTION_API_KEY }}" }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ number: $json.phone, text: $json.message }) }}"
      },
      "id": "send_message",
      "name": "Send Message",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1570, 200]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "UPDATE prospects SET b2b_stage = 'contacted', contacted_at = now() WHERE id = '{{ $('Build Message').item.json.prospectId }}'",
        "options": {}
      },
      "id": "update_prospect",
      "name": "Update Prospect",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [1790, 200],
      "credentials": { "supabaseApi": { "id": "SUPABASE_CREDENTIAL_ID", "name": "Supabase" } }
    }
  ],
  "connections": {
    "Every 30min (9-19h)": { "main": [[{ "node": "Check Daily Limit", "type": "main", "index": 0 }]] },
    "Check Daily Limit": { "main": [[{ "node": "IF Under Limit", "type": "main", "index": 0 }]] },
    "IF Under Limit": { "main": [[{ "node": "Pick Next Prospect", "type": "main", "index": 0 }], []] },
    "Pick Next Prospect": { "main": [[{ "node": "IF Prospect Found", "type": "main", "index": 0 }]] },
    "IF Prospect Found": { "main": [[{ "node": "Build Message", "type": "main", "index": 0 }], []] },
    "Build Message": { "main": [[{ "node": "Send Message", "type": "main", "index": 0 }]] },
    "Send Message": { "main": [[{ "node": "Update Prospect", "type": "main", "index": 0 }]] }
  },
  "settings": { "executionOrder": "v1", "timezone": "Europe/Madrid" }
}
```

- [ ] **Step 2: Import into n8n**

1. Open n8n UI
2. Import `n8n/whatsapp-outbound-drip.json`
3. Configure Supabase credential
4. Adjust cron schedule: click on the Schedule Trigger node → set to "Cron" → expression `*/30 9-18 * * 1-5`
5. Activate the workflow

- [ ] **Step 3: Test outbound flow**

1. Insert a test prospect in Supabase:
```sql
INSERT INTO prospects (city, country, business_name, phone, b2b_stage, source)
VALUES ('Torrevieja', 'ES', 'Test Inmobiliaria', 'YOUR_TEST_PHONE', 'new', 'manual');
```
2. Manually trigger the workflow in n8n (click "Test Workflow")
3. Expected: message arrives on the test phone, prospect updated to `contacted`
4. Delete test prospect after verification

- [ ] **Step 4: Commit**

```bash
git add n8n/whatsapp-outbound-drip.json
git commit -m "feat: add n8n outbound drip campaign workflow"
```

---

### Task 6: End-to-End Verification

- [ ] **Step 1: Verify Evolution API is connected**

```bash
curl https://evolution.imobsmart.es/instance/connectionState/imobsmart \
  -H "apikey: YOUR_API_KEY"
```

Expected: `{ "state": "open" }`

- [ ] **Step 2: Test full inbound cycle**

From a different phone, send to +34 602 427 508:
1. "Hola, me interesa ImobSmart" → agent should respond with product intro
2. "Cuánto cuesta?" → agent should list plans with prices
3. "Quiero hablar con alguien" → agent should say an advisor will contact, and Paulo gets alert

Verify in Supabase:
- New lead in `leads` table with `source = 'whatsapp'`
- Conversation in `conversations` table with full message history

- [ ] **Step 3: Test language detection**

Send "Hello, I'd like to know about your product" → agent should respond in English
Send "Olá, quero saber sobre os planos" → agent should respond in Portuguese

- [ ] **Step 4: Test opt-out**

Send "No me interesa" → agent should respond politely and stop

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete WhatsApp agent setup — Evolution API + n8n + GPT-4o"
```
