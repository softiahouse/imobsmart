"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillSelect } from "@/components/ui/pill-select";
import { PhotoUploader } from "@/components/ui/photo-uploader";
import { PROPERTY_TYPES, OPERATION_TYPES } from "@/lib/constants";
import type { PropertyType, OperationType } from "@/lib/types";

interface PropertyFormProps {
  orgId: string;
}

export function PropertyForm({ orgId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [type, setType] = useState<PropertyType>("apartment");
  const [operation, setOperation] = useState<OperationType>("sale");
  const [form, setForm] = useState({
    price: "",
    city: "",
    neighborhood: "",
    area_m2: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    description: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        operation,
        price: parseFloat(form.price),
        city: form.city,
        neighborhood: form.neighborhood || null,
        area_m2: form.area_m2 ? parseFloat(form.area_m2) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        floor: form.floor ? parseInt(form.floor) : null,
        description: form.description || null,
        photos,
        status: "published",
      }),
    });

    if (res.ok) {
      router.push("/properties");
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <PhotoUploader orgId={orgId} photos={photos} onChange={setPhotos} />

      <PillSelect label="Tipo" options={PROPERTY_TYPES} value={type} onChange={setType} />
      <PillSelect label="Operación" options={OPERATION_TYPES} value={operation} onChange={setOperation} activeColor="rgba(74,255,74,0.2)" />

      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4">
          <label className="text-zinc-500 text-xs">Precio (€)</label>
          <input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="w-full bg-transparent text-white text-lg font-semibold mt-1 focus:outline-none" placeholder="185.000" required />
        </div>
        <div className="glass p-4">
          <label className="text-zinc-500 text-xs">Superficie (m²)</label>
          <input type="number" value={form.area_m2} onChange={(e) => updateField("area_m2", e.target.value)} className="w-full bg-transparent text-white text-lg font-semibold mt-1 focus:outline-none" placeholder="78" />
        </div>
      </div>

      <div className="glass p-4">
        <label className="text-zinc-500 text-xs">Ciudad</label>
        <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full bg-transparent text-white mt-1 focus:outline-none" placeholder="Torrevieja" required />
      </div>

      <div className="glass p-4">
        <label className="text-zinc-500 text-xs">Barrio</label>
        <input type="text" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} className="w-full bg-transparent text-white mt-1 focus:outline-none" placeholder="Playa del Cura" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "bedrooms", label: "Habitaciones", placeholder: "2" },
          { key: "bathrooms", label: "Baños", placeholder: "1" },
          { key: "floor", label: "Planta", placeholder: "3" },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="glass p-3 text-center">
            <label className="text-zinc-500 text-[10px]">{label}</label>
            <input type="number" value={form[key as keyof typeof form]} onChange={(e) => updateField(key, e.target.value)} className="w-full bg-transparent text-white text-lg font-bold text-center mt-1 focus:outline-none" placeholder={placeholder} />
          </div>
        ))}
      </div>

      <div className="glass p-4">
        <label className="text-zinc-500 text-xs">Descripción (opcional — la IA complementa)</label>
        <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className="w-full bg-transparent text-white mt-1 focus:outline-none resize-none" placeholder="Vistas al mar, reformado recientemente..." />
      </div>

      <button type="submit" disabled={loading || photos.length === 0} className="w-full gradient-button py-4 text-white font-bold text-base tracking-wide disabled:opacity-50">
        {loading ? "Publicando..." : "Publicar en Todas las Redes →"}
      </button>
    </form>
  );
}
