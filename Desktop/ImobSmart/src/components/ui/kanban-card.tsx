import type { Lead } from "@/lib/types";
import { TemperatureBadge } from "./temperature-badge";
import { ChannelBadge } from "./channel-badge";
import { timeAgo } from "@/lib/utils";

export function KanbanCard({ lead }: { lead: Lead }) {
  return (
    <div
      className="rounded-2xl p-3 backdrop-blur-xl cursor-grab active:cursor-grabbing"
      style={{
        background: `${lead.temperature === "hot" ? "rgba(255,100,100,0.08)" : lead.temperature === "warm" ? "rgba(255,170,51,0.06)" : "rgba(100,170,255,0.06)"}`,
        border: `1px solid ${lead.temperature === "hot" ? "rgba(255,100,100,0.25)" : lead.temperature === "warm" ? "rgba(255,170,51,0.2)" : "rgba(100,170,255,0.2)"}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white text-sm font-semibold">{lead.name}</p>
          <p className="text-zinc-500 text-xs">{lead.phone}</p>
        </div>
        <div className="flex items-center gap-1">
          <TemperatureBadge temp={lead.temperature} />
          <ChannelBadge channel={lead.source} />
        </div>
      </div>

      {lead.property && (
        <div className="bg-white/5 rounded-lg p-2 mt-2">
          <p className="text-zinc-400 text-xs">
            🏢 {lead.property.type === "apartment" ? "Piso" : "Casa"} — {lead.property.city}
          </p>
        </div>
      )}

      {lead.ai_summary && (
        <div className="bg-purple-500/10 rounded-lg p-2 mt-1">
          <p className="text-purple-300 text-xs">🤖 {lead.ai_summary}</p>
        </div>
      )}

      <p className="text-zinc-600 text-[10px] mt-2">{timeAgo(lead.created_at)}</p>
    </div>
  );
}
