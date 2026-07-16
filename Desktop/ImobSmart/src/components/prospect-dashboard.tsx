"use client";

import { useEffect, useState } from "react";
import { LOSS_REASONS } from "@/lib/types";

interface Stats {
  total: number;
  byStage: Record<string, number>;
  byClassification: Record<string, number>;
  lossReasons: Record<string, number>;
  pipelineValue: number;
  wonValue: number;
  totalDispatches: number;
  dailyDispatches: Record<string, number>;
  repStats: { email: string; dispatches: number; contacted: number; won: number }[];
  contacted: number;
  meeting: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
}

const STAGE_COLORS: Record<string, string> = {
  new: "#8b8bff",
  contacted: "#ffcc66",
  meeting: "#66ccff",
  proposal: "#ff99cc",
  negotiation: "#ffaa44",
  won: "#66ee66",
  lost: "#ff6666",
};

const STAGE_LABELS: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  meeting: "Reunión",
  proposal: "Propuesta",
  negotiation: "Negociación",
  won: "Cerrado ✓",
  lost: "Perdido",
};

const CLASS_COLORS: Record<string, string> = {
  no_site: "#ff6666",
  bad_site: "#ffcc66",
  good_site: "#66ee66",
  client: "#6666ff",
};

const CLASS_LABELS: Record<string, string> = {
  no_site: "Sem site",
  bad_site: "Site ruim",
  good_site: "Site bom",
  client: "Cliente",
};

const LOSS_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];

