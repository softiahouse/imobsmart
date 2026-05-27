// src/pages/LandingPage.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --verde: #1A3A6B;
    --verde-claro: #E8EFF8;
    --verde-suave: #F0F4FF;
    --vermelho: #C8962A;
    --creme: #F7F6F2;
    --texto: #1A1A2E;
    --texto-sec: #4A4A6A;
    --texto-ter: #8A8AA0;
    --borda: #D8DFF0;
    --fonte-titulo: 'DM Serif Display', Georgia, serif;
    --fonte-corpo: 'DM Sans', system-ui, sans-serif;
  }

  .lp-body { font-family: var(--fonte-corpo); background: var(--creme); color: var(--texto); overflow-x: hidden; }

  /* HERO */
  .lp-hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 60px 24px 80px;
    overflow: hidden; background: var(--creme);
  }
  .lp-blob-1 {
    position: absolute; top: -100px; left: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: #e8ede4; opacity: .6;
    animation: lpDrift 14s ease-in-out infinite; pointer-events: none;
  }
  .lp-blob-2 {
    position: absolute; bottom: -120px; right: -80px;
    width: 440px; height: 440px; border-radius: 50%;
    background: #ede8e4; opacity: .5;
    animation: lpDrift2 17s ease-in-out infinite; pointer-events: none;
  }
  @keyframes lpDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(6px,-8px)} }
  @keyframes lpDrift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-5px,7px)} }
  @keyframes lpFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .lp-hero-inner { position: relative; z-index: 1; max-width: 900px; }
  .lp-hero-label {
    font-size: 12px; letter-spacing: .1em; text-transform: uppercase;
    color: var(--texto-ter); margin-bottom: 28px; display: block;
    animation: lpFadeUp .8s ease both;
  }
  .lp-hero-title {
    font-family: var(--fonte-titulo);
    font-size: clamp(72px, 14vw, 140px);
    font-weight: 400; line-height: 1; margin-bottom: 40px;
    animation: lpFadeUp .8s .15s ease both;
  }
  .lp-pare { color: var(--vermelho); }
  .lp-viva { color: var(--verde); }

  .lp-circles {
    display: flex; justify-content: center;
    gap: 16px; margin-bottom: 40px; flex-wrap: wrap;
    animation: lpFadeUp .8s .3s ease both;
  }
  .lp-circle-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .lp-circle {
    width: 48px; height: 48px; border-radius: 50%;
    border: 1.5px solid #444441;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 500; color: #444441;
    background: transparent; transition: background .25s, color .25s;
    cursor: default;
  }
  .lp-circle:hover { background: var(--verde); color: #fff; border-color: var(--verde); }
  .lp-circle-label { font-size: 10px; color: var(--texto-ter); text-align: center; max-width: 60px; line-height: 1.3; }

  .lp-hero-subtitle {
    font-family: var(--fonte-titulo); font-size: 22px; font-weight: 400;
    color: var(--texto); max-width: 560px; margin: 0 auto 16px;
    animation: lpFadeUp .8s .45s ease both;
  }
  .lp-hero-desc {
    font-size: 15px; color: var(--texto-sec);
    max-width: 480px; margin: 0 auto 40px;
    animation: lpFadeUp .8s .55s ease both;
  }
  .lp-hero-btns {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    animation: lpFadeUp .8s .65s ease both;
  }

  /* BOTÕES */
  .lp-btn-primary {
    background: var(--verde); color: #EAF3DE;
    padding: 13px 28px; border-radius: 8px;
    font-size: 15px; font-weight: 500; border: none; cursor: pointer;
    font-family: var(--fonte-corpo); text-decoration: none;
    transition: opacity .2s; display: inline-block;
  }
  .lp-btn-primary:hover { opacity: .85; }
  .lp-btn-secondary {
    background: transparent; color: var(--texto-sec);
    padding: 13px 28px; border-radius: 8px;
    font-size: 15px; font-weight: 400;
    border: .5px solid #B4B2A9; cursor: pointer;
    font-family: var(--fonte-corpo); text-decoration: none;
    transition: border-color .2s, color .2s; display: inline-block;
  }
  .lp-btn-secondary:hover { border-color: var(--verde); color: var(--verde); }

  /* SEÇÕES */
  .lp-section { padding: 96px 24px; }
  .lp-container { max-width: 960px; margin: 0 auto; }
  .lp-section-label {
    font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--texto-ter); margin-bottom: 16px; display: block;
  }
  .lp-section-title {
    font-family: var(--fonte-titulo);
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 400; line-height: 1.15; margin-bottom: 16px;
  }
  .lp-section-sub { font-size: 17px; color: var(--texto-sec); max-width: 560px; margin-bottom: 56px; }

  /* DOR */
  .lp-dor { background: #fff; }
  .lp-dor-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 20px; margin-bottom: 48px; }
  .lp-dor-card {
    border: 1px solid var(--borda); border-radius: 12px; padding: 28px 24px;
    transition: border-color .2s, transform .2s;
  }
  .lp-dor-card:hover { border-color: var(--vermelho); transform: translateY(-3px); }
  .lp-dor-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--vermelho); margin-bottom: 14px; }
  .lp-dor-card p { font-size: 15px; color: var(--texto-sec); line-height: 1.6; }
  .lp-dor-fechamento {
    font-style: italic; text-align: center; color: var(--texto-sec); font-size: 17px;
    border-top: 1px solid var(--borda); padding-top: 40px;
  }

  /* CREDIBILIDADE */
  .lp-cred { background: var(--creme); }
  .lp-stats-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 24px; margin-bottom: 56px; }
  .lp-stat-card {
    background: #fff; border: 1px solid var(--borda); border-radius: 12px;
    padding: 32px 24px; text-align: center; transition: border-color .2s;
  }
  .lp-stat-card:hover { border-color: var(--verde); }
  .lp-stat-num { font-family: var(--fonte-titulo); font-size: 36px; color: var(--verde); line-height: 1.1; margin-bottom: 8px; }
  .lp-stat-desc { font-size: 13px; color: var(--texto-sec); line-height: 1.5; }
  .lp-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .lp-badge {
    border: 1px solid var(--borda); border-radius: 20px; padding: 7px 16px;
    font-size: 13px; color: var(--texto-sec); background: #fff;
    transition: background .2s, border-color .2s;
  }
  .lp-badge:hover { background: var(--verde-claro); border-color: var(--verde); }

  /* MÉTODO */
  .lp-metodo { background: #fff; }
  .lp-metodo-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 20px; }
  .lp-metodo-card {
    border: 1px solid var(--borda); border-radius: 12px; padding: 32px 20px;
    text-align: center; transition: transform .2s, border-color .2s;
  }
  .lp-metodo-card:hover { transform: translateY(-4px); border-color: var(--verde); }
  .lp-metodo-letra {
    width: 52px; height: 52px; border-radius: 50%;
    border: 1.5px solid var(--verde);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--fonte-titulo); font-size: 22px; color: var(--verde);
    margin: 0 auto 16px;
  }
  .lp-metodo-nome { font-size: 13px; font-weight: 500; color: var(--texto); margin-bottom: 8px; text-transform: uppercase; letter-spacing: .06em; }
  .lp-metodo-desc { font-size: 13px; color: var(--texto-sec); line-height: 1.6; }

  /* DEPOIMENTOS */
  .lp-depo { background: var(--verde-suave); }
  .lp-depo-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 20px; margin-bottom: 32px; }
  .lp-depo-card { background: #fff; border: 1px solid #C8CCDC; border-radius: 12px; padding: 32px 24px; position: relative; }
  .lp-depo-quote {
    font-family: var(--fonte-titulo); font-size: 56px; color: var(--verde-claro);
    position: absolute; top: 12px; left: 20px; line-height: 1;
  }
  .lp-depo-card p { font-style: italic; font-size: 15px; color: var(--texto-sec); line-height: 1.7; padding-top: 24px; }
  .lp-depo-nota { font-size: 12px; color: var(--texto-ter); text-align: center; font-style: italic; }

  /* PROGRAMA */
  .lp-programa { background: var(--creme); }
  .lp-modulos-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 20px; margin-bottom: 48px; }
  .lp-modulo-card {
    background: #fff; border: 1px solid var(--borda); border-radius: 12px;
    padding: 28px 24px; display: flex; flex-direction: column;
    transition: border-color .2s, transform .2s;
  }
  .lp-modulo-card:hover { border-color: var(--verde); transform: translateY(-3px); }
  .lp-modulo-num { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--texto-ter); margin-bottom: 8px; }
  .lp-modulo-nome { font-family: var(--fonte-titulo); font-size: 22px; color: var(--texto); margin-bottom: 12px; }
  .lp-modulo-desc { font-size: 14px; color: var(--texto-sec); line-height: 1.6; flex: 1; margin-bottom: 20px; }
  .lp-modulo-info { font-size: 12px; color: var(--texto-ter); margin-bottom: 16px; }
  .lp-ferramentas { border-top: 1px solid var(--borda); padding-top: 40px; }
  .lp-ferramentas-titulo { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--texto-ter); margin-bottom: 20px; }
  .lp-ferramenta-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--borda);
    font-size: 15px; color: var(--texto-sec);
  }
  .lp-ferramenta-item::before { content: '✓'; color: var(--verde); font-weight: 600; flex-shrink: 0; }

  /* FAMILIARES */
  .lp-familiares { background: #fff; }
  .lp-familiares-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .lp-familiares-texto p { font-size: 16px; color: var(--texto-sec); margin-bottom: 16px; line-height: 1.7; }
  .lp-familiares-lista { list-style: none; margin: 24px 0; padding: 0; }
  .lp-familiares-lista li {
    padding: 10px 0; border-bottom: 1px solid var(--borda);
    font-size: 14px; color: var(--texto-sec);
    display: flex; align-items: flex-start; gap: 10px;
  }
  .lp-familiares-lista li::before { content: '→'; color: var(--verde); flex-shrink: 0; }
  .lp-familiares-form {
    background: var(--verde-suave); border: 1px solid #C8CCDC;
    border-radius: 16px; padding: 40px 32px;
  }
  .lp-familiares-form h3 { font-family: var(--fonte-titulo); font-size: 24px; font-weight: 400; margin-bottom: 8px; }
  .lp-familiares-form p { font-size: 14px; color: var(--texto-sec); margin-bottom: 24px; }

  /* FAQ */
  .lp-faq { background: var(--creme); }
  .lp-faq-list { max-width: 720px; }
  .lp-faq-item { border-bottom: 1px solid var(--borda); padding: 20px 0; }
  .lp-faq-pergunta {
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; font-size: 16px; font-weight: 500; color: var(--texto);
    gap: 16px; background: none; border: none; text-align: left;
    width: 100%; font-family: var(--fonte-corpo); padding: 0;
  }
  .lp-faq-icon {
    flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
    border: 1px solid var(--borda);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: var(--texto-ter);
    transition: transform .3s, background .2s;
  }
  .lp-faq-icon.open { transform: rotate(45deg); background: var(--verde-claro); }
  .lp-faq-resposta {
    font-size: 15px; color: var(--texto-sec); line-height: 1.7;
    overflow: hidden; max-height: 0; transition: max-height .35s ease, padding .3s;
  }
  .lp-faq-resposta.open { max-height: 300px; padding-top: 14px; }

  /* CTA FINAL */
  .lp-cta-final { background: var(--verde); color: #EAF3DE; text-align: center; padding: 96px 24px; }
  .lp-cta-final .lp-section-label { color: rgba(234,243,222,.6); }
  .lp-cta-final .lp-section-title { color: #EAF3DE; max-width: 640px; margin: 0 auto 16px; }
  .lp-cta-final p { font-size: 17px; color: rgba(234,243,222,.8); max-width: 480px; margin: 0 auto 40px; }
  .lp-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .lp-btn-light {
    background: #EAF3DE; color: var(--verde);
    padding: 14px 32px; border-radius: 8px;
    font-size: 15px; font-weight: 500; border: none; cursor: pointer;
    font-family: var(--fonte-corpo); text-decoration: none;
    transition: opacity .2s; display: inline-block;
  }
  .lp-btn-light:hover { opacity: .88; }
  .lp-btn-outline-light {
    background: transparent; color: rgba(234,243,222,.85);
    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 400;
    border: 1px solid rgba(234,243,222,.4); cursor: pointer;
    font-family: var(--fonte-corpo); text-decoration: none;
    transition: border-color .2s, color .2s; display: inline-block;
  }
  .lp-btn-outline-light:hover { border-color: #EAF3DE; color: #EAF3DE; }

  /* FOOTER */
  .lp-footer { background: var(--texto); color: rgba(255,255,255,.5); padding: 56px 24px 32px; }
  .lp-footer-inner {
    max-width: 960px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 48px; margin-bottom: 48px;
  }
  .lp-footer-brand p { font-size: 13px; line-height: 1.7; max-width: 300px; margin-top: 12px; }
  .lp-footer-logo { font-size: 12px; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.8); }
  .lp-footer-logo span { color: #C8962A; }
  .lp-footer-col h4 { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6); margin-bottom: 16px; }
  .lp-footer-col a { display: block; font-size: 13px; color: rgba(255,255,255,.4); text-decoration: none; margin-bottom: 10px; transition: color .2s; }
  .lp-footer-col a:hover { color: rgba(255,255,255,.8); }
  .lp-footer-bottom {
    max-width: 960px; margin: 0 auto;
    border-top: 1px solid rgba(255,255,255,.08); padding-top: 24px;
    display: flex; justify-content: space-between; flex-wrap: wrap;
    gap: 8px; font-size: 12px; color: rgba(255,255,255,.3);
  }

  /* HERO COM SIDEBAR (POSTS DO BLOG) */
  .lp-hero-grid {
    position: relative; z-index: 1;
    width: 100%; max-width: 1320px;
    display: flex; flex-direction: column;
    align-items: center; gap: 40px;
  }
  @media (min-width: 1024px) {
    .lp-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      align-items: center; gap: 64px;
    }
    .lp-hero-grid > .lp-hero-inner { justify-self: center; }
  }

  .lp-hero-sidebar {
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid var(--borda);
    border-radius: 16px;
    padding: 20px 20px 14px;
    animation: lpFadeUp .8s .8s ease both;
  }
  @media (min-width: 1024px) {
    .lp-hero-sidebar { max-width: none; width: 280px; }
  }
  .lp-hero-sidebar-header {
    font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--verde);
    font-weight: 600; margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .lp-hero-sidebar-post {
    display: block; padding: 12px 0;
    border-bottom: 1px solid var(--borda);
    text-decoration: none; color: inherit;
    transition: opacity .2s;
  }
  .lp-hero-sidebar-post:hover { opacity: .65; }
  .lp-hero-sidebar-post-cat {
    font-size: 10px; letter-spacing: .08em;
    text-transform: uppercase; color: var(--verde);
    font-weight: 600; margin-bottom: 4px;
  }
  .lp-hero-sidebar-post-title {
    font-family: var(--fonte-titulo);
    font-size: 15px; color: var(--texto);
    line-height: 1.3; margin: 0;
  }
  .lp-hero-sidebar-link {
    display: block; text-align: center;
    margin-top: 12px; padding-top: 12px;
    border-top: 1px solid var(--borda);
    font-size: 12px; font-weight: 600;
    color: var(--verde); text-decoration: none;
    letter-spacing: .04em;
  }

  /* SECCAO BLOG NO FIM */
  .lp-blog-section { background: #fff; }
  .lp-blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px; margin-top: 32px;
  }
  .lp-blog-card {
    background: #fff; border: 1px solid var(--borda);
    border-radius: 16px; overflow: hidden;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    transition: transform .2s, border-color .2s, box-shadow .2s;
  }
  .lp-blog-card:hover {
    transform: translateY(-4px);
    border-color: var(--verde);
    box-shadow: 0 8px 28px rgba(26,58,107,0.08);
  }
  .lp-blog-card-img {
    width: 100%; height: 180px;
    object-fit: cover; background: var(--verde-suave);
    display: block;
  }
  .lp-blog-card-noimg {
    width: 100%; height: 100px;
    background: linear-gradient(135deg, var(--verde-suave), #fff);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; color: var(--verde);
  }
  .lp-blog-card-content {
    padding: 22px 22px 20px; flex: 1;
    display: flex; flex-direction: column;
  }
  .lp-blog-card-cat {
    font-size: 11px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--verde);
    font-weight: 600; margin-bottom: 10px;
  }
  .lp-blog-card-title {
    font-family: var(--fonte-titulo);
    font-size: 21px; color: var(--texto);
    line-height: 1.3; margin-bottom: 10px;
  }
  .lp-blog-card-resumo {
    font-size: 14px; color: var(--texto-sec);
    line-height: 1.6; flex: 1; margin-bottom: 14px;
    display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .lp-blog-card-link {
    font-size: 13px; color: var(--verde); font-weight: 600;
  }
  .lp-blog-section-cta {
    text-align: center; margin-top: 40px;
  }
  .lp-blog-section-cta a {
    display: inline-block; border: 1px solid var(--borda);
    border-radius: 8px; padding: 12px 28px;
    text-decoration: none; color: var(--texto);
    font-size: 14px;
    transition: border-color .2s, color .2s, background .2s;
  }
  .lp-blog-section-cta a:hover {
    border-color: var(--verde); color: var(--verde);
    background: var(--verde-claro);
  }

  @media (max-width: 640px) {
    .lp-familiares-inner { grid-template-columns: 1fr; gap: 40px; }
    .lp-footer-inner { grid-template-columns: 1fr; gap: 32px; }
    .lp-blob-1, .lp-blob-2 { width: 280px; height: 280px; }
    .lp-section { padding: 64px 20px; }
  }
`

const faqs = [
  { p: '¿El programa sustituye el tratamiento psicológico?', r: 'No. El programa es psicoeducativo y complementario. Para casos de dependencia grave, el acompañamiento con un profesional de salud mental es fundamental. El ISTOP puede utilizarse en paralelo al tratamiento.' },
  { p: '¿Necesito comprar todos los módulos de una vez?', r: 'El programa se vende por módulo, de forma secuencial. Cada módulo se adquiere por separado, pero el orden es obligatorio: el Módulo 2 solo puede comprarse tras el Módulo 1, el Módulo 3 tras el 2, y así sucesivamente.' },
  { p: '¿El programa funciona para cualquier tipo de apuesta?', r: 'Sí. El método fue desarrollado para comportamientos compulsivos con apuestas en general — deportes, casinos online, juegos de azar — con especial enfoque en las plataformas digitales.' },
  { p: '¿Cuánto tiempo al día necesito dedicar?', r: 'Cada clase lleva entre 15 y 25 minutos. Las actividades prácticas llevan unos 3 minutos. El programa fue diseñado para ser compatible con la rutina de quien trabaja.' },
  { p: '¿Tengo acceso de por vida tras la compra?', r: 'No. Tras la compra de cada módulo, tienes 120 días para completarlo. El plazo es individual por módulo.' },
]

export default function LandingPage() {
  const [faqAberto, setFaqAberto] = useState(null)
  const navigate = useNavigate();
  const [modulosLiberados, setModulosLiberados] = useState([]);
  const [ultimosPosts, setUltimosPosts] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: lib } = await supabase
        .from("modulos_liberados")
        .select("modulo_id")
        .eq("user_id", data.user.id);
      if (lib) setModulosLiberados(lib.map((r) => r.modulo_id));
    });
  }, []);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, titulo, slug, categoria, resumo, imagem_url")
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setUltimosPosts(data || []));
  }, []);

  const temModulo1 = modulosLiberados.includes(1);
  const coresIstop = ["#FFF8F0", "#F0F7FF", "#F5F0FF", "#F0FFF4", "#FFFBF0"];
  const coresModulos = ["#FFF8F0", "#F0FFF4", "#F0F7FF", "#FFF0F0", "#F5F0FF"];

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="lp-body">
      <style>{css}</style>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-blob-1" />
        <div className="lp-blob-2" />
        <div className="lp-hero-grid">
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title">
            <span className="lp-pare">DEJA</span>{' '}
            <span className="lp-viva">VIVE</span>
          </h1>
          <div className="lp-circles">
            {[
              ['I', 'Interrupción'], ['S', 'Sensibilización'], ['T', 'Transformación'],
              ['O', 'Organización'], ['P', 'Prevención'],
            ].map(([l, n]) => (
              <div key={l} className="lp-circle-wrap">
                <div className="lp-circle">{l}</div>
                <span className="lp-circle-label">{n}</span>
              </div>
            ))}
          </div>
          <p className="lp-hero-subtitle">"Cuando el juego deja de ser diversión y empieza a controlar tu vida."</p>
          <p className="lp-hero-desc">Un camino para dejar de apostar, elaborar tus pérdidas y reconstruir tu vida — con base científica y acompañamiento real.</p>
          <div className="lp-hero-btns">
            <Link to="/quiz" className="lp-btn-primary">Test para Jugador</Link>
            <Link to="/quiz/familias" className="lp-btn-secondary">Test para Familiar</Link>
          </div>
          {/* Botão CTA principal */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button
              onClick={() => navigate(temModulo1 ? "/painel" : "/cadastrar")}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                padding: "1rem 0",
                width: "100%",
                maxWidth: 520,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: temModulo1 ? "#C0392B" : "#5BA4CF",
                color: "#fff",
                letterSpacing: "0.01em",
                boxShadow: temModulo1
                  ? "0 4px 18px rgba(192,57,43,0.18)"
                  : "0 4px 18px rgba(91,164,207,0.18)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {temModulo1 ? "Continúa tu camino →" : "Inicia tu camino →"}
            </button>
          </div>
        </div>
        {ultimosPosts.length > 0 && (
          <aside className="lp-hero-sidebar">
            <div className="lp-hero-sidebar-header">
              <span>📰</span>
              <span>Últimas del blog</span>
            </div>
            {ultimosPosts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="lp-hero-sidebar-post">
                <div className="lp-hero-sidebar-post-cat">{p.categoria}</div>
                <h3 className="lp-hero-sidebar-post-title">{p.titulo}</h3>
              </Link>
            ))}
            <Link to="/blog" className="lp-hero-sidebar-link">
              Ver todos los artículos →
            </Link>
          </aside>
        )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.3rem",
            animation: "bounceDown 1.8s ease-in-out infinite",
            cursor: "pointer",
            opacity: 0.6,
          }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span style={{ fontSize: "0.7rem", color: "#1A3A6B", fontFamily: "DM Sans, sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Ver más
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="#1A3A6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <style>{`
          @keyframes bounceDown {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
        `}</style>
      </section>

      {/* ESPELHO DA DOR */}
      <section className="lp-section lp-dor">
        <div className="lp-container">
          <span className="lp-section-label">¿Te reconoces?</span>
          <h2 className="lp-section-title">El juego prometió algo que no entregó.</h2>
          <p className="lp-section-sub">Millones de personas viven este ciclo en silencio. No estás solo.</p>
          <div className="lp-dor-grid">
            {[
              '"Solo una ronda más para recuperar lo que perdí."',
              '"Juego por diversión, pero a veces paso horas sin darme cuenta."',
              '"Ya he mentido a mi familia sobre cuánto gasté."',
              '"Cuando gano, lo reinvierto todo. Cuando pierdo, doblo la apuesta."',
              '"Pienso en apuestas incluso cuando estoy trabajando."',
              '"He intentado parar varias veces. Pero siempre vuelvo."',
            ].map((t, i) => (
              <div key={i} className="lp-dor-card">
                <div className="lp-dor-dot" />
                <p>{t}</p>
              </div>
            ))}
          </div>
          <p className="lp-dor-fechamento">Estos pensamientos no son debilidad. Son señales de un ciclo que puede interrumpirse.</p>
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section className="lp-section lp-cred">
        <div className="lp-container">
          <span className="lp-section-label">Por qué el ISTOP funciona</span>
          <h2 className="lp-section-title">Base científica.<br />Acompañamiento real.</h2>
          <p className="lp-section-sub">El método ISTOP fue desarrollado con base en evidencias de psicología conductual y neurociencia aplicada a la dependencia.</p>
          <div className="lp-stats-grid">
            {[
              ['85%', 'de los apostadores compulsivos nunca buscan ayuda por no saber por dónde empezar'],
              ['6 de 10', 'personas que completan programas psicoeducativos reducen o cesan el comportamiento'],
              ['15 min', 'es el tiempo promedio que dura un impulso intenso — si no actúas sobre él'],
            ].map(([n, d], i) => (
              <div key={i} className="lp-stat-card">
                <div className="lp-stat-num">{n}</div>
                <div className="lp-stat-desc">{d}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--texto-ter)', marginBottom: 20 }}>
            Fundamentos del método
          </div>
          <div className="lp-badges">
            {['Terapia Cognitivo-Conductual', 'Neurociencia de la Dependencia', 'Prevención de Recaída', 'Regulación Emocional', 'Psicoeducación'].map(b => (
              <span key={b} className="lp-badge">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="lp-section lp-metodo" id="metodo">
        <div className="lp-container">
          <span className="lp-section-label">El método</span>
          <h2 className="lp-section-title">Cinco etapas. Una dirección.</h2>
          <p className="lp-section-sub" style={{ marginBottom: 48 }}>Cada letra del ISTOP representa una etapa real de transformación — no una promesa vaga.</p>
          <div className="lp-metodo-grid">
            {[
              ['I', 'Interrupción', 'Reconocer el ciclo y dar el primer paso consciente para salir del piloto automático.'],
              ['S', 'Sensibilización', 'Identificar desencadenantes emocionales, situacionales y relacionales que alimentan el impulso.'],
              ['T', 'Transformación', 'Desarrollar herramientas de autorregulación y crear espacio entre el desencadenante y la acción.'],
              ['O', 'Organización', 'Reorganizar la rutina, los hábitos y el entorno para sostener el cambio.'],
              ['P', 'Prevención', 'Consolidar lo aprendido y construir sistemas de protección duraderos.'],
            ].map(([l, n, d], i) => (
              <div key={l} className="lp-metodo-card" style={{ background: coresIstop[i % coresIstop.length] }}>
                <div className="lp-metodo-letra">{l}</div>
                <div className="lp-metodo-nome">{n}</div>
                <div className="lp-metodo-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="lp-section lp-depo">
        <div className="lp-container">
          <span className="lp-section-label">Historias</span>
          <h2 className="lp-section-title">De quienes reconocieron el problema</h2>
          <div className="lp-depo-grid">
            {[
              'Empecé apostando por diversión, pero pronto estaba usando el dinero del alquiler intentando recuperar pérdidas.',
              'El juego se convirtió en una forma de escapar del estrés. Cuando me di cuenta, estaba gastando parte de mi sueldo.',
              'Después del divorcio empecé a apostar a escondidas por las noches. Solo noté el problema cuando llegaron las deudas.',
              'Creía que la suerte iba a cambiar. Pero en realidad estaba atrapado en el ciclo del juego.',
            ].map((t, i) => (
              <div key={i} className="lp-depo-card">
                <span className="lp-depo-quote">"</span>
                <p>{t}</p>
              </div>
            ))}
          </div>
          <p className="lp-depo-nota">Historias basadas en casos reales descritos en el libro <em>Juegos Online — Adicción de Bolsillo</em>.</p>
        </div>
      </section>

      {/* PROGRAMA */}
      <section className="lp-section lp-programa" id="programa">
        <div className="lp-container">
          <span className="lp-section-label">El programa</span>
          <h2 className="lp-section-title">Cinco etapas.</h2>
          <p className="lp-section-sub">Un camino de transformación real — a tu ritmo, en tu tiempo.</p>
          <div className="lp-modulos-grid">
            {[
              { n: 1, nome: 'Interrupción', desc: 'Empiezas entendiendo cómo se instala el ciclo del juego — y das el primer paso para salir del piloto automático.', info: '3 clases · Contrato de Interrupción' },
              { n: 2, nome: 'Sensibilización', desc: 'Identificas qué activa el impulso: emociones, pensamientos, ambientes. El comportamiento adquiere nombre — y pierde fuerza.', info: '5 clases · Mapa de Desencadenantes ISTOP' },
              { n: 3, nome: 'Autorregulación', desc: 'Aprendes a crear una pausa entre el desencadenante y la acción. Aquí comienza el control real — construido por ti, para ti.', info: '5 clases · Plan Personal de Manejo' },
              { n: 4, nome: 'Reorganización', desc: 'Los hábitos antiguos son sustituidos por nuevos patrones. Reconstruyes tu rutina con comportamientos que refuerzan el cambio.', info: '5 clases · Estructura de Rutina' },
              { n: 5, nome: 'Mantenimiento del Cambio y Prevención de Recaídas', desc: 'Consolida los cambios iniciados y desarrolla estrategias para reducir el riesgo de recaída a lo largo del tiempo.', info: '5 clases · Protocolo de Prevención de Recaída · Certificado' },
            ].map((m, i) => (
              <div key={m.n} className="lp-modulo-card" style={{ background: coresModulos[i % coresModulos.length] }}>
                <div className="lp-modulo-num">Módulo {m.n}</div>
                <div className="lp-modulo-nome">{m.nome}</div>
                <div className="lp-modulo-desc">{m.desc}</div>
                <div className="lp-modulo-info">{m.info}</div>
              </div>
            ))}
          </div>
          <div className="lp-ferramentas">
            <div className="lp-ferramentas-titulo">Herramientas incluidas en el programa</div>
            {['Mapa de Desencadenantes ISTOP', 'Plan Personal de Manejo del Impulso', 'Protocolo de Prevención de Recaída', 'Certificado de Finalización'].map(f => (
              <div key={f} className="lp-ferramenta-item">{f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section lp-faq">
        <div className="lp-container">
          <span className="lp-section-label">Preguntas frecuentes</span>
          <h2 className="lp-section-title" style={{ marginBottom: 48 }}>Preguntas frecuentes</h2>
          <div className="lp-faq-list">
            {faqs.map((f, i) => (
              <div key={i} className="lp-faq-item">
                <button type="button" className="lp-faq-pergunta" onClick={() => setFaqAberto(faqAberto === i ? null : i)}>
                  {f.p}
                  <span className={`lp-faq-icon${faqAberto === i ? ' open' : ''}`}>+</span>
                </button>
                <div className={`lp-faq-resposta${faqAberto === i ? ' open' : ''}`}>{f.r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG — POSTS EM DESTAQUE */}
      {ultimosPosts.length > 0 && (
        <section className="lp-section lp-blog-section">
          <div className="lp-container">
            <span className="lp-section-label">Recursos gratuitos</span>
            <h2 className="lp-section-title">Del blog</h2>
            <p className="lp-section-sub">
              Artículos basados en evidencia para quienes quieren entender el ciclo del juego — lectura gratis, sin registro.
            </p>
            <div className="lp-blog-grid">
              {ultimosPosts.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="lp-blog-card">
                  {p.imagem_url ? (
                    <img src={p.imagem_url} alt={p.titulo} className="lp-blog-card-img" />
                  ) : (
                    <div className="lp-blog-card-noimg">📰</div>
                  )}
                  <div className="lp-blog-card-content">
                    <div className="lp-blog-card-cat">{p.categoria}</div>
                    <h3 className="lp-blog-card-title">{p.titulo}</h3>
                    {p.resumo && <p className="lp-blog-card-resumo">{p.resumo}</p>}
                    <span className="lp-blog-card-link">Leer artículo →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="lp-blog-section-cta">
              <Link to="/blog">Ver todos los artículos →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="lp-cta-final">
        <span className="lp-section-label">Empieza ahora</span>
        <h2 className="lp-section-title">El primer paso no tiene que ser grande.</h2>
        <p>Empieza por el Módulo 1. Entiende cómo funciona el ciclo. Da el primer paso.</p>
        <div className="lp-cta-btns">
          <Link to="/quiz" className="lp-btn-light">Test para Jugador</Link>
          <Link to="/quiz/familias" className="lp-btn-outline-light">Test para Familiar</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">Instituto <span>ISTOP</span> España</div>
            <p>Plataforma científica de salud mental enfocada en la prevención y el tratamiento de la adicción a las apuestas online.</p>
          </div>
          <div className="lp-footer-col">
            <h4>Programa</h4>
            {[
              'Módulo 1 — Interrupción',
              'Módulo 2 — Sensibilización',
              'Módulo 3 — Autorregulación',
              'Módulo 4 — Reorganización',
              'Módulo 5 — Mantenimiento',
            ].map((label) => (
              <button key={label} type="button" onClick={() => scrollTo('programa')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 10, fontFamily: 'inherit', padding: 0, textAlign: 'left' }}>
                {label}
              </button>
            ))}
          </div>
          <div className="lp-footer-col">
            <h4>Instituto</h4>
            <button type="button" onClick={() => scrollTo('metodo')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 10, fontFamily: 'inherit', padding: 0, textAlign: 'left' }}>Sobre el método</button>
            <button type="button" onClick={() => scrollTo('familiares')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 10, fontFamily: 'inherit', padding: 0, textAlign: 'left' }}>Para familiares</button>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2025 Instituto ISTOP España. Todos los derechos reservados.</span>
          <span>Método ISTOP — Instituto ISTOP España</span>
        </div>
      </footer>
    </div>
  )
}
