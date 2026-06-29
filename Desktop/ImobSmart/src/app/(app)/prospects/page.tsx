"use client";

import { useState } from "react";
import { ProspectTable } from "@/components/prospect-table";
import { ProspectPipeline } from "@/components/prospect-pipeline";
import { CsvImportModal } from "@/components/csv-import-modal";

export default function ProspectsPage() {
  const [view, setView] = useState<"table" | "pipeline">("pipeline");
  const [showImport, setShowImport] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

      {view === "pipeline" ? (
        <ProspectPipeline key={refreshKey} />
      ) : (
        <ProspectTable key={refreshKey} />
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
