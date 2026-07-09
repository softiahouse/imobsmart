# Prospecção B2B — Acesso Restrito + Adaptação BR

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restringir a página `/prospects` a dois emails (Paulo + Layara) e adaptar para o mercado brasileiro (mensagens PT, moeda R$, importar 120 leads de Santa Maria).

**Architecture:** Whitelist de emails no middleware do Supabase bloqueia acesso à rota. Sidebar/BottomNav filtram o item condicionalmente via hook client-side. Mensagens de WhatsApp selecionadas por `country`. Dados importados via CSV import existente.

**Tech Stack:** Next.js 16 App Router, Supabase Auth (`getUser`), TypeScript 5, Tailwind CSS 4

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/prospects-access.ts` | Whitelist constant + helper `isProspectsAllowed(email)` |
| Modify | `src/lib/supabase/middleware.ts` | Block `/prospects` for non-whitelisted users |
| Modify | `src/components/layout/sidebar.tsx` | Hide "Prospección" link for non-whitelisted users |
| Modify | `src/components/layout/bottom-nav.tsx` | Hide "B2B" link for non-whitelisted users |
| Modify | `src/components/prospect-pipeline.tsx` | PT messages for BR, R$ currency |
| Modify | `src/components/prospect-table.tsx` | PT messages for BR |
| Modify | `src/app/api/prospects/import/route.ts` | Default country "BR" when city contains Brazilian state |

---

### Task 1: Whitelist Access Module

**Files:**
- Create: `src/lib/prospects-access.ts`

- [ ] **Step 1: Create the whitelist module**

```typescript
// src/lib/prospects-access.ts
const PROSPECTS_WHITELIST = [
  "softiahouse@gmail.com",
  "layaralima250@gmail.com",
];

