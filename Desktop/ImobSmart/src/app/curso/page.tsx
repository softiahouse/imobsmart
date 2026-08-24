"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function CursoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    goal: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.company) return; // honeypot
    setStatus("sending");

    const supabase = createClient();
    const { company, ...payload } = form;
    const { error } = await supabase.from("course_leads").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-16">
        <div className="glass max-w-md w-full p-10 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-white mb-3">Você está na lista!</h1>
          <p className="text-zinc-400 leading-relaxed">
            Assim que abrir a próxima turma, você é avisado em primeiro lugar — pelo
            e-mail e WhatsApp que deixou. As vagas do acompanhamento são limitadas.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-12 md:py-20">
      <div className="max-w-xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-10">
          <p className="text-accent-light text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Curso · Lista de espera
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-5">
            Aprenda a construir seu{" "}
            <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
              próprio SaaS
            </span>.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Da ideia ao software no ar — mesmo sem faculdade de programação.
            €100 e <span className="text-white font-medium">3 meses de acompanhamento de perto</span> comigo.
          </p>
        </div>

        {/* O QUE VOCÊ LEVA */}
        <div className="glass p-6 md:p-8 mb-8">
          <div className="space-y-4">
            {[
              { t: "Construção do zero", d: "As ferramentas e o passo a passo que eu uso de verdade." },
              { t: "3 meses de acompanhamento", d: "Não é curso solto — eu acompanho o seu projeto." },
              { t: "Turma pequena", d: "Suporte de perto. Por isso as vagas são limitadas." },
            ].map((f) => (
              <div key={f.t} className="flex gap-3">
                <div className="text-accent-light mt-0.5">◆</div>
                <div>
                  <div className="text-white font-semibold text-sm">{f.t}</div>
                  <div className="text-zinc-500 text-sm">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 space-y-5">
          <div>
            <h2 className="text-white font-bold text-xl">Entrar na lista de espera</h2>
            <p className="text-zinc-500 text-sm mt-1">Sem compromisso. Você é avisado quando abrir a turma.</p>
          </div>

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              Algo deu errado ao enviar. Tenta de novo em instantes.
            </div>
          )}

          <label className="block">
            <span className="text-zinc-400 text-xs block mb-1.5">
              Nome completo <span className="text-accent-pink">*</span>
            </span>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className={inputCls} required autoComplete="name" />
          </label>

          <label className="block">
            <span className="text-zinc-400 text-xs block mb-1.5">
              E-mail <span className="text-accent-pink">*</span>
            </span>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className={inputCls} required autoComplete="email" />
          </label>

          <label className="block">
            <span className="text-zinc-400 text-xs block mb-1.5">WhatsApp (com DDD)</span>
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
              className={inputCls} placeholder="(51) 90000-0000" inputMode="tel" autoComplete="tel" />
          </label>

          <label className="block">
            <span className="text-zinc-400 text-xs block mb-1.5">O que você quer construir?</span>
            <textarea value={form.goal} onChange={(e) => set("goal", e.target.value)}
              className={`${inputCls} min-h-[80px] resize-y`} rows={3}
              placeholder="Sua ideia de SaaS, ou só a vontade de aprender…" />
          </label>

          {/* honeypot anti-bot */}
          <input type="text" tabIndex={-1} autoComplete="off"
            value={form.company} onChange={(e) => set("company", e.target.value)}
            className="hidden" aria-hidden="true" />

          <button type="submit" disabled={status === "sending"}
            className="w-full gradient-button py-4 text-white font-semibold text-base disabled:opacity-50">
            {status === "sending" ? "Enviando…" : "Quero ser avisado"}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-8">
          ImobSmart · Construa. Aprenda. Cresça.
        </p>
      </div>
    </main>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent placeholder:text-zinc-600";
