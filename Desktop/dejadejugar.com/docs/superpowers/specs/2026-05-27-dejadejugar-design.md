# DejaDeJugar.com — Design Spec

**Data:** 2026-05-27  
**Autor:** Henrique + Claude  
**Baseado em:** paredejogar.com (fork direto)

---

## Visão Geral

DejaDeJugar.com é a versão espanhola do programa PareDeJogar (método ISTOP) para o mercado espanhol. Fork direto do código do paredejogar, com tradução PT→ES, nova identidade visual e Stripe no lugar do MercadoPago.

---

## Abordagem: Fork Direto (Abordagem A)

Cópia do paredejogar, sem monorepo nem i18n formal. Os dois projectos evoluem de forma independente. Escolhido por velocidade de entrega e baixo risco.

---

## 1. Frontend

### Stack
React 19 + Vite + Tailwind CSS — idêntico ao paredejogar.

### Identidade Visual

| Token | Valor |
|-------|-------|
| `--azul` | `#1A3A6B` |
| `--azul-claro` | `#E8EFF8` |
| `--azul-suave` | `#F0F4FF` |
| `--dourado` | `#C8962A` |
| `--dourado-claro` | `#FDF6E3` |
| `--creme` | `#F7F6F2` |
| `--texto` | `#1A1A2E` |
| `--texto-sec` | `#4A4A6A` |
| `--texto-ter` | `#8A8AA0` |
| `--borda` | `#D8DFF0` |

Tipografia: `DM Serif Display` (títulos) + `DM Sans` (corpo) — mesmas fontes do paredejogar.

Hero: **"DEJA VIVE"** — "DEJA" em `#7B2D00`, "VIVE" em `--azul`.

### Tradução PT → ES

Todos os textos hardcoded traduzidos para espanhol castelhano:
- Landing page completa (hero, dor, credibilidade, método, depoimentos, programa, FAQ, CTA, footer)
- Páginas de auth (`/entrar`, `/cadastrar`, `/esqueci-senha`)
- Painel (`/painel`)
- Módulos e aulas (todos os textos de UI — o conteúdo dos módulos será traduzido separadamente)
- Quiz de jogador e familiar
- Página de termos e privacidade
- Certificado
- Navbar e Footer

### Rotas
Mantidas em português/neutro (não mudar URLs — evita SEO desnecessário para v1):

| Rota | Descrição |
|------|-----------|
| `/` | Landing |
| `/quiz`, `/quiz/familias`, `/resultado` | Quiz |
| `/entrar`, `/cadastrar`, `/esqueci-senha` | Auth |
| `/painel` | Painel logado |
| `/modulo/:id` | Entrada do módulo |
| `/modulo/:moduloId/aula/:aulaId` | Aulas |
| `/contrato` | Contrato de Interrupción |
| `/certificado` | Certificado |
| `/blog`, `/blog/:slug` | Blog |
| `/termos`, `/privacidade` | Termos |

### Pagamento — Stripe

MercadoPago removido. Stripe Checkout no lugar:
- `VITE_STRIPE_PUBLIC_KEY` substitui `VITE_MP_PUBLIC_KEY`
- Novo hook `useStripe` (equivalente ao hook MP actual)
- Botão de compra chama Edge Function `criar-preferencia-stripe`, recebe URL de checkout, redireciona
- Preços em EUR:

| Módulo | Nome | Preço |
|--------|------|-------|
| 1 | Interrupción | €29,90 |
| 2 | Sensibilización | €49,90 |
| 3 | Autorregulación | €89,90 |
| 4 | Reorganización | €149,90 |
| 5 | Mantenimiento | €199,90 |

- Sequência obrigatória mantida (módulo N só disponível com N-1)
- Acesso por 120 dias por módulo

### Botón de Emergencia

Fork do `BotaoEmergencia.jsx` → `BotonDeEmergencia.jsx`:
- 5 blocos de 20 perguntas traduzidas para espanhol
- Bloco não visto mostrado em sequência aleatória sem repetição
- Após concluir: guia de respiração 4-6-2 + mensagens de reforço (em ES)
- Utilizadores sem Módulo 1: mensagem informativa em espanhol
- Tabela Supabase: `emergencia_blocos_vistos` (mesmo schema)
- Posicionamento: cabeçalho do painel (inline) + flutuante no App

---

## 2. Backend — Supabase (Novo Projeto ES)

Novo projecto Supabase separado do BR. Schema idêntico.

### Tabelas

| Tabela | Função |
|--------|--------|
| `progresso_usuario` | Módulos concluídos por user |
| `modulos_liberados` | Módulos pagos/desbloqueados |
| `pagamentos` | Registo de pagamentos Stripe |
| `contratos` | Contrato de Interrupción assinado |
| `leads` | Leads do formulário da landing |
| `emergencia_blocos_vistos` | Blocos do Botón de Emergencia vistos |
| `blog_posts` | Artigos do blog |

