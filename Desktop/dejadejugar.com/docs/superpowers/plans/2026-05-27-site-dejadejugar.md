# DejaDeJugar — Site (Frontend + Supabase + Stripe) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocar o dejadejugar.com no ar — fork do paredejogar traduzido para espanhol, identidade Azul+Dourado, Stripe no lugar do MercadoPago, novo projecto Supabase.

**Architecture:** Fork direto do paredejogar (`C:\Users\corretora1000_00\Desktop\Agentes de IA\paredejogar`) para `C:\Users\corretora1000_00\Desktop\dejadejugar.com`. Supabase Cloud novo projecto. Stripe Checkout para pagamentos em EUR. Deploy Vercel.

**Tech Stack:** React 19 + Vite + Tailwind CSS + Supabase JS v2 + Stripe JS + React Router v7 + Resend

---

## Mapa de Ficheiros

| Ficheiro | Acção |
|----------|-------|
| `src/index.css` | Modificar — trocar tokens de cor para Azul+Dourado |
| `src/App.jsx` | Modificar — trocar BotaoEmergencia por BotonDeEmergencia |
| `src/pages/LandingPage.jsx` | Modificar — tradução PT→ES + cores |
| `src/pages/auth/LoginPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/auth/RegisterPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/auth/ForgotPasswordPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/NovaSenha.jsx` | Modificar — tradução PT→ES |
| `src/pages/QuizPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/FamilyQuizPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/QuizResultPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/Painel.jsx` | Modificar — tradução PT→ES + trocar MP por Stripe |
| `src/pages/ModuloEntry.jsx` | Modificar — tradução PT→ES |
| `src/pages/AulaPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/Contrato.jsx` | Modificar — tradução PT→ES |
| `src/pages/TermosPage.jsx` | Modificar — tradução PT→ES |
| `src/pages/CertificadoPage.jsx` | Modificar — tradução PT→ES |
| `src/components/Navbar.jsx` | Modificar — tradução PT→ES + cores |
| `src/components/Footer.jsx` | Modificar — tradução PT→ES |
| `src/components/LeadForm.jsx` | Modificar — tradução PT→ES |
| `src/components/BotonDeEmergencia.jsx` | Criar — fork do BotaoEmergencia com perguntas em ES |
| `src/data/modulosContent.js` | Modificar — tradução completa PT→ES |
| `src/quiz/questions.js` | Modificar — tradução PT→ES |
| `src/quiz/resultLevels.js` | Modificar — tradução PT→ES |
| `package.json` | Modificar — adicionar `@stripe/stripe-js` |
| `.env.local` | Criar — credenciais do projecto ES |
| `supabase/functions/criar-preferencia-stripe/index.ts` | Criar — Edge Function Stripe |
| `supabase/functions/webhook-stripe/index.ts` | Criar — Edge Function webhook |

---

## Task 1: Fork do paredejogar

**Files:**
- Modify: `C:\Users\corretora1000_00\Desktop\dejadejugar.com\` (directório de destino)

- [ ] **Step 1: Copiar ficheiros fonte do paredejogar**

```powershell
$src = "C:\Users\corretora1000_00\Desktop\Agentes de IA\paredejogar"
$dst = "C:\Users\corretora1000_00\Desktop\dejadejugar.com"
$exclude = @(".git", "node_modules", "dist", ".env.local")

Get-ChildItem $src | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
  if ($_.PSIsContainer) {
    Copy-Item $_.FullName -Destination $dst -Recurse -Force
  } else {
    Copy-Item $_.FullName -Destination $dst -Force
  }
}
```

- [ ] **Step 2: Verificar que os ficheiros foram copiados**

```powershell
Get-ChildItem "C:\Users\corretora1000_00\Desktop\dejadejugar.com" | Select-Object Name
```

Esperado: ver `src`, `public`, `supabase`, `package.json`, `vite.config.js`, `index.html`, etc.

- [ ] **Step 3: Actualizar package.json — nome e adicionar Stripe**

Em `package.json`, alterar `"name": "paredejogar"` para `"name": "dejadejugar"` e adicionar `@stripe/stripe-js`:

```json
{
  "name": "dejadejugar",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@stripe/stripe-js": "^4.0.0",
    "@supabase/supabase-js": "^2.101.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "tailwindcss": "^4.2.2",
    "vite": "^8.0.1"
  }
}
```

- [ ] **Step 4: Instalar dependências**

```powershell
cd "C:\Users\corretora1000_00\Desktop\dejadejugar.com"
npm install
```

Esperado: `added X packages` sem erros.

- [ ] **Step 5: Criar .env.local com placeholders**

Criar `C:\Users\corretora1000_00\Desktop\dejadejugar.com\.env.local`:

```
VITE_SUPABASE_URL=https://SEU_PROJETO_ES.supabase.co
VITE_SUPABASE_ANON_KEY=SEU_ANON_KEY_ES
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
```

> Preencher após criar o projecto Supabase ES (Task 12) e configurar Stripe (Task 13).

- [ ] **Step 6: Verificar que o servidor de dev arranca**

```powershell
npm run dev
```

Esperado: `Local: http://localhost:5173/` sem erros de compilação.

- [ ] **Step 7: Commit inicial**

```powershell
cd "C:\Users\corretora1000_00\Desktop\dejadejugar.com"
git add src public supabase package.json package-lock.json vite.config.js index.html vercel.json eslint.config.js .gitignore
git commit -m "feat: fork inicial do paredejogar para dejadejugar"
```

---

## Task 2: Branding — Tokens de Cor

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Substituir variáveis CSS em `src/index.css`**

Localizar o bloco `:root` existente (que tem `--verde`, `--vermelho`, etc.) e substituir por:

```css
:root {
  --azul: #1A3A6B;
  --azul-claro: #E8EFF8;
  --azul-suave: #F0F4FF;
  --dourado: #C8962A;
  --dourado-claro: #FDF6E3;
  --creme: #F7F6F2;
  --texto: #1A1A2E;
  --texto-sec: #4A4A6A;
  --texto-ter: #8A8AA0;
  --borda: #D8DFF0;
  --fonte-titulo: 'DM Serif Display', Georgia, serif;
  --fonte-corpo: 'DM Sans', system-ui, sans-serif;
}
```

> Nota: a LandingPage.jsx define os seus próprios tokens CSS em linha (bloco `const css`). Esses serão actualizados na Task 5. Por agora só actualizar o index.css global.

- [ ] **Step 2: Verificar no browser**

Abrir `http://localhost:5173/` e confirmar que o site carrega sem erros de CSS.

- [ ] **Step 3: Commit**

```powershell
git add src/index.css
git commit -m "feat: tokens de cor Azul+Dourado para identidade ES"
```

---

## Task 3: Navbar e Footer

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Actualizar Navbar.jsx**

Substituir o conteúdo de `src/components/Navbar.jsx` mantendo a estrutura mas traduzindo textos e actualizando cores:

