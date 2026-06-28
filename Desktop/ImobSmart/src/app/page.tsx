import Link from "next/link";

const FEATURES = [
  {
    icon: "🏠",
    title: "Cadastro de Imóveis",
    desc: "Adicione imóveis com fotos, detalhes e preço. Publicação automática nas redes sociais com um clique.",
  },
  {
    icon: "📱",
    title: "Autopostagem Social",
    desc: "Publique automaticamente no Instagram, Facebook, TikTok e Google Ads. Sem esforço manual.",
  },
  {
    icon: "🤖",
    title: "Agente IA 24/7",
    desc: "Atenda leads pelo WhatsApp e Webchat com IA que qualifica, agenda visitas e nunca dorme.",
  },
  {
    icon: "📊",
    title: "CRM Kanban",
    desc: "Gerencie leads com pipeline visual: novo → contactado → visita → proposta → fechado.",
  },
  {
    icon: "🔍",
    title: "Prospecção B2B",
    desc: "Encontre imobiliárias por cidade. Classifique por presença digital. Importe listas CSV.",
  },
  {
    icon: "📈",
    title: "Dashboard Inteligente",
    desc: "Visão completa: imóveis publicados, leads quentes, posts da semana e visitas agendadas.",
  },
];

const STEPS = [
  { num: "1", title: "Crie sua conta", desc: "Gratuito, sem cartão de crédito. Pronto em 30 segundos." },
  { num: "2", title: "Adicione imóveis", desc: "Cadastre com fotos e detalhes. O sistema gera o anúncio." },
  { num: "3", title: "Ative as redes", desc: "Conecte Instagram, Facebook e WhatsApp. Publique com 1 clique." },
  { num: "4", title: "Receba leads", desc: "O agente IA atende, qualifica e organiza no CRM automático." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
            ImobSmart
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href="/signup" className="gradient-button px-5 py-2 text-sm text-white font-semibold">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block glass-accent px-4 py-1.5 rounded-full text-xs text-accent-light mb-6">
            Plataforma SaaS para imobiliárias inteligentes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Publique imóveis.{" "}
            <span className="bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
              Capte leads.
            </span>
            <br />
            Feche negócios.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Automatize a publicação de imóveis nas redes sociais, atenda leads com IA 24/7
            e gerencie todo o funil de vendas num só lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="gradient-button px-8 py-4 text-white font-bold text-lg w-full sm:w-auto text-center"
            >
              Criar conta grátis →
            </Link>
            <a
              href="#funcionalidades"
              className="glass px-8 py-4 text-zinc-300 font-semibold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Ver funcionalidades
            </a>
          </div>
          <p className="text-zinc-600 text-xs mt-4">Sem cartão de crédito. Configure em minutos.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5+", label: "Redes sociais" },
            { value: "24/7", label: "Agente IA ativo" },
            { value: "< 1min", label: "Para publicar" },
            { value: "0€", label: "Para começar" },
          ].map((s) => (
            <div key={s.label} className="glass p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Tudo que sua imobiliária precisa
            </h2>
            <p className="text-zinc-500 text-lg">
              Do cadastro do imóvel ao fechamento do negócio, tudo automatizado.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass p-6 hover:bg-white/[0.08] transition-colors group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Como funciona
            </h2>
            <p className="text-zinc-500 text-lg">4 passos para transformar sua imobiliária</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="glass p-6 flex gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-full gradient-button flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-zinc-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redes sociais */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Publique em todas as redes
          </h2>
          <p className="text-zinc-500 text-lg mb-10">
            Um imóvel cadastrado, publicado automaticamente em todas as plataformas.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { name: "Instagram", color: "var(--color-ig)" },
              { name: "Facebook", color: "var(--color-fb)" },
              { name: "TikTok", color: "var(--color-tk)" },
              { name: "WhatsApp", color: "var(--color-wa)" },
              { name: "Google Ads", color: "var(--color-gads)" },
            ].map((net) => (
              <div
                key={net.name}
                className="glass px-6 py-4 text-center"
                style={{ borderColor: `${net.color}44` }}
              >
                <p className="font-bold" style={{ color: net.color }}>{net.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-accent p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para automatizar sua imobiliária?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Junte-se às imobiliárias que estão captando mais leads com menos esforço.
          </p>
          <Link
            href="/signup"
            className="gradient-button px-10 py-4 text-white font-bold text-lg inline-block"
          >
            Começar grátis agora →
          </Link>
          <p className="text-zinc-600 text-xs mt-4">
            Plano gratuito disponível. Upgrade quando quiser.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold bg-gradient-to-r from-accent to-accent-pink bg-clip-text text-transparent">
            ImobSmart
          </span>
          <p className="text-zinc-600 text-xs">
            &copy; 2026 ImobSmart — SoftiaHouse. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-zinc-500 text-xs">
            <Link href="/login" className="hover:text-white">Entrar</Link>
            <Link href="/signup" className="hover:text-white">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
