-- supabase/migrations/003_partner_applications.sql
-- Candidaturas de parceiros comerciais (campanha Instagram — Brasil)

create table partner_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text,
  state text not null,              -- UF (SP, RS, MG...)
  city text,
  role_interest text not null default 'ambos'  -- 'closer' | 'lider' | 'ambos'
    check (role_interest in ('closer', 'lider', 'ambos')),
  experience text,                  -- nível de experiência comercial
  current_activity text,            -- o que faz hoje
  availability text,                -- tempo disponível por semana
  why text,                         -- por que quer entrar
  source text default 'instagram',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create index partner_applications_created_idx
  on partner_applications (created_at desc);
create index partner_applications_status_idx
  on partner_applications (status);

alter table partner_applications enable row level security;

-- Qualquer visitante (anon) pode ENVIAR uma candidatura — formulário público.
create policy "Anyone can apply" on partner_applications
  for insert with check (true);

-- Apenas usuários autenticados (você) podem LER e atualizar as candidaturas.
create policy "Authenticated can read applications" on partner_applications
  for select using (auth.uid() is not null);
create policy "Authenticated can update applications" on partner_applications
  for update using (auth.uid() is not null);
