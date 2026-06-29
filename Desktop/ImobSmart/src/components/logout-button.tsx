"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
