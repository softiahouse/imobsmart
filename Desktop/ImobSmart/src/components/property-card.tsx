import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function PropertyCard({ property }: { property: Property }) {
  const photoUrl = property.photos[0];

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="rounded-2xl overflow-hidden relative h-48 glass group">
        {photoUrl ? (
          <img src={photoUrl} alt={property.city} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5a] to-[#2a4a6a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-bold">
          {formatPrice(property.price)}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-sm">
            {property.type === "apartment" ? "Piso" : property.type === "house" ? "Casa" : property.type} — {property.city}
          </p>
          <div className="flex gap-3 mt-1 text-zinc-400 text-xs">
            {property.bedrooms && <span>🛏 {property.bedrooms}</span>}
            {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
            {property.area_m2 && <span>📐 {property.area_m2}m²</span>}
          </div>
          {property.publish_targets && Object.keys(property.publish_targets).length > 0 && (
            <div className="flex gap-1 mt-2">
              {!!(property.publish_targets as Record<string, unknown>).instagram && (
                <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#E1306C]/20 text-[#E1306C]">IG ✓</span>
              )}
              {!!(property.publish_targets as Record<string, unknown>).facebook && (
                <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#1877F2]/20 text-[#1877F2]">FB ✓</span>
              )}
              {!!(property.publish_targets as Record<string, unknown>).tiktok && (
                <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#00f2ea]/20 text-[#00f2ea]">TK ✓</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
