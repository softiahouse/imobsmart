-- supabase/migrations/004_course_leads.sql
-- Lista de espera do curso "Construa seu próprio SaaS" (campanha Instagram — Brasil)

create table course_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  goal text,                        -- o que a pessoa quer construir / objetivo
  source text default 'instagram',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'enrolled', 'rejected')),
  created_at timestamptz default now()
);

create index course_leads_created_idx on course_leads (created_at desc);
create index course_leads_status_idx on course_leads (status);

alter table course_leads enable row level security;

-- Qualquer visitante (anon) pode ENTRAR na lista — formulário público.
create policy "Anyone can join waitlist" on course_leads
  for insert with check (true);

-- Apenas usuários autenticados (você) podem LER e atualizar.
create policy "Authenticated can read course leads" on course_leads
  for select using (auth.uid() is not null);
create policy "Authenticated can update course leads" on course_leads
  for update using (auth.uid() is not null);
