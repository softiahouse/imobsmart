import { CHANNEL_CONFIG } from "@/lib/constants";
import type { LeadSource } from "@/lib/types";

export function ChannelBadge({ channel }: { channel: LeadSource }) {
  const cfg = CHANNEL_CONFIG[channel];
  return (
    <span
      className="text-[9px] px-2 py-0.5 rounded-md"
      style={{ background: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}