```jsx
// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(247,246,242,0.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #D8DFF0',
      padding: '0 32px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 18, color: '#1A3A6B' }}>
          Deja<span style={{ color: '#C8962A' }}>De</span>Jugar
        </span>
      </Link>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link to="/quiz" style={{ fontSize: 13, color: '#4A4A6A', textDecoration: 'none' }}>Test</Link>
        <Link to="/blog" style={{ fontSize: 13, color: '#4A4A6A', textDecoration: 'none' }}>Blog</Link>
        {user ? (
          <>
            <Link to="/painel" style={{ fontSize: 13, color: '#1A3A6B', fontWeight: 600, textDecoration: 'none' }}>Mi panel</Link>
            <button onClick={handleLogout} style={{
              background: 'none', border: '1px solid #D8DFF0', borderRadius: 6,
              padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#4A4A6A',
              fontFamily: 'inherit',
            }}>Salir</button>
          </>
        ) : (
          <Link to="/entrar" style={{
            background: '#1A3A6B', color: '#E8EFF8',
            padding: '7px 16px', borderRadius: 6, fontSize: 13,
            fontWeight: 500, textDecoration: 'none',
          }}>Iniciar sesión</Link>
        )}
      </div>
    </nav>
  )
}
```

> Verificar como o Navbar actual lê o user (via `useAuth` ou directo do supabase) e manter a mesma lógica.

- [ ] **Step 2: Actualizar Footer.jsx — textos PT→ES**

No `src/components/Footer.jsx`, substituir todos os textos PT por ES. Exemplo das alterações principais:

```
"Todos os direitos reservados" → "Todos los derechos reservados"
"Instituto ISTOP" → "Instituto ISTOP España"
"Programa" → "Programa"
"Módulo 1 — Interrupção" → "Módulo 1 — Interrupción"
"Módulo 2 — Sensibilização" → "Módulo 2 — Sensibilización"
"Módulo 3 — Autorregulação" → "Módulo 3 — Autorregulación"
"Módulo 4 — Reorganização" → "Módulo 4 — Reorganización"
"Módulo 5 — Manutenção" → "Módulo 5 — Mantenimiento"
"Sobre o método" → "Sobre el método"
"Para familiares" → "Para familiares"
"© 2025 Instituto ISTOP." → "© 2025 Instituto ISTOP España."
```

- [ ] **Step 3: Verificar no browser**

`http://localhost:5173/` — Navbar mostra "DejaDeJugar" em azul+dourado, Footer em espanhol.

- [ ] **Step 4: Commit**

```powershell
git add src/components/Navbar.jsx src/components/Footer.jsx
git commit -m "feat: Navbar e Footer traduzidos para ES, identidade Azul+Dourado"
```

---

## Task 4: Landing Page

**Files:**
- Modify: `src/pages/LandingPage.jsx`

- [ ] **Step 1: Actualizar tokens de cor no bloco CSS interno**

No topo de `LandingPage.jsx`, localizar o bloco `const css = \`...\`` e substituir as variáveis:

```css
:root {
  --verde: #1A3A6B;
  --verde-claro: #E8EFF8;
  --verde-suave: #F0F4FF;
  --vermelho: #7B2D00;
  --creme: #F7F6F2;
  --texto: #1A1A2E;
  --texto-sec: #4A4A6A;
  --texto-ter: #8A8AA0;
  --borda: #D8DFF0;
  --fonte-titulo: 'DM Serif Display', Georgia, serif;
  --fonte-corpo: 'DM Sans', system-ui, sans-serif;
}
```

> Mantemos os nomes de variável (`--verde`, `--vermelho`) para não ter de mudar todas as referências CSS abaixo. Apenas mudamos os valores para as novas cores.

- [ ] **Step 2: Traduzir textos do Hero**

```jsx
// Antes:
<h1 className="lp-hero-title">
  <span className="lp-pare">PARE</span>{' '}
  <span className="lp-viva">VIVA</span>
</h1>

// Depois:
<h1 className="lp-hero-title">
  <span className="lp-pare">DEJA</span>{' '}
  <span className="lp-viva">VIVE</span>
</h1>
```

Circles ISTOP — traduzir labels:
```jsx
['I', 'Interrupción'], ['S', 'Sensibilización'], ['T', 'Transformación'],
['O', 'Organización'], ['P', 'Prevención'],
```

Hero subtitle e desc:
```jsx
<p className="lp-hero-subtitle">"Cuando el juego deja de ser diversión y empieza a controlar tu vida."</p>
<p className="lp-hero-desc">Un camino para dejar de apostar, elaborar tus pérdidas y reconstruir tu vida — con base científica y acompañamiento real.</p>
```

Hero buttons:
```jsx
<Link to="/quiz" className="lp-btn-primary">Test para Jugador</Link>
<Link to="/quiz/familias" className="lp-btn-secondary">Test para Familiar</Link>
```

Hero CTA:
```jsx
{temModulo1 ? "Continúa tu camino →" : "Inicia tu camino →"}
```

- [ ] **Step 3: Traduzir secção "Espelho da Dor"**

```jsx
<span className="lp-section-label">¿Te reconoces?</span>
<h2 className="lp-section-title">El juego prometió algo que no entregó.</h2>
<p className="lp-section-sub">Millones de personas viven este ciclo en silencio. No estás solo.</p>
```

Cards de dor:
```js
'"Solo una ronda más para recuperar lo que perdí."',
'"Juego por diversión, pero a veces paso horas sin darme cuenta."',
'"Ya he mentido a mi familia sobre cuánto gasté."',
'"Cuando gano, lo reinvierto todo. Cuando pierdo, doblo la apuesta."',
'"Pienso en apuestas incluso cuando estoy trabajando."',
'"He intentado parar varias veces. Pero siempre vuelvo."',
```

Fechamento: `'Estos pensamientos no son debilidad. Son señales de un ciclo que puede interrumpirse.'`

- [ ] **Step 4: Traduzir secção Credibilidade**

```jsx
<span className="lp-section-label">Por qué el ISTOP funciona</span>
<h2 className="lp-section-title">Base científica.<br />Acompañamiento real.</h2>
<p className="lp-section-sub">El método ISTOP fue desarrollado con base en evidencias de psicología conductual y neurociencia aplicada a la dependencia.</p>
```

Stats:
```js
['85%', 'de los apostadores compulsivos nunca buscan ayuda por no saber por dónde empezar'],
['6 de 10', 'personas que completan programas psicoeducativos reducen o cesan el comportamiento'],
['15 min', 'es el tiempo promedio que dura un impulso intenso — si no actúas sobre él'],
```

Badges:
```js
['Terapia Cognitivo-Conductual', 'Neurociencia de la Dependencia', 'Prevención de Recaída', 'Regulación Emocional', 'Psicoeducación']
```

- [ ] **Step 5: Traduzir secção Método ISTOP**

```jsx
<span className="lp-section-label">El método</span>
<h2 className="lp-section-title">Cinco etapas. Una dirección.</h2>
<p className="lp-section-sub">Cada letra del ISTOP representa una etapa real de transformación — no una promesa vaga.</p>
```

Cards:
```js
['I', 'Interrupción', 'Reconocer el ciclo y dar el primer paso consciente para salir del piloto automático.'],
['S', 'Sensibilización', 'Identificar desencadenantes emocionales, situacionales y relacionales que alimentan el impulso.'],
['T', 'Transformación', 'Desarrollar herramientas de autorregulación y crear espacio entre el desencadenante y la acción.'],
['O', 'Organización', 'Reorganizar la rutina, los hábitos y el entorno para sostener el cambio.'],
['P', 'Prevención', 'Consolidar lo aprendido y construir sistemas de protección duraderos.'],
```

- [ ] **Step 6: Traduzir secção Depoimentos**

```jsx
<span className="lp-section-label">Historias</span>
<h2 className="lp-section-title">De quienes reconocieron el problema</h2>
```

