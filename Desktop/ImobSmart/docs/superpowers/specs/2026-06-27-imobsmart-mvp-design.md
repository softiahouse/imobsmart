# ImobSmart MVP — Design Spec

## Visão Geral

SaaS para imobiliárias que resolve 3 problemas:
1. Corretor cadastra imóvel uma vez → sistema posta automaticamente em Instagram, Facebook, TikTok e Google Ads
2. Leads que chegam são atendidos por agente IA 24/7 via WhatsApp e Webchat, classificados e inseridos num CRM/Kanban
3. Ferramenta interna de prospecção B2B para achar e classificar imobiliárias por cidade em qualquer lugar do planeta

Modelo de negócio: Freemium (grátis para testar, pago para escalar).

## Público-alvo

Imobiliárias pequenas e médias, especialmente:
- As que **não têm site** (62 em Torrevieja) — porta de entrada freemium
- As que têm **site desatualizado** (96 em Torrevieja) — upgrade de presença digital
- Foco geográfico inicial: Torrevieja e Costa Blanca (Espanha), expandindo para qualquer cidade

## Stack Técnica

| Componente | Tecnologia | Hospedagem |
|---|---|---|
| Frontend + API | Next.js (App Router) | Container EasyPanel na VPS |
| Banco de dados | PostgreSQL (Supabase) | Supabase Cloud (free tier) |
| Autenticação | Supabase Auth | Supabase Cloud |
| Storage (fotos) | Supabase Storage (CDN) | Supabase Cloud |
| Automações | n8n | Container EasyPanel na VPS |
| IA (texto/arte) | OpenAI GPT-4o | API externa |
| WhatsApp | Meta Cloud API (WhatsApp Business) | API externa |
| Redes sociais | Meta Graph API (IG/FB), TikTok Content API | APIs externas |
| Google Ads | Google Ads API | API externa |
| Reverse proxy | Nginx | Container EasyPanel na VPS |

**VPS:** Hostinger (46.202.129.29), EasyPanel, Ubuntu. Mesma VPS dos outros projetos (NK, ClaveHogar, etc). Containers isolados.

## Módulo 1: Cadastro de Imóveis + Autopostagem

### Fluxo Principal

1. Corretor faz login no painel
2. Clica em "Novo Imóvel"
3. Preenche formulário (~2 minutos):
   - Arrasta/solta fotos (até 20)
   - Seleciona tipo, operação, preço, localização, detalhes
4. Clica "Publicar"
5. API Route salva no Supabase (dados no PostgreSQL, fotos no Storage)
6. Webhook dispara workflow no n8n
7. n8n chama GPT-4o que gera:
   - Texto descritivo do post (no idioma configurado)
   - Hashtags locais relevantes
   - Arte/carrossel com template da imobiliária (logo + fotos + preço overlay)
8. n8n posta em paralelo nas redes conectadas
9. Status atualizado no painel: "Publicado em IG, FB, TikTok, Ads" com links diretos

### Campos do Cadastro

**Obrigatórios:**
- Fotos (até 20, drag & drop)
- Tipo (apartamento, casa, terreno, comercial)
- Operação (venda, aluguel, temporada)
- Preço (€)
- Cidade + Bairro
- Área (m²)
- Quartos / Banheiros

**Opcionais (enriquecem o post gerado pela IA):**
- Descrição livre (IA complementa se vazio)
- Andar / Elevador
- Garagem / Piscina / Varanda
- Ano de construção
- Certificado energético
- Vídeo do imóvel
- Redes para publicar (default: todas as conectadas)

### Nível de Automação

100% automático. Corretor cadastra → sistema gera texto/arte/hashtags com IA → posta automaticamente. Sem necessidade de aprovação (corretor pode revisar depois e editar/remover se quiser).

### Formatos por Rede

| Rede | Formato | API |
|---|---|---|
| Instagram | Carrossel (até 10 fotos) + Reels (slideshow) | Meta Graph API |
| Facebook | Post com fotos + texto | Meta Graph API |
| TikTok | Video slideshow com fotos + música | TikTok Content Posting API |
| Google Ads | Anúncio de imóvel com fotos + link | Google Ads API |