export function isProspectsAllowed(email: string | undefined | null): boolean {
  if (!email) return false;
  return PROSPECTS_WHITELIST.includes(email.toLowerCase());
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prospects-access.ts
git commit -m "feat: add prospects whitelist access module"
```

---

### Task 2: Middleware Guard

**Files:**
- Modify: `src/lib/supabase/middleware.ts:38-48`

The middleware already calls `supabase.auth.getUser()` and gets the `user` object. Add a check: if the path starts with `/prospects` and the user's email is not in the whitelist, redirect to `/dashboard`.

- [ ] **Step 1: Add whitelist check to middleware**

In `src/lib/supabase/middleware.ts`, add the import at the top:

```typescript
import { isProspectsAllowed } from "@/lib/prospects-access";
```

Then, after the existing `if (!user && !isPublicPage)` block (after line 48), add this block before the final `return supabaseResponse`:

```typescript
  if (
    user &&
    request.nextUrl.pathname.startsWith("/prospects") &&
    !isProspectsAllowed(user.email)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
```

The full file after changes should be:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProspectsAllowed } from "@/lib/prospects-access";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPage =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isPublicPage && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (
    user &&
    request.nextUrl.pathname.startsWith("/prospects") &&
    !isProspectsAllowed(user.email)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | head -20`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/middleware.ts
git commit -m "feat: block /prospects for non-whitelisted users"
```

---

### Task 3: Hide Nav Items for Non-Whitelisted Users

**Files:**
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/bottom-nav.tsx`

Both components need to: get the current user's email from Supabase client-side, and filter out the `/prospects` nav item if the email is not whitelisted.

- [ ] **Step 1: Update Sidebar**

Replace the full contents of `src/components/layout/sidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { isProspectsAllowed } from "@/lib/prospects-access";

const ALL_NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/properties", icon: "🏢", label: "Inmuebles" },
  { href: "/crm", icon: "📋", label: "CRM" },
  { href: "/prospects", icon: "🔍", label: "Prospección" },
  { href: "/settings", icon: "⚙️", label: "Ajustes" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState(
    ALL_NAV_ITEMS.filter((i) => i.href !== "/prospects")
  );

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isProspectsAllowed(user?.email)) {
        setNavItems(ALL_NAV_ITEMS);
      }
    });
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen glass border-r border-white/5 p-4 gap-2 fixed left-0 top-0">
      <div className="px-3 py-4 mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
          ImobSmart
        </h1>
      </div>

      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              active
                ? "glass-accent text-white"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          href="/properties/new"
          className="flex items-center justify-center gap-2 gradient-button py-3 text-white font-semibold text-sm"
        >
          + Nuevo Inmueble
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Update BottomNav**

Replace the full contents of `src/components/layout/bottom-nav.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { isProspectsAllowed } from "@/lib/prospects-access";

const ALL_NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/properties", icon: "🏢", label: "Inmuebles" },
  { href: "/properties/new", icon: "+", label: "Nuevo", isAction: true },
  { href: "/crm", icon: "📋", label: "CRM" },
  { href: "/prospects", icon: "🔍", label: "B2B" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState(
    ALL_NAV_ITEMS.filter((i) => i.href !== "/prospects")
  );

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isProspectsAllowed(user?.email)) {
        setNavItems(ALL_NAV_ITEMS);
      }
    });
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[rgba(10,10,20,0.9)] backdrop-blur-xl border-t border-white/5 flex justify-around py-2 pb-6 z-50">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);

        if (item.isAction) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
              <div className="w-12 h-12 rounded-2xl gradient-button flex items-center justify-center text-xl text-white">
                {item.icon}
              </div>
              <span className="text-xs text-zinc-500 mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center">
            <span className="text-lg">{item.icon}</span>
            <span className={`text-xs mt-1 ${active ? "text-accent" : "text-zinc-600"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | head -20`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/sidebar.tsx src/components/layout/bottom-nav.tsx
git commit -m "feat: hide prospects nav for non-whitelisted users"
```

---

### Task 4: Portuguese WhatsApp Messages + Dynamic Currency

**Files:**
- Modify: `src/components/prospect-pipeline.tsx`
- Modify: `src/components/prospect-table.tsx`

- [ ] **Step 1: Update prospect-pipeline.tsx**

In `src/components/prospect-pipeline.tsx`, after the existing `MSG_BAD_SITE` constant (line 48), add the Portuguese message variants:

```typescript
const MSG_NO_SITE_BR = `Olá 👋 Vi que sua imobiliária ainda não tem presença online. Sou o Paulo da *ImobSmart* — criamos sites profissionais para imobiliárias + publicação automática nas redes sociais + agente IA que atende seus leads 24/7.

Temos planos *a partir de R$49/mês*.

Gostaria de ver como funciona em 10 minutos?

🌐 imobsmart.es`;

const MSG_BAD_SITE_BR = `Olá 👋 Sou o Paulo da *ImobSmart*, uma plataforma que ajuda imobiliárias a captar mais clientes com:

✅ Publicação automática no Instagram, Facebook e TikTok
✅ Agente IA 24/7 que atende leads pelo WhatsApp
✅ CRM visual com pipeline de vendas

Temos planos *a partir de R$49/mês*.

Gostaria de ver uma demo rápida de 10 minutos?

🌐 imobsmart.es`;
```

Add a helper function after the `formatPhone` function:

```typescript
function getWhatsAppMessage(classification: ProspectClassification, country: string): string {
  if (country === "BR") {
    return classification === "no_site" ? MSG_NO_SITE_BR : MSG_BAD_SITE_BR;
  }
  return classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE;
}

function currencySymbol(country: string): string {
  return country === "BR" ? "R$" : "€";
}
```

In the `ProspectPipeline` component, change the pipeline total display (around line 117) from:

```typescript
            Pipeline: <strong className="text-green-400">€{totalDealValue.toLocaleString()}</strong>
```

to:

```typescript
            Pipeline: <strong className="text-green-400">{totalDealValue.toLocaleString()}</strong>
```

In the `ProspectCard` component, change the deal value display (around line 273) from:

```typescript
          <span className="text-[10px] text-green-400 ml-auto">€{prospect.deal_value}</span>
```

to:

```typescript
          <span className="text-[10px] text-green-400 ml-auto">{currencySymbol(prospect.country)}{prospect.deal_value}</span>
```

Change the WhatsApp link `text` parameter in the ProspectCard (around line 281) from:

```typescript
          href={`https://wa.me/${formatPhone(prospect.phone, prospect.country)}?text=${encodeURIComponent(prospect.classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE)}`}
```

to:

```typescript
          href={`https://wa.me/${formatPhone(prospect.phone, prospect.country)}?text=${encodeURIComponent(getWhatsAppMessage(prospect.classification, prospect.country))}`}
```

- [ ] **Step 2: Update prospect-table.tsx**

In `src/components/prospect-table.tsx`, after the existing `MSG_BAD_SITE` constant (line 31), add:

```typescript
const MSG_NO_SITE_BR = `Olá 👋 Vi que sua imobiliária ainda não tem presença online. Sou o Paulo da *ImobSmart* — criamos sites profissionais para imobiliárias + publicação automática nas redes sociais + agente IA que atende seus leads 24/7.

Temos planos *a partir de R$49/mês*.

Gostaria de ver como funciona em 10 minutos?

🌐 imobsmart.es`;

const MSG_BAD_SITE_BR = `Olá 👋 Sou o Paulo da *ImobSmart*, uma plataforma que ajuda imobiliárias a captar mais clientes com:

✅ Publicação automática no Instagram, Facebook e TikTok
✅ Agente IA 24/7 que atende leads pelo WhatsApp
✅ CRM visual com pipeline de vendas

Temos planos *a partir de R$49/mês*.

Gostaria de ver uma demo rápida de 10 minutos?

🌐 imobsmart.es`;

function getWhatsAppMessage(classification: ProspectClassification, country: string): string {
  if (country === "BR") {
    return classification === "no_site" ? MSG_NO_SITE_BR : MSG_BAD_SITE_BR;
  }
  return classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE;
}
```

Change the WhatsApp link in the table (around line 133) from:

```typescript
                          href={`https://wa.me/${formatPhone(p.phone, p.country)}?text=${encodeURIComponent(p.classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE)}`}
```

to:

```typescript
                          href={`https://wa.me/${formatPhone(p.phone, p.country)}?text=${encodeURIComponent(getWhatsAppMessage(p.classification, p.country))}`}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | head -20`
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add src/components/prospect-pipeline.tsx src/components/prospect-table.tsx
git commit -m "feat: add PT WhatsApp messages for BR prospects + dynamic currency"
```

---

### Task 5: Fix CSV Import Default Country for BR

**Files:**
- Modify: `src/app/api/prospects/import/route.ts:129`

The CSV import defaults `country` to `"ES"`. The `santa-maria-leads.csv` does not have a `country` column, so all leads would import as Spanish. Add logic to detect Brazilian cities.

- [ ] **Step 1: Update the import route**

In `src/app/api/prospects/import/route.ts`, change line 129 from:

```typescript
      country: mapped.country || "ES",
```

to:

```typescript
      country: mapped.country || (formData.get("country") as string) || "ES",
```

This allows the CSV import modal to pass a `country` field in the form data. The existing `CsvImportModal` already sends `city` in the formData — the same pattern works for `country`.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/prospects/import/route.ts
git commit -m "feat: allow country override in CSV import"
```

---

### Task 6: Import Santa Maria Leads

**Files:**
- Use existing: `data/santa-maria-leads.csv`

- [ ] **Step 1: Import leads via API**

Run a curl command against the running dev server (or use the CSV import UI). Since the CSV import endpoint accepts a file + city + country, we can import directly:

```bash
curl -X POST http://localhost:3000/api/prospects/import \
  -F "file=@data/santa-maria-leads.csv" \
  -F "city=Santa Maria" \
  -F "country=BR"
```

Expected: `{"imported": 120, ...}` (or close to 120, depending on empty rows)

Alternatively, if the server is not running locally, use the CSV Import button in the UI at `/prospects` → click "Importar CSV" → upload `data/santa-maria-leads.csv` → set city to "Santa Maria".

**Note:** After import, verify via the pipeline view that leads appear in the "Nuevo" column with the green WhatsApp button showing Portuguese messages for BR prospects.

- [ ] **Step 2: No commit needed** (data is in Supabase, not in code)
