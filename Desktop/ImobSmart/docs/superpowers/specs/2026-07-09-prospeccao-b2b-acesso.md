# Prospecção B2B — Controle de Acesso e Adaptação BR

> Adaptar a página `/prospects` existente para uso operacional pela equipe comercial Brasil (Layara), com controle de acesso por whitelist de emails e mensagens em português.

**Goal:** Restringir a página de Prospecção B2B a Paulo e Layara, adaptar mensagens para o mercado brasileiro, e importar os 120 leads de Santa Maria, RS.

**Architecture:** Modificações pontuais em 4 arquivos existentes + inserção de dados via API. Sem páginas novas, sem componentes novos.

**Tech Stack:** Next.js middleware, Supabase Auth (getUser → email check), CSV import existente.

---

## 1. Controle de Acesso — Whitelist

**Arquivo:** `src/lib/supabase/middleware.ts`

Whitelist de emails com acesso à rota `/prospects`:

```
softiahouse@gmail.com
layaralima250@gmail.com
```

**Comportamento:**
- Se o usuário está logado mas NÃO está na whitelist e acessa `/prospects` → redireciona para `/dashboard`
- A verificação usa `supabase.auth.getUser()` que já é chamado no middleware
- Não afeta nenhuma outra rota

**Arquivo:** `src/components/ui/sidebar.tsx` (ou equivalente de navegação)

- O item de menu "Prospección B2B" só aparece se o email do usuário logado está na whitelist
- Para isso, o sidebar precisa receber o email do usuário (já disponível via Supabase client-side)

## 2. Mensagens WhatsApp em Português (BR)

**Arquivos:** `src/components/prospect-pipeline.tsx` e `src/components/prospect-table.tsx`

As mensagens de WhatsApp atuais estão em espanhol. Adicionar variantes em português:

**MSG_NO_SITE_BR:**
```
Olá 👋 Vi que sua imobiliária ainda não tem presença online. Sou o Paulo da *ImobSmart* — criamos sites profissionais para imobiliárias + publicação automática nas redes sociais + agente IA que atende seus leads 24/7.

Temos um *plano a partir de R$49/mês*.

Gostaria de ver como funciona em 10 minutos?

🌐 imobsmart.es
```

**MSG_BAD_SITE_BR:**
```
Olá 👋 Sou o Paulo da *ImobSmart*, uma plataforma que ajuda imobiliárias a captar mais clientes com:

✅ Publicação automática no Instagram, Facebook e TikTok
✅ Agente IA 24/7 que atende leads pelo WhatsApp
✅ CRM visual com pipeline de vendas

Temos um *plano a partir de R$49/mês*.

Gostaria de ver uma demo rápida de 10 minutos?

🌐 imobsmart.es
```

**Lógica de seleção:** Se `prospect.country === "BR"`, usar mensagem PT. Caso contrário, manter espanhol.

## 3. Importar Leads de Santa Maria

**Dados:** `data/santa-maria-leads.csv` — 120 imobiliárias.

**Mapeamento CSV → tabela `prospects`:**

| CSV campo      | DB campo         | Valor                                    |
|----------------|------------------|------------------------------------------|
| nome           | business_name    | direto                                   |
| telefone       | phone            | direto                                   |
| endereco       | city             | "Santa Maria" (extrair da string)        |
| website        | website_url      | direto (null se vazio)                   |
| classificacao  | classification   | sem_site→no_site, site_fraco→bad_site, site_bom→good_site |
| —              | country          | "BR"                                     |
| —              | b2b_stage        | "new"                                    |
| —              | source           | "csv_import"                             |

**Método:** Usar o endpoint `POST /api/prospects/import` que já existe, ou inserir via script SQL no Supabase.

## 4. Moeda Dinâmica

**Arquivo:** `src/components/prospect-pipeline.tsx`

No resumo do pipeline e nos cards, o deal value mostra `€`. Adicionar lógica:
- Se a maioria dos prospects visíveis tem `country === "BR"` → mostrar `R$`
- Ou mais simples: mostrar a moeda por prospect individual (€ para ES, R$ para BR)

## Fora de Escopo

- Criação de novas páginas ou rotas
- Mudança de roles/permissões no Supabase
- RLS por organização
- Scraping automático de imobiliárias
- Envio automático de mensagens (apenas link wa.me manual)