## Módulo 2: CRM/Kanban + Agente IA

### Canais de Entrada de Leads

- **WhatsApp** (Meta Cloud API) — canal principal
- **Webchat** (widget embutido no site da imobiliária) — complementar
- **Instagram DMs** (Meta Graph API) — leads vindos dos posts

Todos os canais convergem para o mesmo agente IA.

### Agente IA — Capacidades

O agente roda como workflow no n8n com GPT-4o:

**Atendimento:**
- Responde em segundos, 24/7
- Puxa detalhes do imóvel do banco de dados e responde com conhecimento completo
- Envia fotos extras sob demanda
- Detecta idioma e responde em ES, PT, EN, FR automaticamente
- Tom personalizado por imobiliária (formal, casual, etc)

**Qualificação:**
- Classifica lead automaticamente: Quente / Morno / Frio
- Critérios: urgência, budget alinhado, localização específica, perguntas detalhadas

**Ações:**
- Agenda visita (integra com Google Calendar)
- Notifica corretor por WhatsApp quando lead é quente
- Escala para humano quando não consegue resolver ou quando o lead pede
- Cria card no Kanban com todo o contexto (nome, telefone, imóvel, temperatura, histórico da conversa)

### Kanban — Colunas

| Coluna | Descrição | Quem move |
|---|---|---|
| Novo Lead | IA acabou de inserir, aguardando ação | Automático (IA) |
| Contactado | Corretor falou com o lead | Manual (corretor) |
| Visita Agendada | Visita marcada (IA ou corretor) | Automático ou manual |
| Proposta | Lead recebeu proposta, negociando | Manual (corretor) |
| Fechado ✓ | Vendido ou alugado | Manual (corretor) |

Cards mostram: nome, telefone, imóvel de interesse, temperatura (emoji), data de entrada, resumo da conversa com IA.

Corretor arrasta cards entre colunas. Interface drag & drop simples.

## Módulo 3: Prospecção B2B (Ferramenta Interna)

Painel interno (só para a equipe ImobSmart) para achar potenciais clientes.

### Funcionalidades

- **Busca por cidade + ramo:** Ex: "Torrevieja" + "Inmobiliaria"
- **Scraping automatizado:** Usa o script existente (do filho/sócio) para listar imobiliárias com dados de contato
- **Classificação automática de sites:**
  - 🔴 Sem site — prioridade máxima (maior dor, mais fácil de converter)
  - 🟡 Site ruim/desatualizado — prioridade alta
  - 🟢 Site bom e ativo — prioridade baixa
  - 🔵 Já é cliente — tracking
- **Tabela com:** nome, telefone, URL do site, classificação, botão "Contactar"
- **Botão Contactar:** Abre WhatsApp pré-preenchido ou registra no pipeline de vendas

### Dados de Exemplo (Torrevieja)

- 359 imobiliárias encontradas
- 62 sem site (17%)
- 96 site ruim (27%)
- 139 site bom (39%)
- Público-alvo imediato: 158 imobiliárias (sem site + site ruim = 44%)

## Modelo de Monetização — Freemium

### Planos

| Feature | Grátis (€0) | Pro (€49/mês) | Business (€99/mês) |
|---|---|---|---|
| Imóveis ativos | 10 | 50 | Ilimitado |
| Autopostagem | 1 rede (IG ou FB) | Todas as redes | Todas as redes |
| CRM/Kanban | Básico | Completo | Completo + relatórios |
| Webchat widget | Com marca d'água | Sem marca | Personalização total |
| Agente IA WhatsApp | ❌ | ✅ | ✅ |
| TikTok | ❌ | ✅ | ✅ |
| Google Ads automático | ❌ | ❌ | ✅ |
| Domínio próprio | ❌ | ❌ | ✅ (app.suaimobiliaria.com) |

A marca d'água "por ImobSmart" no plano grátis funciona como marketing orgânico.

### Projeção de Receita — Torrevieja (359 imobiliárias)