Testemunhos:
```js
'Empecé apostando por diversión, pero pronto estaba usando el dinero del alquiler intentando recuperar pérdidas.',
'El juego se convirtió en una forma de escapar del estrés. Cuando me di cuenta, estaba gastando parte de mi sueldo.',
'Después del divorcio empecé a apostar a escondidas por las noches. Solo noté el problema cuando llegaron las deudas.',
'Creía que la suerte iba a cambiar. Pero en realidad estaba atrapado en el ciclo del juego.',
```

Nota: `'Historias basadas en casos reales descritos en el libro <em>Juegos Online — Adicción de Bolsillo</em>.'`

- [ ] **Step 7: Traduzir secção Programa / Módulos**

```jsx
<span className="lp-section-label">El programa</span>
<h2 className="lp-section-title">Cinco etapas.</h2>
<p className="lp-section-sub">Un camino de transformación real — a tu ritmo, en tu tiempo.</p>
```

Módulos:
```js
{ n: 1, nome: 'Interrupción', desc: 'Empiezas entendiendo cómo se instala el ciclo del juego — y das el primer paso para salir del piloto automático.', info: '3 clases · Contrato de Interrupción' },
{ n: 2, nome: 'Sensibilización', desc: 'Identificas qué activa el impulso: emociones, pensamientos, ambientes. El comportamiento adquiere nombre — y pierde fuerza.', info: '5 clases · Mapa de Desencadenantes ISTOP' },
{ n: 3, nome: 'Autorregulación', desc: 'Aprendes a crear una pausa entre el desencadenante y la acción. Aquí comienza el control real — construido por ti, para ti.', info: '5 clases · Plan Personal de Manejo' },
{ n: 4, nome: 'Reorganización', desc: 'Los hábitos antiguos son sustituidos por nuevos patrones. Reconstruyes tu rutina con comportamientos que refuerzan el cambio.', info: '5 clases · Estructura de Rutina' },
{ n: 5, nome: 'Mantenimiento del Cambio y Prevención de Recaídas', desc: 'Consolida los cambios iniciados y desarrolla estrategias para reducir el riesgo de recaída a lo largo del tiempo.', info: '5 clases · Protocolo de Prevención de Recaída · Certificado' },
```

Ferramentas:
```js
['Mapa de Desencadenantes ISTOP', 'Plan Personal de Manejo del Impulso', 'Protocolo de Prevención de Recaída', 'Certificado de Finalización']
```

- [ ] **Step 8: Traduzir secção Familiares**

Todos os textos da secção `lp-familiares` PT→ES. Principais:
```
"Para familiares" → "Para familiares"
"¿Tienes un ser querido que apuesta compulsivamente?" (heading)
"Lo que puedes hacer:" → "Lo que puedes hacer:"
"Mantener diálogo sin juicio" → "Mantener diálogo sin juicio"
"Establecer límites claros" → "Establecer límites claros"
"Buscar información sobre adicción al juego" → "Buscar información sobre adicción al juego"
"Cuidar tu propio bienestar emocional" → "Cuidar tu propio bienestar emocional"
"Formulario para familiares" heading → "Recibe orientación gratuita"
```

- [ ] **Step 9: Traduzir FAQ**

```js
const faqs = [
  { p: '¿El programa sustituye el tratamiento psicológico?', r: 'No. El programa es psicoeducativo y complementario. Para casos de dependencia grave, el acompañamiento con un profesional de salud mental es fundamental. El ISTOP puede utilizarse en paralelo al tratamiento.' },
  { p: '¿Necesito comprar todos los módulos de una vez?', r: 'El programa se vende por módulo, de forma secuencial. Cada módulo se adquiere por separado, pero el orden es obligatorio: el Módulo 2 solo puede comprarse tras el Módulo 1, el Módulo 3 tras el 2, y así sucesivamente.' },
  { p: '¿El programa funciona para cualquier tipo de apuesta?', r: 'Sí. El método fue desarrollado para comportamientos compulsivos con apuestas en general — deportes, casinos online, juegos de azar — con especial enfoque en las plataformas digitales.' },
  { p: '¿Cuánto tiempo al día necesito dedicar?', r: 'Cada clase lleva entre 15 y 25 minutos. Las actividades prácticas llevan unos 3 minutos. El programa fue diseñado para ser compatible con la rutina de quien trabaja.' },
  { p: '¿Tengo acceso de por vida tras la compra?', r: 'No. Tras la compra de cada módulo, tienes 120 días para completarlo. El plazo es individual por módulo.' },
]
```

- [ ] **Step 10: Traduzir CTA final e Footer interno**

```jsx
<span className="lp-section-label">Empieza ahora</span>
<h2 className="lp-section-title">El primer paso no tiene que ser grande.</h2>
<p>Empieza por el Módulo 1. Entiende cómo funciona el ciclo. Da el primer paso.</p>
<Link to="/quiz" className="lp-btn-light">Test para Jugador</Link>
<Link to="/quiz/familias" className="lp-btn-outline-light">Test para Familiar</Link>
```

Footer interno (secção dentro da LandingPage):
```
"© 2025 Instituto ISTOP España. Todos los derechos reservados."
"Método ISTOP — Instituto ISTOP España"
```

- [ ] **Step 11: Traduzir sidebar do blog (se existir)**

```jsx
<span>📰</span>
<span>Últimas del blog</span>
// ...
<Link to="/blog" className="lp-hero-sidebar-link">
  Ver todos los artículos →
</Link>
```

- [ ] **Step 12: Verificar landing no browser**

`http://localhost:5173/` — hero mostra "DEJA VIVE", textos em espanhol, cores azul+dourado.

- [ ] **Step 13: Commit**

```powershell
git add src/pages/LandingPage.jsx
git commit -m "feat: LandingPage traduzida PT→ES com identidade Azul+Dourado"
```

---

## Task 5: Páginas de Auth

**Files:**
- Modify: `src/pages/auth/LoginPage.jsx`
- Modify: `src/pages/auth/RegisterPage.jsx`
- Modify: `src/pages/auth/ForgotPasswordPage.jsx`
- Modify: `src/pages/NovaSenha.jsx`

- [ ] **Step 1: Traduzir LoginPage.jsx**

Substituições principais:
```
"Entrar" → "Iniciar sesión"
"E-mail" → "Correo electrónico"
"Senha" → "Contraseña"
"Esqueci minha senha" → "Olvidé mi contraseña"
"Entrar com Google" → "Continuar con Google"
"Não tem conta?" → "¿No tienes cuenta?"
"Cadastrar" → "Registrarse"
"Entrando..." → "Iniciando sesión..."
"E-mail ou senha incorretos." → "Correo o contraseña incorrectos."
```

- [ ] **Step 2: Traduzir RegisterPage.jsx**

```
"Criar conta" → "Crear cuenta"
"Nome completo" → "Nombre completo"
"E-mail" → "Correo electrónico"
"Senha" → "Contraseña"
"Confirmar senha" → "Confirmar contraseña"
"Cadastrando..." → "Registrando..."
"Já tem conta?" → "¿Ya tienes cuenta?"
"Entrar" → "Iniciar sesión"
"As senhas não coincidem." → "Las contraseñas no coinciden."
"Ao criar conta, você aceita nossos" → "Al crear cuenta, aceptas nuestros"
"Termos de Uso" → "Términos de Uso"
"Política de Privacidade" → "Política de Privacidad"
```

- [ ] **Step 3: Traduzir ForgotPasswordPage.jsx**

