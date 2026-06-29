"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
          ImobSmart
        </h1>
        <p className="text-zinc-500 text-sm mt-2">Acceder al panel</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-zinc-500 text-xs block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="text-zinc-500 text-xs block mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-button py-3 text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Acceder"}
      </button>

      <p className="text-center text-zinc-500 text-sm">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-accent hover:underline">Crear cuenta</Link>
      </p>
    </form>
  );
}
