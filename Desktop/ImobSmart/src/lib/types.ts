export type Plan = "free" | "pro" | "business";
export type PropertyType = "apartment" | "house" | "land" | "commercial";
export type OperationType = "sale" | "rent" | "seasonal";
export type PropertyStatus = "draft" | "published" | "archived";
export type LeadSource = "whatsapp" | "webchat" | "instagram";
export type LeadTemperature = "hot" | "warm" | "cold";
export type KanbanStage = "new" | "contacted" | "visit_scheduled" | "proposal" | "closed";
export type ProspectClassification = "no_site" | "bad_site" | "good_site" | "client";
export type B2bStage = "new" | "contacted" | "meeting" | "proposal" | "negotiation" | "won" | "lost";
export type AiTone = "formal" | "casual" | "friendly";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: Plan;
  phone: string | null;
  city: string | null;
  country: string;
  social_connections: Record<string, unknown>;
  ai_tone: AiTone;
  custom_domain: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id: string;
  name: string;
  role: "admin" | "agent";
  avatar_url: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  org_id: string;
  created_by: string | null;
  type: PropertyType;
  operation: OperationType;
  price: number;
  currency: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  area_m2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  has_elevator: boolean;
  has_garage: boolean;
  has_pool: boolean;
  has_balcony: boolean;
  year_built: number | null;
  energy_cert: string | null;
  description: string | null;
  ai_generated_text: string | null;
  status: PropertyStatus;
  photos: string[];
  video_url: string | null;
  publish_targets: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  org_id: string;
  property_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  source: LeadSource;
  temperature: LeadTemperature;
  kanban_stage: KanbanStage;
  assigned_to: string | null;
  ai_summary: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Conversation {
  id: string;
  lead_id: string;
  channel: LeadSource;
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[];
  created_at: string;
}

export interface Prospect {
  id: string;
  city: string;
  country: string;
  business_name: string;
  phone: string | null;
  email: string | null;
  contact_name: string | null;
  website_url: string | null;
  classification: ProspectClassification;
  b2b_stage: B2bStage;
  deal_value: number | null;
  next_followup: string | null;
  source: string;
  contacted_at: string | null;
  notes: string | null;
  created_at: string;
}
