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

-- Index for outbound drip query
create index if not exists idx_prospects_b2b_stage on prospects(b2b_stage)
  where b2b_stage = 'new' and phone is not null;

-- Index for daily limit check
create index if not exists idx_prospects_contacted_at on prospects(contacted_at);