```
"Recuperar senha" → "Recuperar contraseña"
"Digite seu e-mail" → "Introduce tu correo electrónico"
"Enviar link de recuperação" → "Enviar enlace de recuperación"
"Verifique seu e-mail" → "Revisa tu correo electrónico"
"Enviamos um link" → "Te enviamos un enlace"
"Voltar para o login" → "Volver al inicio de sesión"
```

- [ ] **Step 4: Traduzir NovaSenha.jsx**

```
"Nova senha" → "Nueva contraseña"
"Confirmar nova senha" → "Confirmar nueva contraseña"
"Salvar senha" → "Guardar contraseña"
"Senha alterada com sucesso" → "Contraseña cambiada con éxito"
"As senhas não coincidem." → "Las contraseñas no coinciden."
```

- [ ] **Step 5: Verificar fluxo de auth no browser**

`http://localhost:5173/entrar` — formulário em espanhol, botão Google em espanhol.

- [ ] **Step 6: Commit**

```powershell
git add src/pages/auth/ src/pages/NovaSenha.jsx
git commit -m "feat: páginas de auth traduzidas para ES"
```

---

## Task 6: Quiz

**Files:**
- Modify: `src/quiz/questions.js`
- Modify: `src/quiz/resultLevels.js`
- Modify: `src/pages/QuizPage.jsx`
- Modify: `src/pages/FamilyQuizPage.jsx`
- Modify: `src/pages/QuizResultPage.jsx`

- [ ] **Step 1: Traduzir questions.js**

Traduzir todas as perguntas e opções de resposta PT→ES. Estrutura do ficheiro mantém-se idêntica, apenas os textos mudam. Exemplo do padrão:

```js
// Antes (PT):
{ id: 1, texto: "Com que frequência você pensa em apostas?", opcoes: ["Raramente", "Às vezes", "Com frequência", "Quase sempre"] }

// Depois (ES):
{ id: 1, texto: "¿Con qué frecuencia piensas en apuestas?", opcoes: ["Raramente", "A veces", "Con frecuencia", "Casi siempre"] }
```

Traduzir todas as perguntas seguindo este padrão.

- [ ] **Step 2: Traduzir resultLevels.js**

```js
// Exemplo do padrão:
// Antes: { nivel: "Baixo", descricao: "Seu comportamento..." }
// Depois: { nivel: "Bajo", descricao: "Tu comportamiento..." }
```

Traduzir todos os níveis de resultado (títulos, descrições, recomendações).

- [ ] **Step 3: Traduzir QuizPage.jsx**

```
"Teste para Jogador" → "Test para Jugador"
"Próxima" → "Siguiente"
"Anterior" → "Anterior"
"Ver resultado" → "Ver resultado"
"Pergunta X de Y" → "Pregunta X de Y"
```

- [ ] **Step 4: Traduzir FamilyQuizPage.jsx**

```
"Teste para Familiar" → "Test para Familiar"
Todos os textos de introdução e perguntas → ES
```

- [ ] **Step 5: Traduzir QuizResultPage.jsx**

```
"Seu resultado" → "Tu resultado"
"Compartilhar no WhatsApp" → "Compartir en WhatsApp"
"Iniciar programa" → "Iniciar programa"
"Fazer quiz novamente" → "Hacer el test de nuevo"
```

- [ ] **Step 6: Verificar quiz no browser**

`http://localhost:5173/quiz` — perguntas em espanhol, resultado em espanhol.

- [ ] **Step 7: Commit**

```powershell
git add src/quiz/ src/pages/QuizPage.jsx src/pages/FamilyQuizPage.jsx src/pages/QuizResultPage.jsx
git commit -m "feat: quiz traduzido PT→ES"
```

---

## Task 7: Conteúdo dos Módulos

**Files:**
- Modify: `src/data/modulosContent.js`
- Modify: `src/pages/ModuloEntry.jsx`
- Modify: `src/pages/AulaPage.jsx`

- [ ] **Step 1: Traduzir modulosContent.js — estrutura de módulos**

Este ficheiro contém o conteúdo de todas as 23 aulas. Traduzir PT→ES mantendo a estrutura de dados idêntica. Exemplo do padrão:

```js
// Antes (PT):
{
  id: 1,
  titulo: "Módulo 1 — Interrupção",
  aulas: [
    { id: 1, titulo: "O ciclo do jogo", conteudo: "..." }
  ]
}

// Depois (ES):
{
  id: 1,
  titulo: "Módulo 1 — Interrupción",
  aulas: [
    { id: 1, titulo: "El ciclo del juego", conteudo: "..." }
  ]
}
```

Vocabulário de referência para consistência:
```
"jogo" → "juego"
"apostas" → "apuestas"
"impulso" → "impulso"
"gatilho" → "desencadenante"
"recaída" → "recaída"
"contrato" → "contrato"
"módulo" → "módulo"
"aula" → "clase"
"concluído" → "completado"
"Mapa de Gatilhos" → "Mapa de Desencadenantes"
"Plano Pessoal de Manejo" → "Plan Personal de Manejo"
"Estrutura de Rotina" → "Estructura de Rutina"
"Protocolo de Prevenção de Recaída" → "Protocolo de Prevención de Recaída"
```

- [ ] **Step 2: Traduzir ModuloEntry.jsx**

```
"Módulo X" → "Módulo X"
"Começar" → "Comenzar"
"Continuar" → "Continuar"
"Concluído" → "Completado"
"Bloqueado" → "Bloqueado"
"Comprar" → "Comprar"
"aulas" → "clases"
"Ferramenta incluída:" → "Herramienta incluida:"
```

- [ ] **Step 3: Traduzir AulaPage.jsx**

```
"Aula X de Y" → "Clase X de Y"
"Próxima aula" → "Siguiente clase"
"Aula anterior" → "Clase anterior"
"Marcar como concluída" → "Marcar como completada"
"Concluída" → "Completada"
"Voltar ao módulo" → "Volver al módulo"
```

- [ ] **Step 4: Verificar no browser**

Criar conta de teste → `/painel` → módulo 1 → verificar textos em espanhol.

- [ ] **Step 5: Commit**

```powershell
git add src/data/modulosContent.js src/pages/ModuloEntry.jsx src/pages/AulaPage.jsx
git commit -m "feat: conteúdo dos módulos traduzido PT→ES"
```

---

## Task 8: Painel — Tradução + Stripe

**Files:**
- Modify: `src/pages/Painel.jsx`

- [ ] **Step 1: Actualizar PRECOS para EUR**

Localizar o objecto `PRECOS` em `Painel.jsx` e substituir:

```js
const PRECOS = {
  1: { label: "€29,90", valor: 29.9 },
  2: { label: "€49,90", valor: 49.9 },
  3: { label: "€89,90", valor: 89.9 },
  4: { label: "€149,90", valor: 149.9 },
  5: { label: "€199,90", valor: 199.9 },
};
```

- [ ] **Step 2: Actualizar array de módulos — nomes em ES**

```js
const modulos = [
  { id: 1, etapa: "I", nome: "Interrupción", ... },
  { id: 2, etapa: "S", nome: "Comprendiendo los Desencadenantes del Juego", ... },
  { id: 3, etapa: "T", nome: "Autorregulación", ... },
  { id: 4, etapa: "O", nome: "Reorganización conductual", ... },
  { id: 5, etapa: "P", nome: "Mantenimiento del Cambio y Prevención de Recaídas", ... },
]
```

