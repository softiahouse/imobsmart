# ImobSmart WhatsApp Agent — Design Spec

## Goal

Deploy an AI-powered WhatsApp agent on the ImobSmart Spanish number (+34 602 427 508) that handles B2B sales conversations — both inbound (agencies reaching out via imobsmart.es) and outbound (drip campaigns to prospected agencies). The agent presents ImobSmart, answers questions about plans/pricing, detects language (ES/EN/PT), and drives prospects to self-service signup.

## Architecture

```
iPhone (WhatsApp +34 602 427 508)
    ↕
Evolution API (Docker container, EasyPanel, port 8080)
    ↕ webhook
n8n (Docker container, EasyPanel, already running)
    ↕
GPT-4o (OpenAI API)
    ↕
Supabase (leads + conversations tables)
    ↕
ImobSmart web panel (CRM Kanban)
```

### Components

1. **Evolution API** — Open-source WhatsApp Web bridge running as a Docker container on EasyPanel. Connects to WhatsApp via QR code scan. Receives and sends messages. Fires webhook to n8n on every incoming message.

2. **n8n Flow: whatsapp-inbound** — Receives message → fetches lead context from Supabase → calls GPT-4o with system prompt + conversation history → sends reply via Evolution API → saves lead + conversation to Supabase.

3. **n8n Flow: whatsapp-outbound-drip** — Cron job (every 30 min, 9h–19h Madrid, Mon–Fri) → picks next prospect from Supabase queue → sends personalized intro message via Evolution API → updates prospect stage to "contacted".

4. **GPT-4o System Prompt** — Consultative sales personality for ImobSmart. Knows plans, pricing, features. Detects language automatically. Goal: answer questions and send signup link.

## Inbound Flow (prospect messages first)

### n8n Workflow Steps

1. **Webhook trigger** — Evolution API sends POST with `{ phone, message, timestamp, instanceId }`
2. **Lookup lead** — Query Supabase: does a lead with this phone exist?
   - If yes: fetch conversation history from `conversations` table
   - If no: create new lead (source: whatsapp, stage: new, temperature: hot)
3. **Build prompt** — System prompt + last 10 messages from history + new message
4. **Call GPT-4o** — OpenAI Chat Completions API. Model: gpt-4o. Max tokens: 300.
5. **Send reply** — POST to Evolution API `/message/sendText/{instance}`
6. **Save to Supabase** — Append both user message and assistant reply to `conversations.messages` JSONB array
7. **Human escalation** — If user asks to speak to a person, send alert to Paulo's personal WhatsApp and update lead stage to "contacted"

### System Prompt

```
Eres un asesor comercial de ImobSmart, plataforma SaaS para inmobiliarias.
Detecta el idioma del mensaje y responde en el mismo idioma (ES/EN/PT).

Tu objetivo:
- Presentar ImobSmart (autopublicación en redes sociales, CRM Kanban, agente IA 24/7)
- Responder dudas sobre planes:
  • Starter: 9,90€/mes — hasta 20 inmuebles, 1 red social, CRM, dashboard básico
  • Pro: 39,90€/mes — hasta 50 inmuebles, 4 redes, agente IA WhatsApp, TikTok, soporte prioritario
  • Turbo: 59,90€/mes — ilimitados, todas redes, Google Ads, dominio, prospección B2B, soporte VIP
- Enviar link de registro: https://imobsmart.es/signup
- Starter incluye 1 mes gratis sin tarjeta de crédito
- Si piden hablar con una persona, responde que un asesor contactará pronto

Tono: profesional pero cercano. Mensajes cortos (máximo 3 frases por respuesta).
No inventes funcionalidades que no existen. No ofrezcas descuentos.
Nunca digas que eres una IA. Preséntate como "el equipo de ImobSmart".
```

## Outbound Flow (drip campaign to prospects)

### n8n Workflow Steps

