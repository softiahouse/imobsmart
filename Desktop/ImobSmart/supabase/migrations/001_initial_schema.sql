-- supabase/migrations/001_initial_schema.sql

-- Enable extensions
create extension if not exists "pgcrypto";

-- ENUMS
create type plan_type as enum ('free', 'pro', 'business');
create type property_type as enum ('apartment', 'house', 'land', 'commercial');
create type operation_type as enum ('sale', 'rent', 'seasonal');
create type property_status as enum ('draft', 'published', 'archived');
create type lead_source as enum ('whatsapp', 'webchat', 'instagram');
create type lead_temperature as enum ('hot', 'warm', 'cold');
create type kanban_stage as enum ('new', 'contacted', 'visit_scheduled', 'proposal', 'closed');
create type prospect_classification as enum ('no_site', 'bad_site', 'good_site', 'client');
create type ai_tone as enum ('formal', 'casual', 'friendly');

-- ORGANIZATIONS
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  plan plan_type not null default 'free',
  phone text,
  city text,
  country text default 'ES',
  social_connections jsonb default '{}',
  ai_tone ai_tone default 'friendly',
  custom_domain text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- USERS (extends Supabase auth.users)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  role text not null default 'admin' check (role in ('admin', 'agent')),
  avatar_url text,
  created_at timestamptz default now()
);

-- PROPERTIES
create table properties (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  created_by uuid references users(id),
  type property_type not null,
  operation operation_type not null,
  price numeric(12, 2) not null,
  currency text default 'EUR',
  city text not null,
  neighborhood text,
  address text,
  area_m2 numeric(8, 2),
  bedrooms smallint,
  bathrooms smallint,
  floor smallint,
  has_elevator boolean default false,
  has_garage boolean default false,
  has_pool boolean default false,
  has_balcony boolean default false,
  year_built smallint,
  energy_cert text,
  description text,
  ai_generated_text text,
  status property_status default 'draft',
  photos text[] default '{}',
  video_url text,
  publish_targets jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LEADS
create table leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  name text not null,
  phone text,
  email text,
  source lead_source not null,
  temperature lead_temperature default 'warm',
  kanban_stage kanban_stage default 'new',
  assigned_to uuid references users(id) on delete set null,
  ai_summary text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CONVERSATIONS
create table conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  channel lead_source not null,
  messages jsonb default '[]',
  created_at timestamptz default now()
);

-- PROSPECTS (internal B2B)
create table prospects (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  country text default 'ES',
  business_name text not null,
  phone text,
  website_url text,
  classification prospect_classification default 'no_site',
  contacted_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- INDEXES
create index idx_properties_org on properties(org_id);
create index idx_properties_status on properties(org_id, status);
create index idx_leads_org on leads(org_id);
create index idx_leads_stage on leads(org_id, kanban_stage);
create index idx_leads_temp on leads(org_id, temperature);
create index idx_conversations_lead on conversations(lead_id);
create index idx_prospects_city on prospects(city, classification);

-- UPDATED_AT TRIGGER
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_organizations_updated before update on organizations
  for each row execute function update_updated_at();
create trigger trg_properties_updated before update on properties
  for each row execute function update_updated_at();
create trigger trg_leads_updated before update on leads
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY

alter table organizations enable row level security;
alter table users enable row level security;
alter table properties enable row level security;
alter table leads enable row level security;
alter table conversations enable row level security;

-- Helper: get current user's org_id
create or replace function public.user_org_id()
returns uuid as $$
  select org_id from public.users where id = auth.uid()
$$ language sql security definer stable;

-- Organizations: users can only see their own org
create policy "Users see own org" on organizations
  for select using (id = public.user_org_id());
create policy "Admins update own org" on organizations
  for update using (id = public.user_org_id());
create policy "Users create org" on organizations
  for insert with check (true);

-- Users: users can see members of their org
create policy "Users see org members" on users
  for select using (org_id = public.user_org_id());
create policy "Users insert own profile" on users
  for insert with check (id = auth.uid());

-- Properties: users can CRUD properties of their org
create policy "Users see org properties" on properties
  for select using (org_id = public.user_org_id());
create policy "Users create org properties" on properties
  for insert with check (org_id = public.user_org_id());
create policy "Users update org properties" on properties
  for update using (org_id = public.user_org_id());
create policy "Users delete org properties" on properties
  for delete using (org_id = public.user_org_id());

-- Leads: users can CRUD leads of their org
create policy "Users see org leads" on leads
  for select using (org_id = public.user_org_id());
create policy "Users create org leads" on leads
  for insert with check (org_id = public.user_org_id());
create policy "Users update org leads" on leads
  for update using (org_id = public.user_org_id());

-- Conversations: via lead's org
create policy "Users see org conversations" on conversations
  for select using (
    exists (select 1 from leads where leads.id = conversations.lead_id and leads.org_id = public.user_org_id())
  );

-- Prospects: no RLS (internal table, accessed via service role only)
alter table prospects disable row level security;
