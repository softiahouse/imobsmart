"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploaderProps {
  orgId: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}

export function PhotoUploader({ orgId, photos, onChange, max = 20 }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    if (photos.length + files.length > max) return;
    setUploading(true);

    const supabase = createClient();
    const newPhotos: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${orgId}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("property-photos")
        .upload(path, file, { contentType: file.type });

      if (!error) {
        const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
        newPhotos.push(data.publicUrl);
      }
    }

    onChange([...photos, ...newPhotos]);
    setUploading(false);
  }, [orgId, photos, onChange, max]);

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div
      className="rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 p-5 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
    >
      <p className="text-2xl mb-1">📸</p>
      <p className="text-accent text-sm font-medium">
        {uploading ? "Enviando..." : "Arrastar fotos aqui"}
      </p>
      <p className="text-zinc-600 text-xs mt-1">até {max} fotos • JPG, PNG</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        id="photo-input"
      />
      <label htmlFor="photo-input" className="text-accent text-xs cursor-pointer underline mt-2 inline-block">
        ou clique para selecionar
      </label>

      {photos.length > 0 && (
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {photos.map((url, i) => (
            <div key={url} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < max && (
            <label
              htmlFor="photo-input"
              className="w-14 h-14 rounded-lg border border-dashed border-accent/40 flex items-center justify-center text-accent text-lg cursor-pointer"
            >
              +
            </label>
          )}
        </div>
      )}
    </div>
  );
}
