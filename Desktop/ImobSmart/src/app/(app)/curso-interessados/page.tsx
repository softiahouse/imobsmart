import { createClient } from "@/lib/supabase/server";

type CourseLead = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  goal: string | null;
  status: "new" | "contacted" | "enrolled" | "rejected";
  created_at: string;
};

const STATUS_STYLE: Record<CourseLead["status"], { label: string; cls: string }> = {
  new: { label: "Novo", cls: "bg-accent/15 text-accent-light border-accent/30" },
  contacted: { label: "Contatado", cls: "bg-warm/15 text-warm border-warm/30" },
  enrolled: { label: "Matriculado", cls: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Recusado", cls: "bg-white/5 text-zinc-500 border-white/10" },
};

function waLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function CursoInteressadosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as CourseLead[];
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lista de espera — Curso</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {leads.length} no total · {newCount} novos
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-zinc-500">
            Ninguém na lista ainda. Divulgue o link{" "}
            <span className="text-accent-light">/curso</span> na campanha do Instagram.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {leads.map((l) => {
            const st = STATUS_STYLE[l.status];
            return (
              <div key={l.id} className="glass p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">{l.name}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{formatDate(l.created_at)}</div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                {l.goal && (
                  <p className="text-zinc-300 text-sm border-l-2 border-accent/40 pl-3">
                    “{l.goal}”
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <a href={`mailto:${l.email}`}
                    className="flex-1 text-center bg-white/5 border border-white/10 text-zinc-300 rounded-xl py-2 text-sm hover:bg-white/10 transition-colors">
                    {l.email}
                  </a>
                  {l.whatsapp && (
                    <a href={waLink(l.whatsapp)} target="_blank" rel="noopener noreferrer"
                      className="px-4 text-center bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] rounded-xl py-2 text-sm font-medium hover:bg-[#25D366]/25 transition-colors">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