Traduzir também os campos `descricao`, `ferramenta` e `detalhes` de cada módulo para ES.

- [ ] **Step 3: Substituir handleComprar — MP → Stripe**

Localizar a função `handleComprar` (usa `criar-preferencia-mp` e `init_point`) e substituir por:

```js
async function handleComprar(moduloId) {
  setCarregandoPgto(moduloId);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/criar-preferencia-stripe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          modulo_id: moduloId,
          user_id: session.user.id,
        }),
      }
    );
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      alert("Error al iniciar el pago. Inténtalo de nuevo.");
    }
  } catch (e) {
    console.error(e);
    alert("Error al conectar al sistema de pago.");
  } finally {
    setCarregandoPgto(null);
  }
}
```

- [ ] **Step 4: Traduzir textos do Painel**

```
"Olá," → "¡Hola,"
"bem-vindo" → "bienvenido"
"Seu progresso" → "Tu progreso"
"módulos concluídos" → "módulos completados"
"Disponível" → "Disponible"
"Concluído" → "Completado"
"Bloqueado" → "Bloqueado"
"Comprar" → "Comprar"
"Iniciar" → "Iniciar"
"Continuar" → "Continuar"
"Carregando..." → "Cargando..."
"Processando pagamento..." → "Procesando pago..."
"Livros gratuitos" → "Libros gratuitos"
"Baixar" → "Descargar"
"Contrato de Interrupção" → "Contrato de Interrupción"
```

- [ ] **Step 5: Actualizar import — remover BotaoEmergencia, importar BotonDeEmergencia**

```jsx
// Remover:
import BotaoEmergencia from "../components/BotaoEmergencia";

// Adicionar:
import BotonDeEmergencia from "../components/BotonDeEmergencia";
```

Substituir `<BotaoEmergencia` por `<BotonDeEmergencia` no JSX.

- [ ] **Step 6: Verificar no browser**

`http://localhost:5173/painel` (após login) — preços em €, textos em espanhol.

- [ ] **Step 7: Commit**

```powershell
git add src/pages/Painel.jsx
git commit -m "feat: Painel traduzido ES + Stripe no lugar do MercadoPago"
```

---

## Task 9: Botón de Emergencia

**Files:**
- Create: `src/components/BotonDeEmergencia.jsx`

- [ ] **Step 1: Criar BotonDeEmergencia.jsx — fork traduzido**

Copiar `src/components/BotaoEmergencia.jsx` para `src/components/BotonDeEmergencia.jsx` e traduzir **todo o conteúdo** PT→ES.

**Blocos de perguntas — tradução:**

