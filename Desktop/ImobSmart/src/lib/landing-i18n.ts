export type Lang = "es" | "pt" | "en";

export const LANG_LABELS: Record<Lang, string> = {
  es: "ES",
  pt: "PT",
  en: "EN",
};

export const LANG_FLAGS: Record<Lang, string> = {
  es: "🇪🇸",
  pt: "🇧🇷",
  en: "🇬🇧",
};

interface LandingTexts {
  nav: { login: string; cta: string };
  hero: {
    badge: string;
    h1_1: string;
    h1_highlight: string;
    h1_2: string;
    subtitle: string;
    cta: string;
    secondary: string;
    note: string;
  };
  stats: { networks: string; agent: string; publish: string; start: string };
  features: {
    title: string;
    subtitle: string;
    items: { icon: string; title: string; desc: string }[];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { num: string; title: string; desc: string }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    cta: string;
    ctaPro: string;
    popular: string;
    plans: { name: string; price: string; priceNote: string; features: string[]; highlighted?: boolean }[];
  };
  networks: { title: string; subtitle: string };
  cta: { title: string; subtitle: string; button: string; note: string };
  footer: { rights: string; login: string; signup: string };
}

const es: LandingTexts = {
  nav: { login: "Entrar", cta: "Empieza gratis" },
  hero: {
    badge: "Plataforma SaaS para inmobiliarias inteligentes",
    h1_1: "Publica inmuebles.",
    h1_highlight: "Capta leads.",
    h1_2: "Cierra negocios.",
    subtitle:
      "Automatiza la publicación de inmuebles en redes sociales, atiende leads con IA 24/7 y gestiona todo el embudo de ventas en un solo lugar.",
    cta: "Crear cuenta gratis →",
    secondary: "Ver funcionalidades",
    note: "Sin tarjeta de crédito. Configura en minutos.",
  },
  stats: {
    networks: "Redes sociales",
    agent: "Agente IA activo",
    publish: "Para publicar",
    start: "Para empezar",
  },
  features: {
    title: "Todo lo que tu inmobiliaria necesita",
    subtitle: "Del registro del inmueble al cierre del negocio, todo automatizado.",
    items: [
      {
        icon: "🏠",
        title: "Registro de Inmuebles",
        desc: "Añade inmuebles con fotos, detalles y precio. Publicación automática en redes sociales con un clic.",
      },
      {
        icon: "📱",
        title: "Autopublicación Social",
        desc: "Publica automáticamente en Instagram, Facebook, TikTok y Google Ads. Sin esfuerzo manual.",
      },
      {
        icon: "🤖",
        title: "Agente IA 24/7",
        desc: "Atiende leads por WhatsApp y Webchat con IA que cualifica, agenda visitas y nunca duerme.",
      },
      {
        icon: "📊",
        title: "CRM Kanban",
        desc: "Gestiona leads con pipeline visual: nuevo → contactado → visita → propuesta → cerrado.",
      },
      {
        icon: "🔍",
        title: "Prospección B2B",
        desc: "Encuentra inmobiliarias por ciudad. Clasifica por presencia digital. Importa listas CSV.",
      },
      {
        icon: "📈",
        title: "Dashboard Inteligente",
        desc: "Visión completa: inmuebles publicados, leads calientes, posts de la semana y visitas programadas.",
      },
    ],
  },
  howItWorks: {
    title: "Cómo funciona",
    subtitle: "4 pasos para transformar tu inmobiliaria",
    steps: [
      { num: "1", title: "Crea tu cuenta", desc: "Gratuito, sin tarjeta de crédito. Listo en 30 segundos." },
      { num: "2", title: "Añade inmuebles", desc: "Registra con fotos y detalles. El sistema genera el anuncio." },
      { num: "3", title: "Activa las redes", desc: "Conecta Instagram, Facebook y WhatsApp. Publica con 1 clic." },
      { num: "4", title: "Recibe leads", desc: "El agente IA atiende, cualifica y organiza en el CRM automático." },
    ],
  },
  pricing: {
    title: "Planes y precios",
    subtitle: "Elige el plan perfecto para tu inmobiliaria",
    monthly: "/mes",
    cta: "Empezar gratis",
    ctaPro: "Empezar ahora",
    popular: "Más popular",
    plans: [
      {
        name: "Starter",
        price: "9,90€",
        priceNote: "/mes",
        features: [
          "Hasta 20 inmuebles",
          "1 red social",
          "CRM Kanban",
          "Dashboard básico",
          "Soporte por email",
        ],
      },
      {
        name: "Pro",
        price: "39,90€",
        priceNote: "/mes",
        highlighted: true,
        features: [
          "Hasta 50 inmuebles",
          "4 redes sociales",
          "CRM Kanban + Pipeline",
          "Agente IA WhatsApp 24/7",
          "Autopublicación TikTok",
          "Dashboard inteligente",
          "Soporte prioritario",
        ],
      },
      {
        name: "Turbo",
        price: "59,90€",
        priceNote: "/mes",
        features: [
          "Inmuebles ilimitados",
          "Todas las redes sociales",
          "Agente IA WhatsApp + Webchat",
          "Google Ads integrado",
          "Dominio personalizado",
          "Prospección B2B",
          "Dashboard avanzado",
          "Soporte VIP",
        ],
      },
    ],
  },
  networks: {
    title: "Publica en todas las redes",
    subtitle: "Un inmueble registrado, publicado automáticamente en todas las plataformas.",
  },
  cta: {
    title: "¿Listo para automatizar tu inmobiliaria?",
    subtitle: "Únete a las inmobiliarias que están captando más leads con menos esfuerzo.",
    button: "Empieza gratis ahora →",
    note: "Desde 9,90€/mes. Upgrade cuando quieras.",
  },
  footer: { rights: "Todos los derechos reservados.", login: "Entrar", signup: "Crear cuenta" },
};