1. **Cron trigger** — Every 30 minutes, 09:00–19:00 Madrid timezone, Monday–Friday
2. **Check daily limit** — Query Supabase: count prospects contacted today. If >= 10, stop.
3. **Pick next prospect** — Query Supabase: `b2b_stage = 'new' AND phone IS NOT NULL` ordered by `created_at ASC`, LIMIT 1
4. **Send intro message** — POST to Evolution API with personalized message:

```
Hola {contact_name || business_name}, soy del equipo de ImobSmart 👋
Vi que {business_name} trabaja con inmuebles en {city}.

Tenemos una plataforma que publica automáticamente tus inmuebles en Instagram, Facebook y TikTok, y atiende leads con IA 24/7.

¿Te gustaría ver cómo funciona? Es gratis probarlo 1 mes.
👉 https://imobsmart.es
```

5. **Update Supabase** — Set `b2b_stage = 'contacted'`, `contacted_at = now()`
6. **If prospect replies** — Falls into the inbound flow automatically; the AI agent continues the conversation

### Safety Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Max messages/day | 10 | Prevent WhatsApp ban |
| Min interval | 30 minutes | Natural spacing |
| Hours | 09:00–19:00 CET | Business hours only |
| Days | Mon–Fri | No weekends |
| Opt-out | Detect "no", "no me interesa", "para" | Auto-mark as `lost`, stop messaging |

## Infrastructure

### Evolution API Container (EasyPanel)

- **Image:** `atendai/evolution-api:latest`
- **Port:** 8080
- **Environment variables:**
  - `AUTHENTICATION_API_KEY` — API key for Evolution API
  - `WEBHOOK_GLOBAL_URL` — n8n webhook URL for inbound messages
  - `WEBHOOK_GLOBAL_ENABLED` — true
  - `DATABASE_ENABLED` — false (Supabase handles persistence)
- **Storage:** Persistent volume for WhatsApp session data
- **Domain:** evolution.imobsmart.es (via EasyPanel + Traefik)

### n8n Environment Variables (add to existing)

- `EVOLUTION_API_URL` — http://evolution:8080 (internal Docker network) or https://evolution.imobsmart.es
- `EVOLUTION_API_KEY` — same as AUTHENTICATION_API_KEY above
- `OPENAI_API_KEY` — OpenAI API key for GPT-4o
- `IMOBSMART_SIGNUP_URL` — https://imobsmart.es/signup
- `PAULO_WHATSAPP` — Paulo's personal number for escalation alerts

### Supabase Changes

No schema changes needed. Existing tables cover the use case:
- `leads` — stores WhatsApp leads (source: 'whatsapp')
- `conversations` — stores message history as JSONB
- `prospects` — already has `b2b_stage`, `phone`, `contacted_at` fields

### Webhook Route Update

Update `/api/webhooks/whatsapp/route.ts` to accept Evolution API's webhook format instead of Meta's format. Evolution API sends:

```json
{
  "event": "messages.upsert",
  "instance": "imobsmart",
  "data": {
    "key": { "remoteJid": "34612345678@s.whatsapp.net", "id": "msg-id" },
    "message": { "conversation": "Hola, quiero información" },
    "messageTimestamp": 1720000000
  }
}
```

However, since n8n handles the flow directly via Evolution API webhooks, the Next.js webhook route becomes optional — n8n receives webhooks directly from Evolution API.

## Future Migration Path

When results validate the approach:
1. Apply for WhatsApp Business API via Meta
2. Replace Evolution API with Meta Cloud API connector in n8n
3. Same n8n flows, same GPT-4o prompt, same Supabase storage
4. Scale outbound beyond 10/day with approved message templates
5. Add read receipts, message status tracking, and official green checkmark

## Out of Scope (for now)

- WhatsApp Business API (Meta official) — future phase
- Multi-instance (one per client) — future when selling agent to clients
- Voice messages — text only for now
- Media messages (photos/PDFs) — text only for now
- Payment integration — signup is free trial, billing handled separately
