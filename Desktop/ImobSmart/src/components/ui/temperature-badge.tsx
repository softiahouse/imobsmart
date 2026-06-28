import { TEMPERATURE_CONFIG } from "@/lib/constants";
import type { LeadTemperature } from "@/lib/types";

export function TemperatureBadge({ temp }: { temp: LeadTemperature }) {
  const cfg = TEMPERATURE_CONFIG[temp];
  return <span className="text-sm" title={cfg.label}>{cfg.emoji}</span>;
}