function BarChart({ data, maxVal }: { data: { label: string; value: number; color: string }[]; maxVal: number }) {
  if (maxVal === 0) maxVal = 1;
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 w-20 text-right truncate">{d.label}</span>
          <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg transition-all duration-500"
              style={{ width: `${Math.max((d.value / maxVal) * 100, 2)}%`, background: d.color }}
            />
            <span className="absolute right-2 top-0.5 text-[10px] text-white/80 font-semibold">{d.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-zinc-500 text-xs text-center py-8">Sem dados</p>;

  const radius = 60;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {data.map((d) => {
          const pct = d.value / total;
          const dashLen = pct * circumference;
          const dashOffset = -offset;
          offset += dashLen;
          return (
            <circle
              key={d.label}
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
            />
          );
        })}
        <text x="80" y="76" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{total}</text>
        <text x="80" y="94" textAnchor="middle" fill="#71717a" fontSize="10">total</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[10px] text-zinc-400 truncate">{d.label} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="glass p-4 rounded-xl flex items-center justify-between gap-3">
      <div>
        <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        {sub && <span className="text-[10px] font-semibold" style={{ color }}>{sub}</span>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${color}20`, color }}>
        {label.includes("Dispar") ? "📤" : label.includes("Contac") ? "💬" : label.includes("Vend") ? "🏆" : "🔥"}
      </div>
    </div>
  );
}

export function ProspectDashboard({ stateFilter }: { stateFilter?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = stateFilter ? `/api/prospects/stats?state=${stateFilter}` : "/api/prospects/stats";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, [stateFilter]);

  if (loading) return <div className="text-zinc-500 text-sm p-8 text-center">Carregando dashboard...</div>;
  if (!stats) return null;

  const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : "0";
  const engagementRate = stats.totalDispatches > 0
    ? ((stats.contacted / stats.totalDispatches) * 100).toFixed(0)
    : "—";

  const stageData = ["new", "contacted", "meeting", "proposal", "negotiation", "won", "lost"]
    .map((key) => ({
      label: STAGE_LABELS[key] || key,
      value: stats.byStage[key] || 0,
      color: STAGE_COLORS[key] || "#888",
    }));
  const maxStage = Math.max(...stageData.map((d) => d.value), 1);

  const classData = ["no_site", "bad_site", "good_site", "client"]
    .filter((k) => (stats.byClassification[k] || 0) > 0)
    .map((key) => ({
      label: CLASS_LABELS[key] || key,
      value: stats.byClassification[key] || 0,
      color: CLASS_COLORS[key] || "#888",
    }));

  const lossData = LOSS_REASONS
    .filter((r) => (stats.lossReasons[r.key] || 0) > 0)
    .map((r, i) => ({
      label: r.label,
      value: stats.lossReasons[r.key] || 0,
      color: LOSS_COLORS[i % LOSS_COLORS.length],
    }));

  const inNegotiation = (stats.byStage["meeting"] || 0) + (stats.byStage["proposal"] || 0) + (stats.byStage["negotiation"] || 0);

  const closedValue = stats.wonValue ?? 0;
  const commission = closedValue * 0.3;
  const cur = "R$";

  return (
    <div className="space-y-6">
      {/* KPI Cards — row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Disparos (7d)" value={stats.totalDispatches} sub={`${engagementRate}% engajamento`} color="#3b82f6" />
        <KpiCard label="Contactados" value={stats.contacted + inNegotiation} sub={`de ${stats.total} prospects`} color="#10b981" />
        <KpiCard label="Vendas Fechadas" value={stats.won} sub={`Taxa: ${conversionRate}%`} color="#66ee66" />
        <KpiCard label="Em Negociação" value={inNegotiation} sub={stats.pipelineValue > 0 ? `${cur} ${stats.pipelineValue.toLocaleString()}` : undefined} color="#ffaa44" />
      </div>

      {/* KPI Cards — row 2: revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-xl text-center">
          <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">Valor Fechado</p>
          <h3 className="text-2xl font-bold text-white mt-1">{closedValue > 0 ? `${cur} ${closedValue.toLocaleString()}` : "—"}</h3>
          <span className="text-[10px] text-zinc-500">total de contratos</span>
        </div>
        <div className="glass p-5 rounded-xl text-center border border-green-500/30">
          <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">Comissão 30%</p>
          <h3 className="text-2xl font-bold text-green-400 mt-1">{closedValue > 0 ? `${cur} ${commission.toLocaleString()}` : "—"}</h3>
          <span className="text-[10px] text-green-500/60">recorrente / mês</span>
        </div>
        <div className="glass p-5 rounded-xl text-center">
          <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">Pipeline Ativo</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{stats.pipelineValue > 0 ? `${cur} ${stats.pipelineValue.toLocaleString()}` : "—"}</h3>
          <span className="text-[10px] text-zinc-500">em negociação</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel by Stage */}
        <div className="glass p-5 rounded-xl lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-4">Funil por Etapa</h3>
          <BarChart data={stageData} maxVal={maxStage} />
        </div>

        {/* Classification Donut */}
        <div className="glass p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Classificação</h3>
          <DonutChart data={classData} />
        </div>
      </div>

      {/* Loss Reasons + Rep Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loss Reasons */}
        <div className="glass p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Motivos de Perda</h3>
          {lossData.length > 0 ? (
            <DonutChart data={lossData} />
          ) : (
            <p className="text-zinc-500 text-xs text-center py-8">
              Nenhum prospect marcado como perdido ainda.<br />
              <span className="text-zinc-600">Arraste cards para &quot;Perdido&quot; no pipeline para registrar motivos.</span>
            </p>
          )}
        </div>

        {/* Rep Ranking */}
        <div className="glass p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Ranking Vendedores</h3>
            <span className="text-[10px] text-zinc-500">Últimos 7 dias</span>
          </div>

          {stats.repStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-[10px]">
                    <th className="pb-2 font-semibold">#</th>
                    <th className="pb-2 font-semibold">Vendedor</th>
                    <th className="pb-2 font-semibold text-center">Disparos</th>
                    <th className="pb-2 font-semibold text-center">Contatos</th>
                    <th className="pb-2 font-semibold text-center">Vendas</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {stats.repStats
                    .sort((a, b) => b.won - a.won || b.dispatches - a.dispatches)
                    .map((rep, idx) => (
                      <tr key={rep.email} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2.5 font-bold text-zinc-500">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`}
                        </td>
                        <td className="py-2.5 font-semibold text-white">{rep.email.split("@")[0]}</td>
                        <td className="py-2.5 text-center text-zinc-400">{rep.dispatches}</td>
                        <td className="py-2.5 text-center text-zinc-400">{rep.contacted}</td>
                        <td className="py-2.5 text-center">
                          <span className="bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {rep.won}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-8">
              Sem dados de disparos ainda.<br />
              <span className="text-zinc-600">Disparos WhatsApp são registrados automaticamente.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
