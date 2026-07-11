"use client";

import { useEffect, useState } from "react";
import { ProspectTable } from "@/components/prospect-table";
import { ProspectPipeline } from "@/components/prospect-pipeline";
import { CsvImportModal } from "@/components/csv-import-modal";
import { createClient } from "@/lib/supabase/client";
import { isProspectsAdmin, getRepStates } from "@/lib/prospects-access";

const STATE_LABELS: Record<string, string> = {
  RS: "RS — Layara",
  SC: "SC — Samuel",
};

export default function ProspectsPage() {
  const [view, setView] = useState<"table" | "pipeline">("pipeline");
  const [showImport, setShowImport] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [repStates, setRepStates] = useState<{ state: string; label: string }[]>([]);
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isProspectsAdmin(user?.email)) {
        setIsAdmin(true);
        setRepStates(
          getRepStates().map((r) => ({
            state: r.state,
            label: STATE_LABELS[r.state] || r.state,
          }))
        );
      }
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Prospección B2B</h2>
          <p className="text-zinc-500 text-xs mt-1">Pipeline de ventas y gestión de prospects</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 text-xs border border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10"
          >
            📄 Importar CSV
          </button>
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setView("pipeline")}
              className={`px-3 py-2 text-xs ${view === "pipeline" ? "bg-accent/20 text-accent" : "bg-white/5 text-zinc-400 hover:bg-white/10"}`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 text-xs ${view === "table" ? "bg-accent/20 text-accent" : "bg-white/5 text-zinc-400 hover:bg-white/10"}`}
            >
              Tabla
            </button>
          </div>
        </div>
      </div>

      {isAdmin && repStates.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-zinc-500 text-xs mr-1">Filtrar:</span>
          <button
            onClick={() => { setStateFilter(undefined); setRefreshKey((k) => k + 1); }}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              !stateFilter
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            Todos
          </button>
          {repStates.map((rs) => (
            <button
              key={rs.state}
              onClick={() => { setStateFilter(rs.state); setRefreshKey((k) => k + 1); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                stateFilter === rs.state
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              {rs.label}
            </button>
          ))}
        </div>
      )}

      {view === "pipeline" ? (
        <ProspectPipeline key={`${refreshKey}-${stateFilter}`} stateFilter={stateFilter} />
      ) : (
        <ProspectTable key={`${refreshKey}-${stateFilter}`} stateFilter={stateFilter} />
      )}

      {showImport && (
        <CsvImportModal
          onClose={() => setShowImport(false)}
          onImported={() => {
            setShowImport(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