const pt: LandingTexts = {
  nav: { login: "Entrar", cta: "Começar grátis" },
  hero: {
    badge: "Plataforma SaaS para imobiliárias inteligentes",
    h1_1: "Publique imóveis.",
    h1_highlight: "Capte leads.",
    h1_2: "Feche negócios.",
    subtitle:
      "Automatize a publicação de imóveis nas redes sociais, atenda leads com IA 24/7 e gerencie todo o funil de vendas num só lugar.",
    cta: "Criar conta grátis →",
    secondary: "Ver funcionalidades",
    note: "Sem cartão de crédito. Configure em minutos.",
  },
  stats: {
    networks: "Redes sociais",
    agent: "Agente IA ativo",
    publish: "Para publicar",
    start: "Para começar",
  },
  features: {
    title: "Tudo que sua imobiliária precisa",
    subtitle: "Do cadastro do imóvel ao fechamento do negócio, tudo automatizado.",
    items: [
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
    ],
  },
  howItWorks: {
    title: "Como funciona",
    subtitle: "4 passos para transformar sua imobiliária",
    steps: [
      { num: "1", title: "Crie sua conta", desc: "Gratuito, sem cartão de crédito. Pronto em 30 segundos." },
      { num: "2", title: "Adicione imóveis", desc: "Cadastre com fotos e detalhes. O sistema gera o anúncio." },
      { num: "3", title: "Ative as redes", desc: "Conecte Instagram, Facebook e WhatsApp. Publique com 1 clique." },
      { num: "4", title: "Receba leads", desc: "O agente IA atende, qualifica e organiza no CRM automático." },
    ],
  },
  pricing: {
    title: "Planos e preços",
    subtitle: "Escolha o plano ideal para sua imobiliária",
    monthly: "/mês",
    cta: "Começar grátis",
    ctaPro: "Começar agora",
    popular: "Mais popular",
    plans: [
      {
        name: "Starter",
        price: "9,90€",
        priceNote: "/mês",
        features: [
          "Até 20 imóveis",
          "1 rede social",
          "CRM Kanban",
          "Dashboard básico",
          "Suporte por email",
        ],
      },
      {
        name: "Pro",
        price: "39,90€",
        priceNote: "/mês",
        highlighted: true,
        features: [
          "Até 50 imóveis",
          "4 redes sociais",
          "CRM Kanban + Pipeline",
          "Agente IA WhatsApp 24/7",
          "Autopublicação TikTok",
          "Dashboard inteligente",
          "Suporte prioritário",
        ],
      },
      {
        name: "Turbo",
        price: "59,90€",
        priceNote: "/mês",
        features: [
          "Imóveis ilimitados",
          "Todas as redes sociais",
          "Agente IA WhatsApp + Webchat",
          "Google Ads integrado",
          "Domínio personalizado",
          "Prospecção B2B",
          "Dashboard avançado",
          "Suporte VIP",
        ],
      },
    ],
  },
  networks: {
    title: "Publique em todas as redes",
    subtitle: "Um imóvel cadastrado, publicado automaticamente em todas as plataformas.",
  },
  cta: {
    title: "Pronto para automatizar sua imobiliária?",
    subtitle: "Junte-se às imobiliárias que estão captando mais leads com menos esforço.",
    button: "Começar grátis agora →",
    note: "A partir de 9,90€/mês. Upgrade quando quiser.",
  },
  footer: { rights: "Todos os direitos reservados.", login: "Entrar", signup: "Criar conta" },
};