```js
const BLOCOS = [
  {
    id: 1, modulo: "Módulo 1 — Interrupción", cor: "#C0392B",
    perguntas: [
      { texto: "Estoy sintiendo un impulso fuerte ahora mismo.", tipo: "Sí/No" },
      { texto: "Ya intenté recuperar pérdidas apostando más en las últimas 24 horas.", tipo: "V/F" },
      { texto: "Estoy apostando a escondidas de alguien importante para mí.", tipo: "Sí/No" },
      { texto: "Siento que el juego está controlando mis decisiones hoy.", tipo: "V/F" },
      { texto: "Ya usé dinero que necesitaba para otras cosas esenciales.", tipo: "Sí/No" },
      { texto: "Estoy intentando demostrar algo a mí mismo o a otros a través del juego.", tipo: "V/F" },
      { texto: "Siento ansiedad cuando pienso en no apostar ahora.", tipo: "Sí/No" },
      { texto: "Ya mentí sobre cuánto tiempo o dinero gasté jugando.", tipo: "V/F" },
      { texto: "Estoy jugando para escapar de un problema o emoción difícil.", tipo: "Sí/No" },
      { texto: "Creo que \"esta vez será diferente\".", tipo: "V/F" },
      { texto: "Estoy sintiendo culpa por mis apuestas recientes.", tipo: "Sí/No" },
      { texto: "Ya cancelé o pospuse compromisos importantes para jugar.", tipo: "V/F" },
      { texto: "Estoy apostando cantidades cada vez mayores para sentir la misma emoción.", tipo: "Sí/No" },
      { texto: "Pienso en el juego incluso cuando no estoy jugando.", tipo: "V/F" },
      { texto: "Ya pedí dinero prestado para seguir jugando.", tipo: "Sí/No" },
      { texto: "Siento que perdí el control sobre mis apuestas.", tipo: "V/F" },
      { texto: "Estoy ignorando señales de alerta que reconozco.", tipo: "Sí/No" },
      { texto: "Ya intenté parar y no pude solo.", tipo: "V/F" },
      { texto: "Estoy justificando el juego como \"solo diversión\" ahora.", tipo: "Sí/No" },
      { texto: "Necesito una pausa consciente de 15 minutos antes de cualquier acción.", tipo: "V/F" },
    ],
  },
  {
    id: 2, modulo: "Módulo 2 — Sensibilización", cor: "#D35400",
    perguntas: [
      { texto: "Puedo identificar qué emoción estoy sintiendo ahora.", tipo: "Sí/No" },
      { texto: "Estoy apostando porque estoy aburrido.", tipo: "V/F" },
      { texto: "Estoy apostando porque estoy estresado.", tipo: "Sí/No" },
      { texto: "Estoy apostando porque me siento solo.", tipo: "V/F" },
      { texto: "Estoy apostando porque estoy celebrando algo.", tipo: "Sí/No" },
      { texto: "Estoy apostando porque estoy frustrado con algo.", tipo: "V/F" },
      { texto: "Recibí algún desencadenante externo (publicidad, notificación) en los últimos 30 minutos.", tipo: "Sí/No" },
      { texto: "Estoy intentando aliviar una tensión emocional a través del juego.", tipo: "V/F" },
      { texto: "Ya identifiqué mis principales desencadenantes emocionales.", tipo: "Sí/No" },
      { texto: "Estoy apostando para evitar pensar en algo difícil.", tipo: "V/F" },
      { texto: "Puedo nombrar lo que estoy sintiendo sin juzgarme.", tipo: "Sí/No" },
      { texto: "Estoy confundiendo aburrimiento con necesidad de jugar.", tipo: "V/F" },
      { texto: "Estoy confundiendo ansiedad con \"buena suerte próxima\".", tipo: "Sí/No" },
      { texto: "Ya mapeé qué horas del día soy más vulnerable.", tipo: "V/F" },
      { texto: "Estoy apostando porque vi a alguien hablando sobre eso.", tipo: "Sí/No" },
      { texto: "Reconozco que estoy en el pico de la curva del impulso ahora.", tipo: "V/F" },
      { texto: "Estoy intentando llenar un vacío emocional con el juego.", tipo: "Sí/No" },
      { texto: "Ya identifiqué patrones repetitivos en mi comportamiento.", tipo: "V/F" },
      { texto: "Soy consciente de que el impulso pasará naturalmente.", tipo: "Sí/No" },
      { texto: "Necesito registrar este momento en mi Mapa de Desencadenantes.", tipo: "V/F" },
    ],
  },
  {
    id: 3, modulo: "Módulo 3 — Autorregulación", cor: "#1A6B8A",
    perguntas: [
      { texto: "¿Han pasado 15 minutos desde que sentí el impulso?", tipo: "Sí/No" },
      { texto: "Respiré profundamente 3 veces antes de decidir.", tipo: "V/F" },
      { texto: "Logré observar el impulso sin actuar de inmediato.", tipo: "Sí/No" },
      { texto: "Estoy usando el método de \"surf del impulso\" (urge surfing).", tipo: "V/F" },
      { texto: "Identifiqué el pensamiento automático que surgió con el impulso.", tipo: "Sí/No" },
      { texto: "Cuestioné si ese pensamiento automático es realmente verdad.", tipo: "V/F" },
      { texto: "Tengo una actividad alternativa que puedo hacer ahora.", tipo: "Sí/No" },
      { texto: "Practiqué la técnica de respiración 4-6-2 en los últimos minutos.", tipo: "V/F" },
      { texto: "Estoy en un ambiente que facilita el impulso.", tipo: "Sí/No" },
      { texto: "Puedo cambiar de ambiente o actividad ahora mismo.", tipo: "V/F" },
      { texto: "Ya contacté a alguien de confianza sobre lo que siento.", tipo: "Sí/No" },
      { texto: "Estoy usando el juego para regular una emoción difícil.", tipo: "V/F" },
      { texto: "Conozco la diferencia entre lapse y recaída.", tipo: "Sí/No" },
      { texto: "Tengo mi Plan Personal de Manejo a mano.", tipo: "V/F" },
      { texto: "Estoy siendo amable conmigo mismo en este momento.", tipo: "Sí/No" },
      { texto: "La urgencia que siento es temporal.", tipo: "V/F" },
      { texto: "Tengo claridad sobre mis valores fuera del juego.", tipo: "Sí/No" },
      { texto: "Estoy eligiendo conscientemente qué hacer ahora.", tipo: "V/F" },
      { texto: "Puedo tolerar este malestar sin actuar sobre él.", tipo: "Sí/No" },
      { texto: "Este momento pasará, independientemente de lo que haga.", tipo: "V/F" },
    ],
  },
  {
    id: 4, modulo: "Módulo 4 — Reorganización", cor: "#27AE60",
    perguntas: [
      { texto: "Hoy seguí mi rutina sin interrupciones por el juego.", tipo: "Sí/No" },
      { texto: "Dormí bien anoche.", tipo: "V/F" },
      { texto: "Hice alguna actividad física en los últimos 2 días.", tipo: "Sí/No" },
      { texto: "Comí de forma adecuada hoy.", tipo: "V/F" },
      { texto: "Tengo al menos una actividad placentera planificada para hoy.", tipo: "Sí/No" },
      { texto: "Mis relaciones personales están mejorando.", tipo: "V/F" },
      { texto: "Tengo compromisos financieros que el juego estaba dificultando.", tipo: "Sí/No" },
      { texto: "Mi ambiente en casa/trabajo apoya mi recuperación.", tipo: "V/F" },
      { texto: "Eliminé o reduje el acceso a apps de apuestas.", tipo: "Sí/No" },
      { texto: "Tengo metas claras a corto plazo no relacionadas con el juego.", tipo: "V/F" },
      { texto: "Siento que mi rutina tiene más estructura que antes.", tipo: "Sí/No" },
      { texto: "Tengo al menos una persona de apoyo en mi vida.", tipo: "V/F" },
      { texto: "Estoy ocupando el tiempo que antes dedicaba al juego con otras cosas.", tipo: "Sí/No" },
      { texto: "Reconozco cuándo necesito pedir ayuda.", tipo: "V/F" },
      { texto: "Mi estado emocional general mejoró en las últimas semanas.", tipo: "Sí/No" },
      { texto: "Tengo límites claros con personas o situaciones de riesgo.", tipo: "V/F" },
      { texto: "Me siento más presente en mis relaciones.", tipo: "Sí/No" },
      { texto: "Estoy cuidando mi salud física activamente.", tipo: "V/F" },
      { texto: "El juego ya no domina mis pensamientos la mayor parte del tiempo.", tipo: "Sí/No" },
      { texto: "Estoy construyendo una vida que no depende del juego.", tipo: "V/F" },
    ],
  },
  {
    id: 5, modulo: "Módulo 5 — Mantenimiento y Prevención", cor: "#8E44AD",
    perguntas: [
      { texto: "Conozco mi plan de acción para situaciones de alto riesgo.", tipo: "Sí/No" },
      { texto: "Tengo un sistema de apoyo activo en este momento.", tipo: "V/F" },
      { texto: "Sé diferenciar entre lapse (desliz aislado) y recaída.", tipo: "Sí/No" },
      { texto: "Ante un lapse, sé cómo retomar sin culpa paralizante.", tipo: "V/F" },
      { texto: "Identifico las señales tempranas de recaída.", tipo: "Sí/No" },
      { texto: "Tengo estrategias específicas para cada señal de alerta.", tipo: "V/F" },
      { texto: "Mi recuperación está integrada en mi identidad.", tipo: "Sí/No" },
      { texto: "Reconozco y celebro mis avances, por pequeños que sean.", tipo: "V/F" },
      { texto: "Tengo claridad sobre el tipo de vida que quiero construir.", tipo: "Sí/No" },
      { texto: "Practico el autocuidado como parte de mi prevención.", tipo: "V/F" },
      { texto: "Soy más amable conmigo mismo que antes.", tipo: "Sí/No" },
      { texto: "Tengo fortalezas de carácter que apoyan mi recuperación.", tipo: "V/F" },
      { texto: "Tengo propósito y significado fuera del juego.", tipo: "Sí/No" },
      { texto: "Mantengo hábitos de sueño, nutrición y ejercicio.", tipo: "V/F" },
      { texto: "Me siento capaz de manejar recaídas si ocurren.", tipo: "Sí/No" },
      { texto: "Mi red de apoyo sabe cómo ayudarme.", tipo: "V/F" },
      { texto: "Tengo un plan para los próximos 3 meses.", tipo: "Sí/No" },
      { texto: "Estoy creciendo como persona más allá de la recuperación.", tipo: "V/F" },
      { texto: "Siento que tengo control sobre mi vida.", tipo: "Sí/No" },
      { texto: "Estoy en el camino correcto.", tipo: "V/F" },
    ],
  },
];
```

- [ ] **Step 2: Traduzir mensagens de UI dentro do componente**

```
"Botão de Emergência" → "Botón de Emergencia"
"Preciso de ajuda agora" → "Necesito ayuda ahora"
"Questão X de 20" → "Pregunta X de 20"
"Sim" → "Sí"
"Não" → "No"
"Verdadeiro" → "Verdadero"
"Falso" → "Falso"
"Próxima" → "Siguiente"
"Concluir bloco" → "Finalizar bloque"
"Parabéns..." → "¡Bien hecho..."
"Exercício de respiração" → "Ejercicio de respiración"
"Inspire por 4 segundos" → "Inhala por 4 segundos"
"Segure por 6 segundos" → "Mantén por 6 segundos"
"Expire por 2 segundos" → "Exhala por 2 segundos"
"Você ainda não tem o Módulo 1" → "Todavía no tienes el Módulo 1"
"Comprar Módulo 1" → "Comprar Módulo 1"
```

- [ ] **Step 3: Actualizar App.jsx**

```jsx
// Remover:
import BotaoEmergencia from './components/BotaoEmergencia'

// Adicionar:
import BotonDeEmergencia from './components/BotonDeEmergencia'

// No JSX, substituir:
// <BotaoEmergencia modulosLiberados={[]} inline={false} />
// por:
<BotonDeEmergencia modulosLiberados={[]} inline={false} />
```

