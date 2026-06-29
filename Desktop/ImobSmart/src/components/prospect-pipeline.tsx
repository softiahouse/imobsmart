"use client";

import { useEffect, useState } from "react";
import type { Prospect, B2bStage, ProspectClassification } from "@/lib/types";

const STAGES: { key: B2bStage; label: string; color: string }[] = [
  { key: "new", label: "Nuevo", color: "#8b8bff" },
  { key: "contacted", label: "Contactado", color: "#ffcc66" },
  { key: "meeting", label: "Reunión", color: "#66ccff" },
  { key: "proposal", label: "Propuesta", color: "#ff99cc" },
  { key: "negotiation", label: "Negociación", color: "#ffaa44" },
  { key: "won", label: "Cerrado ✓", color: "#66ee66" },
  { key: "lost", label: "Perdido", color: "#ff6666" },
];

const CLASS_COLORS: Record<ProspectClassification, string> = {
  no_site: "#ff6666",
  bad_site: "#ffcc66",
  good_site: "#66ee66",
  client: "#6666ff",
};

const CLASS_LABELS: Record<ProspectClassification, string> = {
  no_site: "Sin web",
  bad_site: "Web mala",
  good_site: "Web buena",
  client: "Cliente",
};

const MSG_NO_SITE = `Hola 👋 Vi que tu inmobiliaria aún no tiene presencia online. Soy Pablo de *ImobSmart* — creamos sitios web profesionales para inmobiliarias + publicación automática en redes sociales + agente IA que atiende tus leads 24/7.

Tenemos un *plan gratuito permanente hasta 10 inmuebles*.

¿Te gustaría ver cómo funciona en 10 minutos?

🌐 imobsmart.es`;

const MSG_BAD_SITE = `Hola 👋 Soy Pablo de *ImobSmart*, una plataforma que ayuda a inmobiliarias a captar más clientes con:

✅ Publicación automática en Instagram, Facebook y TikTok
✅ Agente IA 24/7 que atiende leads por WhatsApp
✅ CRM visual con pipeline de ventas

Tenemos un *plan gratuito permanente hasta 10 inmuebles*.

¿Te interesaría ver una demo rápida de 10 minutos?

🌐 imobsmart.es`;

function formatPhone(phone: string, country: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("34") || digits.startsWith("55")) return digits;
  if (country === "ES") return `34${digits}`;
  if (country === "BR") return `55${digits}`;
  return digits;
}

