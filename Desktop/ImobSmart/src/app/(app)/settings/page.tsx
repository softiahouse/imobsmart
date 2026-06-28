import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/lib/constants";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.from("users").select("*, organizations(*)").single();
  if (!user) redirect("/login");

  const org = user.organizations as Record<string, unknown>;
  const plan = (org.plan as string) ?? "free";
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-bold">Configurações</h2>

      <div className="glass p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400">Organização</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs">Nome</p>
            <p className="text-white">{org.name as string}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">Plano</p>
            <p className="text-white capitalize">{plan} — até {limits.maxProperties === Infinity ? "∞" : limits.maxProperties} imóveis</p>
          </div>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400">Redes Sociais Conectadas</h3>
        <p className="text-zinc-500 text-xs">Conecte suas contas para autopostagem. A configuração dos tokens é feita via n8n.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Instagram", color: "#E1306C", key: "instagram" },
            { name: "Facebook", color: "#1877F2", key: "facebook" },
            { name: "TikTok", color: "#00f2ea", key: "tiktok", needsPro: true },
            { name: "Google Ads", color: "#FBBC05", key: "google_ads", needsBusiness: true },
          ].map((network) => {
            const connected = !!(org.social_connections as Record<string, unknown>)?.[network.key];
            const locked = (network.needsPro && plan === "free") || (network.needsBusiness && plan !== "business");

            return (
              <div
                key={network.key}
                className="rounded-xl p-3 border"
                style={{
                  background: connected ? `${network.color}15` : "rgba(255,255,255,0.03)",
                  borderColor: connected ? `${network.color}40` : "rgba(255,255,255,0.08)",
                  opacity: locked ? 0.4 : 1,
                }}
              >
                <p className="text-sm font-medium" style={{ color: connected ? network.color : "#888" }}>
                  {network.name}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {locked ? `Requer plano ${network.needsBusiness ? "Business" : "Pro"}` : connected ? "Conectado ✓" : "Não conectado"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
