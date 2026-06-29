import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/property-form";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold">Nuevo Inmueble</h2>
      </div>
      <PropertyForm orgId={profile.org_id} />
    </div>
  );
}