export function ProspectPipeline() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prospects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProspects(data);
        setLoading(false);
      });
  }, []);

  async function moveToStage(prospectId: string, newStage: B2bStage) {
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, b2b_stage: newStage } : p))
    );
    await fetch("/api/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prospectId, b2b_stage: newStage }),
    });
  }

  async function updateProspect(id: string, updates: Partial<Prospect>) {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    await fetch("/api/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    setEditingId(null);
  }

  if (loading) {
    return <div className="text-zinc-500 text-sm p-8 text-center">Cargando pipeline...</div>;
  }

  const grouped = STAGES.map((stage) => ({
    ...stage,
    items: prospects.filter((p) => p.b2b_stage === stage.key),
  }));

  const totalDealValue = prospects
    .filter((p) => p.b2b_stage !== "lost")
    .reduce((sum, p) => sum + (p.deal_value || 0), 0);

  return (
    <div className="space-y-4">
      <div className="glass p-3 flex items-center gap-4 flex-wrap">
        <span className="text-zinc-400 text-sm">
          Total: <strong className="text-white">{prospects.length}</strong> prospects
        </span>
        {totalDealValue > 0 && (
          <span className="text-zinc-400 text-sm">
            Pipeline: <strong className="text-green-400">€{totalDealValue.toLocaleString()}</strong>
          </span>
        )}
        {STAGES.slice(0, -1).map((stage) => {
          const count = prospects.filter((p) => p.b2b_stage === stage.key).length;
          if (count === 0) return null;
          return (
            <span
              key={stage.key}
              className="text-[10px] px-2 py-1 rounded border"
              style={{ borderColor: `${stage.color}44`, color: stage.color, background: `${stage.color}15` }}
            >
              {count} {stage.label.toLowerCase()}
            </span>
          );
        })}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
        {grouped.map((stage) => (
          <div
            key={stage.key}
            className="flex-shrink-0 w-64"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging) moveToStage(dragging, stage.key);
              setDragging(null);
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 px-2"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
              <span className="text-xs font-semibold text-zinc-300">{stage.label}</span>
              <span className="text-[10px] text-zinc-500 ml-auto">{stage.items.length}</span>
            </div>

            <div className="space-y-2 min-h-[100px] rounded-xl p-2 border border-white/5 bg-white/[0.02]">
              {stage.items.map((prospect) => (
                <ProspectCard
                  key={prospect.id}
                  prospect={prospect}
                  stageColor={stage.color}
                  isEditing={editingId === prospect.id}
                  onEdit={() => setEditingId(prospect.id)}
                  onSave={(updates) => updateProspect(prospect.id, updates)}
                  onCancel={() => setEditingId(null)}
                  onDragStart={() => setDragging(prospect.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProspectCard({
  prospect,
  stageColor,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDragStart,
}: {
  prospect: Prospect;
  stageColor: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Prospect>) => void;
  onCancel: () => void;
  onDragStart: () => void;
}) {
  const [notes, setNotes] = useState(prospect.notes || "");
  const [dealValue, setDealValue] = useState(prospect.deal_value?.toString() || "");
  const [nextFollowup, setNextFollowup] = useState(prospect.next_followup?.slice(0, 10) || "");

  if (isEditing) {
    return (
      <div className="glass p-3 rounded-xl space-y-2" style={{ borderLeft: `3px solid ${stageColor}` }}>
        <p className="text-white text-sm font-semibold">{prospect.business_name}</p>
        <div>
          <label className="text-zinc-500 text-[10px]">Valor del deal (€)</label>
          <input
            type="number"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs mt-0.5"
          />
        </div>
        <div>
          <label className="text-zinc-500 text-[10px]">Próximo follow-up</label>
          <input
            type="date"
            value={nextFollowup}
            onChange={(e) => setNextFollowup(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs mt-0.5"
          />
        </div>
        <div>
          <label className="text-zinc-500 text-[10px]">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs mt-0.5 resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onSave({
                deal_value: dealValue ? parseFloat(dealValue) : null,
                next_followup: nextFollowup || null,
                notes: notes || null,
              })
            }
            className="text-[10px] px-3 py-1 rounded bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
          >
            Guardar
          </button>
          <button onClick={onCancel} className="text-[10px] px-3 py-1 rounded bg-white/5 text-zinc-400 border border-white/10">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      className="glass p-3 rounded-xl cursor-grab hover:bg-white/[0.08] transition-colors"
      style={{ borderLeft: `3px solid ${stageColor}` }}
    >
      <p className="text-white text-sm font-semibold truncate">{prospect.business_name}</p>
      <p className="text-zinc-500 text-[10px] mt-0.5">{prospect.city}{prospect.country ? `, ${prospect.country}` : ""}</p>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span
          className="text-[9px] px-1.5 py-0.5 rounded"
          style={{
            background: `${CLASS_COLORS[prospect.classification]}15`,
            color: CLASS_COLORS[prospect.classification],
          }}
        >
          {CLASS_LABELS[prospect.classification]}
        </span>
        {prospect.source === "csv_import" && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">CSV</span>
        )}
        {prospect.deal_value && (
          <span className="text-[10px] text-green-400 ml-auto">€{prospect.deal_value}</span>
        )}
      </div>

      {prospect.phone && (
        <a
          href={`https://wa.me/${formatPhone(prospect.phone, prospect.country)}?text=${encodeURIComponent(prospect.classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE)}`}
          target="_blank"
          rel="noopener"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[10px] text-green-400 hover:bg-green-500/10 rounded px-1.5 py-0.5 mt-1 w-fit border border-green-500/20"
        >
          💬 {prospect.phone}
        </a>
      )}
      {prospect.email && (
        <p className="text-[10px] text-zinc-500 truncate">✉ {prospect.email}</p>
      )}
      {prospect.notes && (
        <p className="text-[10px] text-zinc-600 mt-1 truncate">📝 {prospect.notes}</p>
      )}
      {prospect.next_followup && (
        <p className="text-[10px] text-yellow-500 mt-1">
          📅 {new Date(prospect.next_followup).toLocaleDateString("es-ES")}
        </p>
      )}
    </div>
  );
}
