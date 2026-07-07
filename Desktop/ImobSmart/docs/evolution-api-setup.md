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
| `LOG_LEVEL` | `WARN` |

## 3. Domain

- Add domain: `evolution.imobsmart.es`
- Enable HTTPS (Let's Encrypt)
- Container port: 8080

## 4. Persistent volume

- Mount path: `/evolution/instances`

## 5. Deploy and verify

- Click "Implantar"
- Access `https://evolution.imobsmart.es`

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

Scan the QR code with the iPhone WhatsApp (+34 602 427 508).

## 7. Verify connection

```bash
curl https://evolution.imobsmart.es/instance/connectionState/imobsmart \
  -H "apikey: YOUR_API_KEY"
```

Expected: `{ "state": "open" }`