- [ ] **Step 4: Verificar no browser**

`http://localhost:5173/painel` → botão de emergência visível em espanhol.

- [ ] **Step 5: Commit**

```powershell
git add src/components/BotonDeEmergencia.jsx src/App.jsx
git commit -m "feat: BotonDeEmergencia traduzido PT→ES (5 blocos, 100 perguntas)"
```

---

## Task 10: Componentes Restantes

**Files:**
- Modify: `src/components/LeadForm.jsx`
- Modify: `src/pages/Contrato.jsx`
- Modify: `src/pages/TermosPage.jsx`
- Modify: `src/pages/CertificadoPage.jsx`

- [ ] **Step 1: Traduzir LeadForm.jsx**

```
"Seu nome *" → "Tu nombre *"
"Como você se chama?" → "¿Cómo te llamas?"
"E-mail *" → "Correo electrónico *"
"seu@email.com" → "tu@email.com"
"WhatsApp" → "WhatsApp / Teléfono"
"Como posso te ajudar?" → "¿Cómo puedo ayudarte?"
"Conte um pouco sobre sua situação (opcional)" → "Cuéntanos un poco sobre tu situación (opcional)"
"Quero Receber Orientação Gratuita" → "Quiero Recibir Orientación Gratuita"
"Enviando..." → "Enviando..."
"Recebemos seu contato!" → "¡Recibimos tu mensaje!"
"Em breve entraremos em contato." → "Pronto nos pondremos en contacto contigo."
"O primeiro passo já foi dado." → "Ya diste el primer paso."
"Ops, algo deu errado. Tente novamente." → "Ups, algo salió mal. Inténtalo de nuevo."
"Seus dados são confidenciais. Sem spam." → "Tus datos son confidenciales. Sin spam."
```

- [ ] **Step 2: Traduzir Contrato.jsx**

O Contrato de Interrupção tem conteúdo longo. Traduzir:
```
"Contrato de Interrupção" → "Contrato de Interrupción"
"Eu, [nome]," → "Yo, [nombre],"
"comprometo-me a interromper" → "me comprometo a interrumpir"
"o comportamento de apostar" → "el comportamiento de apostar"
"Assinar contrato" → "Firmar contrato"
"Contrato assinado em" → "Contrato firmado el"
"Já assinei o contrato" → "Ya firmé el contrato"
"Ver contrato assinado" → "Ver contrato firmado"
```

- [ ] **Step 3: Traduzir TermosPage.jsx**

```
"Termos de Uso" → "Términos de Uso"
"Política de Privacidade" → "Política de Privacidad"
"Instituto ISTOP" → "Instituto ISTOP España"
Todos os parágrafos legais PT → ES
```

- [ ] **Step 4: Traduzir CertificadoPage.jsx**

```
"Certificado de Conclusão" → "Certificado de Finalización"
"Certificamos que" → "Certificamos que"
"concluiu com sucesso" → "ha completado con éxito"
"o programa ISTOP" → "el programa ISTOP"
"Instituto ISTOP" → "Instituto ISTOP España"
"Baixar certificado" → "Descargar certificado"
```

- [ ] **Step 5: Commit**

```powershell
git add src/components/LeadForm.jsx src/pages/Contrato.jsx src/pages/TermosPage.jsx src/pages/CertificadoPage.jsx
git commit -m "feat: componentes restantes traduzidos PT→ES"
```

---

## Task 11: index.html e meta tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Actualizar index.html**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="DejaDeJugar.com — Programa ISTOP para dejar de apostar. Método científico, acompañamiento real." />
    <title>DejaDeJugar — Deja. Vive.</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```powershell
git add index.html
git commit -m "feat: index.html actualizado para ES (lang, title, meta)"
```

---

## Task 12: Supabase — Novo Projecto ES

> **Pré-requisito:** Ter conta Supabase. Fazer login em supabase.com.

- [ ] **Step 1: Criar novo projecto Supabase**