| Cenário | Conversão | Clientes | Mix (Grátis/Pro/Business) | MRR |
|---|---|---|---|---|
| Conservador | 5% | 18 | 6 / 8 / 4 | €882/mês |
| Moderado | 10% | 36 | 12 / 16 / 8 | €1.764/mês |
| Otimista | 20% | 72 | 24 / 32 / 16 | €3.528/mês |

Modelo replica para qualquer cidade. Escala geográfica ilimitada.

## Modelo de Dados (Supabase/PostgreSQL)

### Tabelas Principais

**organizations** — Imobiliária cliente
- id, name, slug, logo_url, plan (free/pro/business), phone, city, country
- social_connections (JSON: tokens IG/FB/TikTok/Ads)
- ai_tone (formal/casual/friendly)
- created_at, updated_at

**users** — Corretores
- id, org_id (FK), email, name, role (admin/agent), avatar_url
- Supabase Auth gerencia login

**properties** — Imóveis
- id, org_id (FK), created_by (FK users)
- type (apartment/house/land/commercial)
- operation (sale/rent/seasonal)
- price, currency, city, neighborhood, address
- area_m2, bedrooms, bathrooms, floor, has_elevator
- has_garage, has_pool, has_balcony, year_built, energy_cert
- description, ai_generated_text
- status (draft/published/archived)
- photos (array de URLs no Supabase Storage)
- video_url
- publish_targets (JSON: quais redes foram postadas, IDs dos posts, timestamps)
- created_at, updated_at

**leads** — Leads do CRM
- id, org_id (FK), property_id (FK, nullable)
- name, phone, email
- source (whatsapp/webchat/instagram)
- temperature (hot/warm/cold)
- kanban_stage (new/contacted/visit_scheduled/proposal/closed)
- assigned_to (FK users, nullable)
- ai_summary (resumo da conversa com IA)
- notes
- created_at, updated_at

**conversations** — Histórico de chat
- id, lead_id (FK), channel (whatsapp/webchat/instagram)
- messages (JSONB array: {role, content, timestamp})
- created_at

**prospects** — Prospecção B2B (tabela interna)
- id, city, country, business_name, phone, website_url
- classification (no_site/bad_site/good_site/client)
- contacted_at, notes
- created_at

## Segurança e Multi-tenancy

- **Row Level Security (RLS)** no Supabase: cada imobiliária só vê seus próprios dados
- Políticas RLS baseadas em org_id do usuário autenticado
- Tokens de redes sociais encriptados no banco
- API Routes do Next.js validam sessão Supabase em toda requisição
- Plano free tem limites enforced via RLS + API (contagem de properties por org)

## Deploy e Infraestrutura

### Containers no EasyPanel (VPS 46.202.129.29)

1. **imobsmart-app** — Next.js (porta 3000)
   - Variáveis: SUPABASE_URL, SUPABASE_ANON_KEY, N8N_WEBHOOK_URL
2. **n8n** — Já existente, adicionar workflows ImobSmart
3. **nginx** — Reverse proxy, SSL (Let's Encrypt)

### Domínio

- imobsmart.com (ou .app/.io — a definir)
- app.imobsmart.com → painel do corretor
- API mesma origin (Next.js API Routes)

### Workflows n8n

1. **autopost-property** — Recebe webhook de novo imóvel → gera conteúdo com IA → posta nas redes
2. **whatsapp-agent** — Recebe mensagem WhatsApp → consulta DB → responde via GPT-4o → classifica lead → insere no CRM
3. **webchat-agent** — Mesmo fluxo, canal webchat
4. **instagram-agent** — Mesmo fluxo, canal Instagram DM
5. **lead-notification** — Lead quente detectado → notifica corretor via WhatsApp

## Fora do Escopo (MVP)

Estes itens ficam para fases futuras:
- Portal público de busca de imóveis (vitrine)
- Integração com portais (Idealista, Fotocasa, etc) via API
- Agente de atendimento próprio da ImobSmart (para vender o SaaS)
- Painel admin SaaS completo (gestão de billing, analytics cross-tenant)
- App mobile nativo
- Relatórios avançados e analytics
- Integração com sistemas de gestão imobiliária existentes