### Edge Functions

**`criar-preferencia-stripe`**
- Recebe: `{ modulo_id, user_id }`
- Cria Stripe Checkout Session com `payment_mode`, `metadata: { user_id, modulo_id }`
- Devolve: `{ url }` (URL de checkout do Stripe)

**`webhook-stripe`**
- Recebe: evento Stripe `checkout.session.completed`
- Verifica assinatura com `STRIPE_WEBHOOK_SECRET`
- Extrai `user_id` e `modulo_id` do `metadata`
- Insere em `pagamentos` e `modulos_liberados`

### Auth
- Google OAuth configurado para `dejadejugar.com`
- Resend para emails transacionais (confirmação, redefinição de senha)
- `SITE_URL=https://dejadejugar.com` nas Supabase Secrets

### Variáveis de Ambiente

`.env.local` (não commitar):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLIC_KEY=
```

Supabase Secrets (Edge Functions):
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SITE_URL=https://dejadejugar.com
```

---

## 3. Stripe

- 5 produtos criados no Stripe Dashboard (um por módulo), moeda EUR
- Checkout em `payment` mode (não subscription)
- `metadata` da session: `{ user_id: string, modulo_id: string }`
- Webhook endpoint: `https://<supabase-project>.supabase.co/functions/v1/webhook-stripe`
- Evento subscrito: `checkout.session.completed`
- `success_url`: `/painel?pagamento=sucesso`
- `cancel_url`: `/painel`

---

## 4. n8n + Evolution API (VPS Hostinger)

### Infraestrutura VPS
- Evolution API: já instalado
- n8n: instalar via Docker Compose
- Subdomínio `n8n.dejadejugar.com` → nginx reverse proxy + SSL via Certbot

### Trigger
Supabase envia webhook HTTP para o n8n quando nova linha entra na tabela `leads` (via Supabase Database Webhooks).

Payload mínimo: `{ nome, email, telefone, mensagem, created_at }`

### Sequência de Follow-up

| Momento | Acção |
|---------|-------|
| t=0 (imediato) | WhatsApp boas-vindas para lead + alerta (WhatsApp + email) para Henrique |
| Dia 2 | WhatsApp check-in para lead |
| Dia 5 | WhatsApp com conteúdo de valor (artigo do blog / recurso gratuito) |
| Dia 10 | WhatsApp com oferta directa do Módulo 1 (€29,90) |
| Dia 20 | WhatsApp último follow-up |

- Canal: WhatsApp via Evolution API (já na VPS)
- Email para Henrique: via nó de email do n8n (SMTP ou Resend)
- Delays implementados com nó `Wait` do n8n

---

## 5. Infraestrutura & Deploy

### Frontend — Vercel
- Novo projecto Vercel
- Repositório: `softiahouse/dejadejugar` (GitHub)
- Deploy automático via push para `main`
- `vercel.json` com SPA rewrite (igual ao paredejogar)
- Domínio `dejadejugar.com` via GoDaddy → Vercel DNS

### VPS Hostinger
- n8n via Docker Compose
- Evolution API já instalado
- nginx: reverse proxy para n8n em `n8n.dejadejugar.com`
- SSL: Certbot (Let's Encrypt)

---

## 6. Ficheiros Públicos

Mesma estrutura do paredejogar:

| Item | Path |
|------|------|
| Logo SVG | `public/logo-instituto-istop.svg` |
| Favicon | `public/favicon.png` |
| Livros gratuitos (ES) | `public/livros/` |
| Imagens dos módulos | `public/imagens/` |

Os PDFs dos livros gratuitos serão as versões em espanhol (a preparar).

---

## 7. Conteúdo dos Módulos

O conteúdo de `src/data/modulosContent.js` será traduzido PT→ES — 5 módulos, 23 aulas no total. Tradução feita como parte da implementação do frontend.

---

## Regras Importantes (herdar do paredejogar)

- Nunca referenciar FIDE na UI
- `modulos_liberados.length === 5` → acesso permanente (sócios)
- Imagens sempre em `public/imagens/`, PDFs em `public/livros/`
- PowerShell 5.1 no Windows — evitar `&&`, usar `;`
- Pagamentos sequenciais obrigatórios: módulo N exige N-1

---

## O que está FORA do scope desta versão

- Blog com conteúdo (estrutura existe, artigos em ES a criar depois)
- Painel admin/financeiro
- Emails com domínio `@dejadejugar.com`
- Google Analytics
- Optimização SEO avançada
