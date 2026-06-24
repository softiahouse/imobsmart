'use client';

import { useEffect, useState } from 'react';

const LAUNCH = new Date('2026-08-11T09:00:00');
const WA = 'https://wa.me/34621661700';

function useCountdown() {
  const [t, setT] = useState({ d: '00', h: '00', m: '00', s: '00' });
  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH.getTime() - Date.now();
      if (diff <= 0) return;
      const p = (n: number) => String(n).padStart(2, '0');
      setT({
        d: p(Math.floor(diff / 86400000)),
        h: p(Math.floor((diff % 86400000) / 3600000)),
        m: p(Math.floor((diff % 3600000) / 60000)),
        s: p(Math.floor((diff % 60000) / 1000)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function EscuelaPage() {
  const { d, h, m, s } = useCountdown();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{--gold:#C9A84C;--gold-l:#E8C97A;--green:#1B4332;--dark:#0a0a0a;--glass:rgba(255,255,255,0.07);--gb:rgba(255,255,255,0.12);}
        html{scroll-behavior:smooth;}
        body{font-family:'Jost',sans-serif;background:var(--dark);color:#fff;overflow-x:hidden;}
        .esc-nav{position:fixed;top:0;width:100%;z-index:100;padding:20px 48px;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(10,10,10,0.5);border-bottom:1px solid rgba(255,255,255,0.06);}
        .esc-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;letter-spacing:4px;color:#fff;text-decoration:none;}
        .esc-logo span{color:var(--gold);}
        .nav-cta{background:var(--gold);color:#fff;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:12px 28px;text-decoration:none;border-radius:2px;transition:background .3s;}
        .nav-cta:hover{background:var(--gold-l);}
        .hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:140px 24px 80px;overflow:hidden;}
        .hero-bg{position:absolute;inset:0;background:url('/fotos/hero.jpg') center/cover no-repeat;animation:slowzoom 20s ease-in-out infinite alternate;}
        @keyframes slowzoom{from{transform:scale(1.05);}to{transform:scale(1.12);}}
        .hero-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.55) 0%,rgba(27,67,50,.45) 50%,rgba(10,10,10,.85) 100%);}
        .hero-c{position:relative;z-index:2;max-width:820px;}
        .pill{display:inline-block;font-size:9px;letter-spacing:6px;text-transform:uppercase;color:var(--gold-l);margin-bottom:24px;padding:8px 20px;border:1px solid rgba(201,168,76,.3);border-radius:50px;backdrop-filter:blur(10px);background:rgba(201,168,76,.08);}
        .hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(3.5rem,9vw,7rem);font-weight:300;line-height:1;letter-spacing:-1px;margin-bottom:8px;}
        .hero h1 em{color:var(--gold);font-style:italic;display:block;}
        .hero-sub{font-size:clamp(.85rem,1.8vw,1rem);color:rgba(255,255,255,.65);font-weight:300;max-width:480px;margin:28px auto 48px;line-height:1.8;}
        .cd-card{display:inline-flex;margin-bottom:48px;background:var(--glass);border:1px solid var(--gb);border-radius:20px;overflow:hidden;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);}
        .cd-b{padding:24px 28px;text-align:center;position:relative;}
        .cd-b:not(:last-child)::after{content:':';position:absolute;right:-4px;top:50%;transform:translateY(-60%);color:var(--gold);opacity:.6;font-size:1.4rem;}
        .cd-n{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);color:var(--gold);line-height:1;font-weight:300;}
        .cd-l{font-size:8px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:4px;}
        .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .btn-p{display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:#fff;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:18px 36px;text-decoration:none;border-radius:4px;transition:all .3s;font-family:'Jost',sans-serif;}
        .btn-p:hover{background:var(--gold-l);transform:translateY(-2px);}
        .btn-g{display:inline-flex;align-items:center;gap:10px;background:var(--glass);border:1px solid var(--gb);color:#fff;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:18px 36px;text-decoration:none;border-radius:4px;backdrop-filter:blur(12px);transition:all .3s;}
        .btn-g:hover{background:rgba(255,255,255,.12);transform:translateY(-2px);}
        .scroll-h{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);z-index:2;text-align:center;}
        .scroll-h span{display:block;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;}
        .scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(201,168,76,.6),transparent);margin:0 auto;animation:sa 2s ease-in-out infinite;}
        @keyframes sa{0%,100%{opacity:.3;}50%{opacity:1;}}
        .strip{background:var(--green);padding:16px 40px;display:flex;justify-content:center;align-items:center;gap:48px;flex-wrap:wrap;}
        .strip-i{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:8px;}
        .dot{width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0;}
        .sec{padding:110px 24px;}
        .sec-in{max-width:1200px;margin:0 auto;}
        .lbl{font-size:9px;letter-spacing:5px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
        .ttl{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,4vw,3.8rem);font-weight:300;line-height:1.15;margin-bottom:20px;}
        .ttl em{font-style:italic;color:var(--gold);}
        .dvd{width:48px;height:1px;background:var(--gold);margin-bottom:60px;}
        .pq{position:relative;padding:110px 24px;overflow:hidden;}
        .pq-bg{position:absolute;inset:0;background:url('/fotos/recepcao.jpg') center/cover no-repeat;}
        .pq-ov{position:absolute;inset:0;background:rgba(10,10,10,.82);}
        .pq-c{position:relative;z-index:2;max-width:1200px;margin:0 auto;}
        .pq-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:60px;}
        .card{background:var(--glass);border:1px solid var(--gb);border-radius:20px;padding:36px 28px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:all .3s;}
        .card:hover{background:rgba(255,255,255,.1);transform:translateY(-4px);border-color:rgba(201,168,76,.3);}
        .c-icon{font-size:2rem;margin-bottom:16px;}
        .c-title{font-size:15px;font-weight:500;margin-bottom:8px;}
        .c-desc{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;}
        .mod-sec{background:#0e0e0e;padding:110px 24px;}
        .mod-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-top:60px;}
        .mod{background:var(--glass);border:1px solid var(--gb);border-radius:20px;padding:40px 36px;backdrop-filter:blur(16px);transition:all .3s;position:relative;overflow:hidden;}
        .mod::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .3s;}
        .mod:hover{transform:translateY(-4px);border-color:rgba(201,168,76,.25);}
        .mod:hover::before{opacity:1;}
        .mod-n{font-family:'Cormorant Garamond',serif;font-size:4rem;color:rgba(201,168,76,.15);line-height:1;margin-bottom:12px;}
        .mod-t{font-size:16px;font-weight:500;margin-bottom:10px;}
        .mod-d{font-size:13px;color:rgba(255,255,255,.45);line-height:1.7;}
        .nat{position:relative;padding:110px 24px;overflow:hidden;}
        .nat-bg{position:absolute;inset:0;background:url('/fotos/sala-consulta.jpg') center/cover no-repeat;}
        .nat-ov{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,10,10,.9) 0%,rgba(27,67,50,.75) 100%);}
        .nat-in{position:relative;z-index:2;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1.2fr;gap:80px;align-items:center;}
        .nat-img{width:100%;border-radius:24px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);}
        .nat-img img{width:100%;display:block;aspect-ratio:3/4;object-fit:cover;object-position:top;}
        .stats{display:flex;gap:16px;margin:36px 0;flex-wrap:wrap;}
        .stat{background:var(--glass);border:1px solid var(--gb);border-radius:16px;padding:20px 24px;backdrop-filter:blur(12px);text-align:center;}
        .stat-n{font-family:'Cormorant Garamond',serif;font-size:2.8rem;color:var(--gold);line-height:1;}
        .stat-l{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:4px;}
        .bio{font-size:14px;color:rgba(255,255,255,.65);line-height:1.9;margin-bottom:16px;}
        .gal{padding:110px 24px;background:var(--dark);}
        .gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:60px;}
        .gal-i{border-radius:16px;overflow:hidden;aspect-ratio:4/3;}
        .gal-i img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease;display:block;}
        .gal-i:hover img{transform:scale(1.06);}
        .gal-i:first-child{grid-column:span 2;aspect-ratio:16/9;}
        .price{position:relative;padding:110px 24px;overflow:hidden;text-align:center;}
        .price-bg{position:absolute;inset:0;background:url('/fotos/sala-tratamento-1.jpg') center/cover no-repeat;}
        .price-ov{position:absolute;inset:0;background:rgba(10,10,10,.88);}
        .price-c{position:relative;z-index:2;max-width:640px;margin:0 auto;}
        .price-box{background:var(--glass);border:1px solid var(--gb);border-radius:28px;padding:60px 50px;margin-top:60px;backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);}
        .badge{display:inline-block;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);color:var(--gold);font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:6px 18px;border-radius:50px;margin-bottom:24px;}
        .price-amt{font-family:'Cormorant Garamond',serif;font-size:6rem;line-height:1;margin-bottom:8px;}
        .price-amt sup{font-size:2.5rem;vertical-align:super;color:var(--gold);}
        .price-note{font-size:12px;color:rgba(255,255,255,.4);margin-bottom:40px;letter-spacing:1px;}
        .inc{text-align:left;margin-bottom:40px;}
        .inc li{font-size:13px;color:rgba(255,255,255,.7);padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05);list-style:none;display:flex;align-items:center;gap:14px;}
        .inc li:last-child{border-bottom:none;}
        .inc li::before{content:'✓';color:var(--gold);font-weight:500;flex-shrink:0;}
        .btn-wa{display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:20px 40px;text-decoration:none;border-radius:12px;transition:all .3s;font-family:'Jost',sans-serif;}
        .btn-wa:hover{background:#1ebe5d;transform:translateY(-2px);}
        footer{background:#060606;padding:60px 40px 40px;border-top:1px solid rgba(255,255,255,.05);text-align:center;}
        .f-logo{font-family:'Cormorant Garamond',serif;font-size:1.8rem;letter-spacing:5px;margin-bottom:16px;}
        .f-logo span{color:var(--gold);}
        footer p{font-size:12px;color:rgba(255,255,255,.25);margin-top:8px;}
        footer a{color:var(--gold);text-decoration:none;}
        @media(max-width:768px){.esc-nav{padding:16px 20px;}.nat-in{grid-template-columns:1fr;gap:40px;}.gal-grid{grid-template-columns:1fr 1fr;}.gal-i:first-child{grid-column:span 2;}.strip{gap:20px;padding:16px 20px;}.cd-b{padding:18px 16px;}.price-box{padding:40px 24px;}.stats{gap:12px;}}
      `}</style>

      {/* NAV */}
      <nav className="esc-nav">
        <a href="/escuela" className="esc-logo">N<span>K</span> Escola</a>
        <a href={`${WA}?text=${encodeURIComponent('Hola! Quiero reservar mi plaza en Lábios con Arte')}`} className="nav-cta" target="_blank" rel="noopener noreferrer">Reservar plaza</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-ov" />
        <div className="hero-c">
          <div className="pill">Formación exclusiva · 11 Agosto 2026 · Torrevieja</div>
          <h1>Lábios<em>con Arte</em></h1>
          <p className="hero-sub">Curso avanzado de relleno labial para profesionales de la salud. Técnica, seguridad y resultados naturales.</p>
          <div className="cd-card">
            <div className="cd-b"><div className="cd-n">{d}</div><div className="cd-l">Días</div></div>
            <div className="cd-b"><div className="cd-n">{h}</div><div className="cd-l">Horas</div></div>
            <div className="cd-b"><div className="cd-n">{m}</div><div className="cd-l">Min</div></div>
            <div className="cd-b"><div className="cd-n">{s}</div><div className="cd-l">Seg</div></div>
          </div>
          <div className="btns">
            <a href={`${WA}?text=${encodeURIComponent('Hola! Quiero reservar mi plaza en el curso Lábios con Arte del 11 de agosto')}`} className="btn-p" target="_blank" rel="noopener noreferrer">💬 Quiero mi plaza</a>
            <a href="#modulos" className="btn-g">Ver el programa</a>
          </div>
        </div>
        <div className="scroll-h"><span>Descubre más</span><div className="scroll-line" /></div>
      </section>

      {/* STRIP */}
      <div className="strip">
        {['11 de Agosto 2026','Torrevieja, España','Máx. 10 participantes','Certificado oficial','Acceso online vitalicio'].map(t => (
          <div key={t} className="strip-i"><div className="dot" />{t}</div>
        ))}
      </div>

      {/* PARA QUIEN */}
      <section className="pq">
        <div className="pq-bg" /><div className="pq-ov" />
        <div className="pq-c">
          <p className="lbl">¿Para quién es?</p>
          <h2 className="ttl">Formación exclusiva<br />para <em>profesionales</em></h2>
          <div className="dvd" />
          <div className="pq-grid">
            {[
              { icon: '👩‍⚕️', t: 'Enfermeras', d: 'Que quieren incorporar injectables estéticos a su práctica clínica.' },
              { icon: '🩺', t: 'Médicos', d: 'Que desean especializarse en medicina estética facial de alta precisión.' },
              { icon: '🦷', t: 'Odontólogos', d: 'Con conocimiento de anatomía orofacial que quieren ampliar su oferta.' },
              { icon: '💆‍♀️', t: 'Esteticistas', d: 'Con habilitación para procedimientos invasivos que buscan perfeccionar técnicas.' },
            ].map(c => (
              <div key={c.t} className="card">
                <div className="c-icon">{c.icon}</div>
                <div className="c-title">{c.t}</div>
                <div className="c-desc">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section className="mod-sec" id="modulos">
        <div className="sec-in">
          <p className="lbl">Programa del curso</p>
          <h2 className="ttl">6 módulos.<br /><em>Todo lo que necesitas.</em></h2>
          <div className="dvd" />
          <div className="mod-grid">
            {[
              { n: '01', t: 'Anatomía de los labios', d: 'Estructura muscular, vascular y nerviosa. Proporciones áureas y análisis facial completo.' },
              { n: '02', t: 'Materiales y productos', d: 'Ácido hialurónico: marcas, densidades, reología. Cánula vs aguja — cuándo usar cada uno.' },
              { n: '03', t: 'Técnicas base', d: 'Lip flip, contorno, volumen, técnica de París. Protocolos paso a paso con demostración.' },
              { n: '04', t: 'Técnicas avanzadas', d: 'Técnica rusa, labios asimétricos, maduros y masculinos. Casos complejos reales.' },
              { n: '05', t: 'Prevención y complicaciones', d: 'Identificación y manejo de complicaciones vasculares. Protocolo con hialuronidasa.' },
              { n: '06', t: 'Casos clínicos reales', d: 'Antes y después de Clínicas NK. Análisis detallado de resultados y decisiones clínicas.' },
            ].map(mod => (
              <div key={mod.n} className="mod">
                <div className="mod-n">{mod.n}</div>
                <div className="mod-t">{mod.t}</div>
                <div className="mod-d">{mod.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NATASHA */}
      <section className="nat">
        <div className="nat-bg" /><div className="nat-ov" />
        <div className="nat-in">
          <div className="nat-img"><img src="/fotos/natasha.jpg" alt="Natasha NK" /></div>
          <div>
            <p className="lbl">Tu formadora</p>
            <h2 className="ttl">Natasha NK<br /><em>Médica Estética</em></h2>
            <div className="dvd" />
            <div className="stats">
              <div className="stat"><div className="stat-n">+50</div><div className="stat-l">Certificaciones</div></div>
              <div className="stat"><div className="stat-n">+8</div><div className="stat-l">Años exp.</div></div>
              <div className="stat"><div className="stat-n">+2k</div><div className="stat-l">Pacientes</div></div>
            </div>
            <p className="bio">Especialista en medicina estética con formación internacional y más de 50 certificaciones en injectables, harmonización facial y estética corporal. Directora de Clínicas NK en Torrevieja.</p>
            <br />
            <p className="bio">Su metodología combina precisión científica con visión artística — las mismas bases que enseña en cada formación.</p>
            <br />
            <a href={`${WA}?text=${encodeURIComponent('Hola Natasha! Quiero saber más sobre el curso Lábios con Arte')}`} className="btn-p" target="_blank" rel="noopener noreferrer">💬 Hablar con Natasha</a>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="gal">
        <div className="sec-in">
          <p className="lbl">La clínica</p>
          <h2 className="ttl">Aprende en un<br /><em>ambiente de excelencia</em></h2>
          <div className="dvd" />
          <div className="gal-grid">
            {['/fotos/sala-tratamento-2.jpg','/fotos/sala-espera.jpg','/fotos/nk-mesa.jpg','/fotos/cafe.jpg'].map((src, i) => (
              <div key={src} className="gal-i"><img src={src} alt={`Clínica NK ${i+1}`} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="price">
        <div className="price-bg" /><div className="price-ov" />
        <div className="price-c">
          <p className="lbl">Inversión</p>
          <h2 className="ttl">Una formación.<br /><em>Resultados para siempre.</em></h2>
          <div className="price-box">
            <div className="badge">Precio de lanzamiento</div>
            <div className="price-amt"><sup>€</sup>249</div>
            <div className="price-note">Plazas limitadas · 10 participantes máximo</div>
            <ul className="inc">
              {['Jornada presencial de 8 horas en Clínicas NK','Acceso online vitalicio a los módulos grabados','Manual del curso en PDF descargable','Certificado de formación oficial','Grupo privado de seguimiento post-formación','Materiales y productos del día incluidos'].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href={`${WA}?text=${encodeURIComponent('Hola! Quiero reservar mi plaza en el curso Lábios con Arte del 11 de agosto de 2026')}`} className="btn-wa" target="_blank" rel="noopener noreferrer">💬 Reservar mi plaza por WhatsApp</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="f-logo">N<span>K</span> Escola</div>
        <p>© 2026 Clínicas NK · Torrevieja, España</p>
        <p><a href="https://clinicasnk.com">clinicasnk.com</a></p>
      </footer>
    </>
  );
}
