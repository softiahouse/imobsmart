import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/stat-card";
import { PropertyCard } from "@/components/property-card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: propertyCount },
    { count: leadCount },
    { count: hotLeadCount },
    { data: recentProperties },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("temperature", "hot"),
    supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(4),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Inmuebles" value={propertyCount ?? 0} subtitle="publicados" color="#5a5aff" />
        <StatCard label="Leads" value={leadCount ?? 0} subtitle={`${hotLeadCount ?? 0} calientes 🔥`} color="#4aff4a" />
        <StatCard label="Posts" value={0} subtitle="esta semana" color="#cc66ff" />
        <StatCard label="Visitas" value={0} subtitle="agendadas" color="#ffaa33" />
      </div>

      <div>
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Últimos inmuebles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProperties?.map((p) => <PropertyCard key={p.id} property={p} />) ?? (
            <p className="text-zinc-600 col-span-full text-center py-8">Ningún inmueble aún. ¡Crea el primero!</p>
          )}
        </div>
      </div>
    </div>
  );
}
