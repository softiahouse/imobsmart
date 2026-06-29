"use client";

import { useState, useRef } from "react";

interface Props {
  onClose: () => void;
  onImported: () => void;
}

export function CsvImportModal({ onClose, onImported }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number } | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    if (city) formData.append("city", city);

    const res = await fetch("/api/prospects/import", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al importar");
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass p-6 rounded-2xl w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Importar CSV</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-lg">×</button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">{result.imported}</p>
              <p className="text-green-400 text-sm">prospects importados</p>
            </div>
            <button onClick={onImported} className="w-full gradient-button py-2 text-white text-sm font-semibold">
              Ver Pipeline
            </button>
          </div>
        ) : (
          <>
            <p className="text-zinc-400 text-xs">
              Sube un CSV con columnas como: <strong>nombre, teléfono, email, web, ciudad, clasificación</strong>.
              El sistema mapea automáticamente los campos.
            </p>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-accent/40 transition-colors"
            >
              {file ? (
                <div>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-zinc-400 text-sm">Haz clic para seleccionar archivo CSV</p>
                  <p className="text-zinc-600 text-xs mt-1">o arrastra y suelta aquí</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="text-zinc-500 text-xs">Ciudad predeterminada (si no aparece en el CSV)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Torrevieja"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mt-1 focus:outline-none focus:border-accent"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full gradient-button py-2 text-white text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Importando..." : `Importar ${file ? file.name : ""}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