1. Aceder a [supabase.com](https://supabase.com) → New Project
2. Nome: `dejadejugar-es`
3. Região: `eu-west-1` (Frankfurt) ou `eu-central-1` — mais próximo de Espanha
4. Guardar: Project URL e anon key

- [ ] **Step 2: Criar tabelas — SQL Editor**

Executar no SQL Editor do Supabase:

```sql
-- progresso_usuario
CREATE TABLE progresso_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  modulo_id integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, modulo_id)
);
ALTER TABLE progresso_usuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own progress" ON progresso_usuario
  FOR ALL USING (auth.uid() = user_id);

-- modulos_liberados
CREATE TABLE modulos_liberados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  modulo_id integer NOT NULL,
  liberado_em timestamptz DEFAULT now(),
  expira_em timestamptz DEFAULT (now() + interval '120 days'),
  UNIQUE(user_id, modulo_id)
);
ALTER TABLE modulos_liberados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own modules" ON modulos_liberados
  FOR ALL USING (auth.uid() = user_id);

-- pagamentos
CREATE TABLE pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  modulo_id integer,
  stripe_session_id text,
  status text,
  valor numeric,
  moeda text DEFAULT 'eur',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON pagamentos USING (false);

-- contratos
CREATE TABLE contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assinado_em timestamptz DEFAULT now(),
  conteudo text,
  UNIQUE(user_id)
);
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own contracts" ON contratos
  FOR ALL USING (auth.uid() = user_id);

-- leads
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert only" ON leads FOR INSERT WITH CHECK (true);

-- emergencia_blocos_vistos
CREATE TABLE emergencia_blocos_vistos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bloco_id integer NOT NULL,
  visto_em timestamptz DEFAULT now(),
  UNIQUE(user_id, bloco_id)
);
ALTER TABLE emergencia_blocos_vistos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own emergency data" ON emergencia_blocos_vistos
  FOR ALL USING (auth.uid() = user_id);

-- blog_posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text UNIQUE NOT NULL,
  categoria text,
  resumo text,
  conteudo text,
  imagem_url text,
  publicado boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published" ON blog_posts
  FOR SELECT USING (publicado = true);
```

- [ ] **Step 3: Configurar Google OAuth**

Supabase Dashboard → Authentication → Providers → Google:
1. Activar Google provider
2. Obter Client ID e Client Secret no [Google Cloud Console](https://console.cloud.google.com)
3. Authorized redirect URI: `https://SEU_PROJETO.supabase.co/auth/v1/callback`
4. Site URL: `https://dejadejugar.com`
5. Redirect URLs: `https://dejadejugar.com/auth/callback`, `http://localhost:5173/auth/callback`

- [ ] **Step 4: Configurar Resend para emails**

Supabase Dashboard → Authentication → Email Templates:
1. Configurar SMTP com Resend: host `smtp.resend.com`, porta `465`, user `resend`, password = Resend API Key
2. From: `noreply@dejadejugar.com`

- [ ] **Step 5: Preencher .env.local**

```
VITE_SUPABASE_URL=https://SEU_PROJETO_REAL.supabase.co
VITE_SUPABASE_ANON_KEY=SEU_ANON_KEY_REAL
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXX
```

- [ ] **Step 6: Configurar Supabase Database Webhook para leads (n8n)**

Supabase Dashboard → Database → Webhooks → Create:
- Name: `lead-to-n8n`
- Table: `leads`
- Events: `INSERT`
- URL: `https://n8n.dejadejugar.com/webhook/nova-lead`
- HTTP Method: POST

> Este webhook será configurado no Plano 2 (n8n). Por agora criar mas desactivar até o n8n estar pronto.

- [ ] **Step 7: Verificar login no browser**

`npm run dev` → `http://localhost:5173/entrar` → login com email/Google → deve redirigir para `/painel`.

- [ ] **Step 8: Commit**

```powershell
git add .env.local
# .env.local está no .gitignore — não commitar credenciais
git commit -m "feat: Supabase ES configurado, tabelas criadas" --allow-empty
```

> Nota: `.env.local` não é commitado (está no `.gitignore`). Guardar as credenciais num gestor de passwords.

---

## Task 13: Stripe — Produtos e Edge Functions

> **Pré-requisito:** Conta Stripe activa com acesso ao mercado europeu.

- [ ] **Step 1: Criar 5 produtos no Stripe Dashboard**

Aceder a [stripe.com](https://stripe.com) → Products → Add product. Criar 5 produtos:

| Nome | Preço | Moeda |
|------|-------|-------|
| Módulo 1 — Interrupción | €29,90 | EUR |
| Módulo 2 — Sensibilización | €49,90 | EUR |
| Módulo 3 — Autorregulación | €89,90 | EUR |
| Módulo 4 — Reorganización | €149,90 | EUR |
| Módulo 5 — Mantenimiento | €199,90 | EUR |

Guardar os `price_id` de cada produto (ex: `price_XXXXX`).

- [ ] **Step 2: Criar Edge Function `criar-preferencia-stripe`**

Criar `supabase/functions/criar-preferencia-stripe/index.ts`:

```typescript
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
});

const PRICE_IDS: Record<number, string> = {
  1: "price_MODULO1_ID",  // substituir pelos price_id reais do Stripe
  2: "price_MODULO2_ID",
  3: "price_MODULO3_ID",
  4: "price_MODULO4_ID",
  5: "price_MODULO5_ID",
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { modulo_id, user_id } = await req.json();

    const price_id = PRICE_IDS[modulo_id];
    if (!price_id) {
      return new Response(JSON.stringify({ error: "Módulo inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: price_id, quantity: 1 }],
      metadata: {
        user_id,
        modulo_id: String(modulo_id),
      },
      success_url: `${Deno.env.get("SITE_URL")}/painel?pago=exitoso`,
      cancel_url: `${Deno.env.get("SITE_URL")}/painel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

- [ ] **Step 3: Criar Edge Function `webhook-stripe`**

Criar `supabase/functions/webhook-stripe/index.ts`:

```typescript
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
});

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { user_id, modulo_id } = session.metadata!;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Registar pagamento
    await supabase.from("pagamentos").insert({
      user_id,
      modulo_id: parseInt(modulo_id),
      stripe_session_id: session.id,
      status: "approved",
      valor: (session.amount_total ?? 0) / 100,
      moeda: session.currency,
    });

    // Liberar módulo
    await supabase.from("modulos_liberados").upsert({
      user_id,
      modulo_id: parseInt(modulo_id),
      liberado_em: new Date().toISOString(),
      expira_em: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

- [ ] **Step 4: Adicionar Supabase Secrets**

```bash
supabase secrets set --project-ref SEU_PROJECT_REF STRIPE_SECRET_KEY=sk_live_XXXXX
supabase secrets set --project-ref SEU_PROJECT_REF STRIPE_WEBHOOK_SECRET=whsec_XXXXX
supabase secrets set --project-ref SEU_PROJECT_REF SITE_URL=https://dejadejugar.com
```

- [ ] **Step 5: Deploy das Edge Functions**

```bash
supabase functions deploy criar-preferencia-stripe --project-ref SEU_PROJECT_REF
supabase functions deploy webhook-stripe --project-ref SEU_PROJECT_REF
```

- [ ] **Step 6: Configurar webhook no Stripe Dashboard**

Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://SEU_PROJECT.supabase.co/functions/v1/webhook-stripe`
- Events: `checkout.session.completed`
- Guardar o `Signing secret` (whsec_XXXXX) → usar no Step 4

- [ ] **Step 7: Actualizar price_ids na Edge Function**

Editar `supabase/functions/criar-preferencia-stripe/index.ts` — substituir os `price_MODULO1_ID` etc. pelos price_ids reais copiados do Stripe Dashboard no Step 1.

Re-deploy:
```bash
supabase functions deploy criar-preferencia-stripe --project-ref SEU_PROJECT_REF
```

- [ ] **Step 8: Commit**

```powershell
git add supabase/functions/
git commit -m "feat: Edge Functions Stripe (checkout + webhook)"
```

---

## Task 14: Vercel Deploy + Domínio

- [ ] **Step 1: Criar repositório GitHub**

```powershell
cd "C:\Users\corretora1000_00\Desktop\dejadejugar.com"
git remote add origin https://github.com/softiahouse/dejadejugar.git
git push -u origin main
```

> Criar o repositório `softiahouse/dejadejugar` no GitHub primeiro (privado).

- [ ] **Step 2: Criar projecto Vercel**

1. Aceder a [vercel.com](https://vercel.com) → New Project
2. Import from GitHub → `softiahouse/dejadejugar`
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

- [ ] **Step 3: Adicionar variáveis de ambiente no Vercel**

Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY = SEU_ANON_KEY
VITE_STRIPE_PUBLIC_KEY = pk_live_XXXXX
```

- [ ] **Step 4: Verificar que o build passa**

No Vercel Dashboard → Deployments → verificar que o build concluiu sem erros.

- [ ] **Step 5: Conectar domínio dejadejugar.com**

Vercel Dashboard → Project → Settings → Domains → Add `dejadejugar.com`:
1. Vercel fornece os DNS records (A e CNAME)
2. Aceder ao GoDaddy → DNS Management → adicionar os records fornecidos pelo Vercel
3. Aguardar propagação DNS (até 48h, normalmente <1h)

- [ ] **Step 6: Verificar site ao vivo**

Aceder a `https://dejadejugar.com` — site em espanhol, SSL activo, login funcional.

- [ ] **Step 7: Actualizar SITE_URL no Supabase**

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://dejadejugar.com`
- Redirect URLs: `https://dejadejugar.com/auth/callback`

- [ ] **Step 8: Teste end-to-end**

1. Criar conta nova em `https://dejadejugar.com/cadastrar`
2. Fazer login
3. Ir para `/painel`
4. Clicar "Comprar" no Módulo 1 → deve redirigir para Stripe Checkout
5. Completar pagamento com cartão de teste Stripe: `4242 4242 4242 4242`, qualquer data futura, qualquer CVC
6. Verificar que volta para `/painel?pago=exitoso`
7. Verificar que Módulo 1 aparece como disponível
8. Aceder ao Módulo 1 → Aula 1 → verificar conteúdo em espanhol
9. Testar Botón de Emergencia

- [ ] **Step 9: Commit final**

```powershell
git add .
git commit -m "feat: deploy Vercel + domínio dejadejugar.com configurado"
git push origin main
```

---

## Notas de Implementação

- **Stripe cartões de teste:** `4242 4242 4242 4242` (sucesso), `4000 0000 0000 9995` (recusado)
- **Sócios com acesso permanente:** inserir via SQL directo em `modulos_liberados` (5 módulos sem expiração)
- **Blog:** estrutura existe, conteúdo em ES a criar numa fase posterior
- **PDFs dos livros:** substituir pelos equivalentes em espanhol em `public/livros/`
