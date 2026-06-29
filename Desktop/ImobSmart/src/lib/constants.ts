export const PLAN_LIMITS = {
  free: { maxProperties: 10, networks: 1, whatsappAgent: false, tiktok: false, googleAds: false, customDomain: false },
  pro: { maxProperties: 50, networks: 4, whatsappAgent: true, tiktok: true, googleAds: false, customDomain: false },
  business: { maxProperties: Infinity, networks: 4, whatsappAgent: true, tiktok: true, googleAds: true, customDomain: true },
} as const;

export const KANBAN_STAGES = [
  { key: "new", label: "Nuevo Lead", color: "#ff6666" },
  { key: "contacted", label: "Contactado", color: "#ffaa33" },
  { key: "visit_scheduled", label: "Visita Agendada", color: "#5a5aff" },
  { key: "proposal", label: "Propuesta", color: "#cc66ff" },
  { key: "closed", label: "Cerrado ✓", color: "#4aff4a" },
] as const;

export const PROPERTY_TYPES = [
  { key: "apartment", label: "Piso" },
  { key: "house", label: "Casa" },
  { key: "land", label: "Terreno" },
  { key: "commercial", label: "Comercial" },
] as const;

export const OPERATION_TYPES = [
  { key: "sale", label: "Venta" },
  { key: "rent", label: "Alquiler" },
  { key: "seasonal", label: "Temporada" },
] as const;

export const TEMPERATURE_CONFIG = {
  hot: { emoji: "🔥", label: "Caliente", color: "#ff6666" },
  warm: { emoji: "🟡", label: "Tibio", color: "#ffaa33" },
  cold: { emoji: "❄️", label: "Frío", color: "#66aaff" },
} as const;

export const CHANNEL_CONFIG = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  webchat: { label: "Webchat", color: "#5a5aff" },
  instagram: { label: "Instagram", color: "#E1306C" },
} as const;
