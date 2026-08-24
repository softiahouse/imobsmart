import { createClient } from "@/lib/supabase/server";

type Application = {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  state: string;
  city: string | null;
  role_interest: "closer" | "lider" | "ambos";
  experience: string | null;
  current_activity: string | null;
  availability: string | null;
  why: string | null;
  status: "new" | "contacted" | "approved" | "rejected";
  created_at: string;
};

const ROLE_LABEL: Record<Application["role_interest"], string> = {
  closer: "Closer",
  lider: "Líder",
  ambos: "Closer / Líder",
};

const STATUS_STYLE: Record<Application["status"], { label: string; cls: string }> = {
  new: { label: "Novo", cls: "bg-accent/15 text-accent-light border-accent/30" },
  contacted: { label: "Contatado", cls: "bg-warm/15 text-warm border-warm/30" },
  approved: { label: "Aprovado", cls: "bg-success/15 text-success border-success/30" },
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

export default async function CandidaturasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partner_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const apps = (data ?? []) as Application[];
  const byState = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.state] = (acc[a.state] ?? 0) + 1;
    return acc;
  }, {});
  const newCount = apps.filter((a) => a.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidaturas de parceiros</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {apps.length} no total · {newCount} novas · {Object.keys(byState).length} estados
          </p>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-zinc-500">
            Nenhuma candidatura ainda. Divulgue o link{" "}
            <span className="text-accent-light">/parceiros</span> na campanha do Instagram.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {apps.map((a) => {
            const st = STATUS_STYLE[a.status];
            return (
              <div key={a.id} className="glass p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">{a.name}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">
                      {a.city ? `${a.city} · ` : ""}{a.state} · {formatDate(a.created_at)}
                    </div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-300">
                    {ROLE_LABEL[a.role_interest]}
                  </span>
                  {a.experience && (
                    <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400">
                      {a.experience}
                    </span>
                  )}
                  {a.availability && (
                    <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400">
                      ⏱ {a.availability}
                    </span>
                  )}
                </div>

                {a.current_activity && (
                  <p className="text-zinc-400 text-sm">
                    <span className="text-zinc-600">Faz hoje:</span> {a.current_activity}
                  </p>
                )}
                {a.why && (
                  <p className="text-zinc-300 text-sm border-l-2 border-accent/40 pl-3">
                    “{a.why}”
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <a href={waLink(a.whatsapp)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] rounded-xl py-2 text-sm font-medium hover:bg-[#25D366]/25 transition-colors">
                    WhatsApp · {a.whatsapp}
                  </a>
                  {a.email && (
                    <a href={`mailto:${a.email}`}
                      className="px-4 text-center bg-white/5 border border-white/10 text-zinc-300 rounded-xl py-2 text-sm hover:bg-white/10 transition-colors">
                      E-mail
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
