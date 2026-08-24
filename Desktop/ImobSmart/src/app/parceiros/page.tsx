"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const ROLES = [
  { value: "closer", label: "Closer", desc: "Quero fechar vendas" },
  { value: "lider", label: "Líder", desc: "Quero formar e liderar um time no meu estado" },
  { value: "ambos", label: "Os dois", desc: "Começar fechando e crescer pra liderança" },
];

const EXPERIENCE = [
  "Trabalho com vendas hoje",
  "Já trabalhei com vendas",
  "Sou do ramo imobiliário",
  "Nunca vendi, mas quero aprender",
];

export default function ParceirosPage() {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    state: "",
    city: "",
    role_interest: "ambos",
    experience: "",
    current_activity: "",
    availability: "",
    why: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.company) return; // honeypot: bot preencheu, ignora silenciosamente
    setStatus("sending");

    const supabase = createClient();
    const { company, ...payload } = form;
    const { error } = await supabase.from("partner_applications").insert(payload);

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
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-white mb-3">Candidatura enviada!</h1>
          <p className="text-zinc-400 leading-relaxed">
            Recebemos seus dados. Nossa equipe vai analisar e entrar em contato pelo
            WhatsApp que você deixou. Fica de olho — as vagas por estado são limitadas.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-10">
          <p className="text-accent-light text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Programa de Parceiros · Brasil
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-5">
            Seja o parceiro{" "}
            <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
              ImobSmart
            </span>{" "}
            no seu estado.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
            Vendemos o SaaS que coloca imobiliárias no automático — autopostagem,
            CRM e agente de IA no WhatsApp. Você vende. A gente sustenta a tecnologia.
          </p>
        </div>

        {/* DIVISÃO 1/3 */}
        <div className="glass p-6 md:p-8 mb-6">
          <h2 className="text-white font-semibold text-lg mb-5 text-center">
            Como a comissão é dividida
          </h2>
          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
            {[
              { t: "⅓", who: "Closer", d: "quem fecha" },
              { t: "⅓", who: "Líder", d: "quem lidera o time" },
              { t: "⅓", who: "ImobSmart", d: "tecnologia" },
            ].map((c) => (
              <div key={c.who} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-accent-pink bg-clip-text text-transparent">
                  {c.t}
                </div>
                <div className="text-white text-sm font-semibold mt-2">{c.who}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{c.d}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-warm text-sm font-medium mt-5">
            ◆ Recorrente e vitalício — enquanto o cliente ficar, você ganha todo mês.
          </p>
        </div>

        {/* RESPONSABILIDADES */}
        <div className="grid md:grid-cols-2 gap-3 mb-10">
          <div className="glass p-5">
            <div className="text-white font-semibold text-sm mb-2">Você cuida de</div>
            <p className="text-zinc-400 text-sm">Relacionamento, apresentar a solução e fechar. Nada de código.</p>
          </div>
          <div className="glass p-5">
            <div className="text-white font-semibold text-sm mb-2">A gente cuida de</div>
            <p className="text-zinc-400 text-sm">Arquitetura, evolução, hospedagem e segurança do produto.</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="glass p-6 md:p-8 space-y-5">
          <div>
            <h2 className="text-white font-bold text-xl">Quero me candidatar</h2>
            <p className="text-zinc-500 text-sm mt-1">Leva 1 minuto. Retornamos pelo WhatsApp.</p>
          </div>

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
              Algo deu errado ao enviar. Tenta de novo em instantes.
            </div>
          )}

          <Field label="Nome completo" required>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className={inputCls} required autoComplete="name" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WhatsApp (com DDD)" required>
              <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
                className={inputCls} required placeholder="(51) 90000-0000"
                inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="E-mail">
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                className={inputCls} autoComplete="email" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Estado" required>
              <select value={form.state} onChange={(e) => set("state", e.target.value)}
                className={inputCls} required>
                <option value="">Selecione…</option>
                {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </Field>
            <Field label="Cidade">
              <input value={form.city} onChange={(e) => set("city", e.target.value)}
                className={inputCls} />
            </Field>
          </div>

          <Field label="Você quer atuar como" required>
            <div className="grid gap-2">
              {ROLES.map((r) => {
                const active = form.role_interest === r.value;
                return (
                  <button type="button" key={r.value}
                    onClick={() => set("role_interest", r.value)}
                    className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                      active
                        ? "glass-accent text-white border-accent/50"
                        : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                    }`}>
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs text-zinc-500">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Sua experiência">
            <select value={form.experience} onChange={(e) => set("experience", e.target.value)}
              className={inputCls}>
              <option value="">Selecione…</option>
              {EXPERIENCE.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </Field>

          <Field label="O que você faz hoje?">
            <input value={form.current_activity} onChange={(e) => set("current_activity", e.target.value)}
              className={inputCls} placeholder="Sua profissão / ocupação atual" />
          </Field>

          <Field label="Quanto tempo por semana você tem?">
            <input value={form.availability} onChange={(e) => set("availability", e.target.value)}
              className={inputCls} placeholder="Ex.: 10h, meio período, integral…" />
          </Field>

          <Field label="Por que você quer entrar nisso?">
            <textarea value={form.why} onChange={(e) => set("why", e.target.value)}
              className={`${inputCls} min-h-[90px] resize-y`} rows={3} />
          </Field>

          {/* honeypot anti-bot: escondido de humanos */}
          <input
            type="text" tabIndex={-1} autoComplete="off"
            value={form.company} onChange={(e) => set("company", e.target.value)}
            className="hidden" aria-hidden="true"
          />

          <button type="submit" disabled={status === "sending"}
            className="w-full gradient-button py-4 text-white font-semibold text-base disabled:opacity-50">
            {status === "sending" ? "Enviando…" : "Enviar candidatura"}
          </button>

          <p className="text-center text-zinc-600 text-xs">
            Ao enviar, você concorda em ser contatado pela nossa equipe sobre a parceria.
          </p>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-8">
          ImobSmart · SaaS para imobiliárias
        </p>
      </div>
    </main>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent placeholder:text-zinc-600";

function Field({
  label, required, children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-zinc-400 text-xs block mb-1.5">
        {label} {required && <span className="text-accent-pink">*</span>}
      </span>
      {children}
    </label>
  );
}