const en: LandingTexts = {
  nav: { login: "Sign in", cta: "Start free" },
  hero: {
    badge: "SaaS platform for smart real estate agencies",
    h1_1: "List properties.",
    h1_highlight: "Capture leads.",
    h1_2: "Close deals.",
    subtitle:
      "Automate property listing on social media, serve leads with 24/7 AI and manage the entire sales funnel in one place.",
    cta: "Create free account →",
    secondary: "See features",
    note: "No credit card required. Set up in minutes.",
  },
  stats: {
    networks: "Social networks",
    agent: "AI agent active",
    publish: "To publish",
    start: "To start",
  },
  features: {
    title: "Everything your agency needs",
    subtitle: "From property listing to deal closing, fully automated.",
    items: [
      {
        icon: "🏠",
        title: "Property Listings",
        desc: "Add properties with photos, details and pricing. Automatic publishing to social media with one click.",
      },
      {
        icon: "📱",
        title: "Social Auto-posting",
        desc: "Publish automatically on Instagram, Facebook, TikTok and Google Ads. Zero manual effort.",
      },
      {
        icon: "🤖",
        title: "24/7 AI Agent",
        desc: "Serve leads via WhatsApp and Webchat with AI that qualifies, schedules visits and never sleeps.",
      },
      {
        icon: "📊",
        title: "CRM Kanban",
        desc: "Manage leads with visual pipeline: new → contacted → visit → proposal → closed.",
      },
      {
        icon: "🔍",
        title: "B2B Prospecting",
        desc: "Find agencies by city. Classify by digital presence. Import CSV lists.",
      },
      {
        icon: "📈",
        title: "Smart Dashboard",
        desc: "Complete overview: listed properties, hot leads, weekly posts and scheduled visits.",
      },
    ],
  },
  howItWorks: {
    title: "How it works",
    subtitle: "4 steps to transform your agency",
    steps: [
      { num: "1", title: "Create your account", desc: "Free, no credit card. Ready in 30 seconds." },
      { num: "2", title: "Add properties", desc: "Register with photos and details. The system generates the ad." },
      { num: "3", title: "Activate networks", desc: "Connect Instagram, Facebook and WhatsApp. Publish with 1 click." },
      { num: "4", title: "Receive leads", desc: "The AI agent serves, qualifies and organizes in the automatic CRM." },
    ],
  },
  pricing: {
    title: "Plans & Pricing",
    subtitle: "Choose the perfect plan for your agency",
    monthly: "/mo",
    cta: "Start free",
    ctaPro: "Get started",
    popular: "Most popular",
    plans: [
      {
        name: "Starter",
        price: "€9.90",
        priceNote: "/mo",
        features: [
          "Up to 20 properties",
          "1 social network",
          "CRM Kanban",
          "Basic dashboard",
          "Email support",
        ],
      },
      {
        name: "Pro",
        price: "€39.90",
        priceNote: "/mo",
        highlighted: true,
        features: [
          "Up to 50 properties",
          "4 social networks",
          "CRM Kanban + Pipeline",
          "WhatsApp AI Agent 24/7",
          "TikTok auto-posting",
          "Smart dashboard",
          "Priority support",
        ],
      },
      {
        name: "Turbo",
        price: "€59.90",
        priceNote: "/mo",
        features: [
          "Unlimited properties",
          "All social networks",
          "AI Agent WhatsApp + Webchat",
          "Google Ads integrated",
          "Custom domain",
          "B2B Prospecting",
          "Advanced dashboard",
          "VIP support",
        ],
      },
    ],
  },
  networks: {
    title: "Publish on every network",
    subtitle: "One property listed, automatically published on every platform.",
  },
  cta: {
    title: "Ready to automate your agency?",
    subtitle: "Join the agencies capturing more leads with less effort.",
    button: "Start free now →",
    note: "Starting at €9.90/mo. Upgrade anytime.",
  },
  footer: { rights: "All rights reserved.", login: "Sign in", signup: "Create account" },
};

export const translations: Record<Lang, LandingTexts> = { es, pt, en };
