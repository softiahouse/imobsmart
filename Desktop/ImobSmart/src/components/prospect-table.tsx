"use client";

import { useState } from "react";
import type { Prospect, ProspectClassification } from "@/lib/types";

const CLASS_CONFIG: Record<ProspectClassification, { label: string; color: string; bg: string }> = {
  no_site: { label: "SIN WEB", color: "#ff6666", bg: "rgba(255,68,68,0.15)" },
  bad_site: { label: "WEB MALA", color: "#ffcc66", bg: "rgba(255,170,51,0.15)" },
  good_site: { label: "WEB BUENA", color: "#66ee66", bg: "rgba(68,204,68,0.15)" },
  client: { label: "CLIENTE", color: "#6666ff", bg: "rgba(68,68,255,0.15)" },
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

export function ProspectTable() {
  const [city, setCity] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    if (!city.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/prospects?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    setProspects(data);
    setLoading(false);
  }

  const counts = {
    no_site: prospects.filter((p) => p.classification === "no_site").length,
    bad_site: prospects.filter((p) => p.classification === "bad_site").length,
    good_site: prospects.filter((p) => p.classification === "good_site").length,
    client: prospects.filter((p) => p.classification === "client").length,
  };

  return (
    <div className="space-y-4">
      <div className="glass p-4 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-zinc-500 text-xs">Ciudad</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Torrevieja, España"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
          />
        </div>
        <button onClick={search} disabled={loading} className="gradient-button px-6 py-2 text-white text-sm font-semibold">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {prospects.length > 0 && (
        <>
          <div className="glass p-3 flex items-center gap-3 flex-wrap">
            <span className="text-zinc-400 text-sm">
              Encontrados: <strong className="text-white">{prospects.length}</strong>
            </span>
            {(Object.entries(counts) as [ProspectClassification, number][]).map(([key, count]) => {
              if (count === 0) return null;
              const cfg = CLASS_CONFIG[key];
              return (
                <span key={key} className="text-xs px-3 py-1 rounded-md border" style={{ background: cfg.bg, borderColor: `${cfg.color}66`, color: cfg.color }}>
                  {count} {cfg.label.toLowerCase()}
                </span>
              );
            })}
          </div>

          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Nombre</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Teléfono</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Web</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Clasificación</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p) => {
                  const cfg = CLASS_CONFIG[p.classification];
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3 text-white">{p.business_name}</td>
                      <td className="p-3 text-zinc-400">{p.phone ?? "—"}</td>
                      <td className="p-3">
                        {p.website_url ? (
                          <a href={p.website_url} target="_blank" rel="noopener" className="text-accent text-xs hover:underline">
                            {p.website_url.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="text-red-400 text-xs">No tiene</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-1 rounded border" style={{ background: cfg.bg, borderColor: `${cfg.color}66`, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-3">
                        {p.classification !== "client" && p.phone && (
                          <a
                            href={`https://wa.me/${formatPhone(p.phone, p.country)}?text=${encodeURIComponent(p.classification === "no_site" ? MSG_NO_SITE : MSG_BAD_SITE)}`}
                            target="_blank"
                            rel="noopener"
                            className="text-xs px-3 py-1 rounded-md border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
