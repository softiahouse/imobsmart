import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/ui/kanban-board";

export default async function CrmPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, property:properties(id, type, city, price)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">CRM — Leads</h2>
        {(() => {
          const hotCount = leads?.filter((l) => l.temperature === "hot").length ?? 0;
          if (hotCount === 0) return null;
          return (
            <span className="bg-red-500/15 border border-red-500/30 px-3 py-1 rounded-lg text-red-400 text-xs font-semibold">
              {hotCount} calientes 🔥
            </span>
          );
        })()}
      </div>
      <KanbanBoard initialLeads={leads ?? []} />
    </div>
  );
}
