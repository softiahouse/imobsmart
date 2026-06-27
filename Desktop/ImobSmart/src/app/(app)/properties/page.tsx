import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/property-card";
import Link from "next/link";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Imóveis</h2>
        <Link href="/properties/new" className="gradient-button px-4 py-2 text-white text-sm font-semibold">
          + Novo
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties?.map((p) => <PropertyCard key={p.id} property={p} />) ?? (
          <p className="text-zinc-600 col-span-full text-center py-12">Nenhum imóvel. Crie o primeiro!</p>
        )}
      </div>
    </div>
  );
}
