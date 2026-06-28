"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
export default function SignupPage() {
  const [orgName, setOrgName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { org_name: orgName, user_name: name },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
          ImobSmart
        </h1>
        <p className="text-zinc-500 text-sm mt-2">Criar conta grátis</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-zinc-500 text-xs block mb-1">Nome da imobiliária</label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Ex: Costa Sol Imóveis"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="text-zinc-500 text-xs block mb-1">Seu nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            required
          />
        </div>
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
          <label className="text-zinc-500 text-xs block mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
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
        {loading ? "Criando..." : "Criar conta grátis"}
      </button>

      <p className="text-center text-zinc-500 text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-accent hover:underline">Entrar</Link>
      </p>
    </form>
  );
}
