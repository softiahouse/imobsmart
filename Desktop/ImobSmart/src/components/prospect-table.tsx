"use client";

import { useState } from "react";
import type { Prospect, ProspectClassification } from "@/lib/types";

const CLASS_CONFIG: Record<ProspectClassification, { label: string; color: string; bg: string }> = {
  no_site: { label: "SEM SITE", color: "#ff6666", bg: "rgba(255,68,68,0.15)" },
  bad_site: { label: "SITE RUIM", color: "#ffcc66", bg: "rgba(255,170,51,0.15)" },
  good_site: { label: "SITE BOM", color: "#66ee66", bg: "rgba(68,204,68,0.15)" },
  client: { label: "CLIENTE", color: "#6666ff", bg: "rgba(68,68,255,0.15)" },
};

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
          <label className="text-zinc-500 text-xs">Cidade</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Torrevieja, Espanha"
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
              Encontradas: <strong className="text-white">{prospects.length}</strong>
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
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Nome</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Telefone</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Site</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Classificação</th>
                  <th className="text-left p-3 text-zinc-500 text-xs font-semibold">Ação</th>
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
                          <span className="text-red-400 text-xs">Não tem</span>
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
                            href={`https://wa.me/${p.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Somos da ImobSmart, uma plataforma que ajuda imobiliárias a publicar imóveis automaticamente nas redes sociais. Posso explicar como funciona?`)}`}
                            target="_blank"
                            rel="noopener"
                            className="text-xs px-3 py-1 rounded-md border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          >
                            Contactar →
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
