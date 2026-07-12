import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import { UserMenu } from "@/components/user-menu";

export async function AppHeader() {
  const supabase = await createClient();

  const { data: user } = await supabase.from("users").select("name, org_id, organizations(name)").single();

  const orgs = user?.organizations as { name: string } | { name: string }[] | null | undefined;
  const orgName = (Array.isArray(orgs) ? orgs[0]?.name : orgs?.name) ?? "ImobSmart";
  const userName = user?.name ?? "Usuario";

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4">
      <div>
        <p className="text-zinc-500 text-xs">Bienvenido,</p>
        <h2 className="text-lg font-bold text-white">{orgName}</h2>
      </div>
      <UserMenu initials={getInitials(userName)} />
    </header>
  );
}
