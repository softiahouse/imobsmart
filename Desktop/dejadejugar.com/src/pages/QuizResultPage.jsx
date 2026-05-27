import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getLevel, getResultMessage } from '../quiz/resultLevels'
import '../quiz/quiz.css'

export default function QuizResultPage() {
  const location = useLocation()
  const { user } = useAuth()
  const state = location.state
  const score = state && typeof state.score === 'number' ? state.score : null
  const quizType = state?.quizType === 'family' ? 'family' : 'personal'
  const isFamilia = quizType === 'family'

  const [fillPct, setFillPct] = useState(0)

  useEffect(() => {
    if (score == null) return
    const t = setTimeout(() => {
      setFillPct(Math.min(100, Math.max(0, (score / 48) * 100)))
    }, 80)
    return () => clearTimeout(t)
  }, [score])

  if (score == null) {
    return <Navigate to="/quiz" replace />
  }

  const level = getLevel(score)
  const message = getResultMessage(level.key, quizType)

  const textoWhats = encodeURIComponent(
    quizType === 'family'
      ? 'Encontré esto y pensé en ti.\n\nEs un test rápido sobre apuestas — confidencial, sin presión, sin juicios.\n\nSi tiene sentido, échale un vistazo cuando puedas 👉 dejadejugar.com'
      : 'Hice un test sobre apuestas y me pareció importante compartirlo.\n\nEs rápido, confidencial y sin presión.\n\nSi también te hace sentido, échale un vistazo 👉 dejadejugar.com'
  )
  const whatsUrl = `https://wa.me/?text=${textoWhats}`

  return (
    <div className="result-shell">
      <div className="result-inner">
        <h1 className="result-title">
          {quizType === 'family' ? 'Indicador de tu familiar' : 'Tu resultado'}
        </h1>
        <p className="result-score-line">
          {quizType === 'family'
            ? <>Puntuación indicada: <strong>{score}</strong> de 48 · basado en tu percepción</>
            : <>Puntuación: <strong>{score}</strong> de 48 · autoevaluación</>
          }
        </p>

        <div className="result-thermo-wrap">
          <div className="result-thermometer" aria-hidden>
            <div
              className="result-thermometer-fill"
              style={{
                height: `${fillPct}%`,
                background: `linear-gradient(180deg, ${level.color} 0%, ${level.color}cc 100%)`,
                transition: 'height 1.15s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            />
          </div>
        </div>

        <div className="result-level-badge" style={{ background: level.color }}>
          {level.label}
        </div>

        <p className="result-text">{message}</p>

        <div className="result-cta">
          <a
            href={whatsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#25D366',
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.533 5.862L.057 23.428a.5.5 0 0 0 .609.61l5.652-1.48A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.371l-.361-.214-3.733.978.997-3.645-.236-.374A9.862 9.862 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z" />
            </svg>
            Compartir resultado por WhatsApp
          </a>

          {user && (
            <Link
              to="/painel"
              className="btn-primary"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 12,
                display: 'block',
                textAlign: 'center',
                background: '#1A3A6B',
                textDecoration: 'none',
              }}
            >
              Ir al panel →
            </Link>
          )}
        </div>

        {quizType === 'family' && (
          <div style={{
            marginTop: 48,
            maxWidth: 640,
            textAlign: 'left',
            fontFamily: "'DM Sans', sans-serif",
            color: '#5F5E5A',
            lineHeight: 1.75,
          }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#2C2C2A', marginBottom: 24 }}>
              Guía para familiares de personas con problemas con el juego online
            </h2>

            {[
              {
                titulo: '1. Entendiendo el problema',
                texto: 'El juego puede empezar como entretenimiento, pero en algunas personas pasa a ocupar un espacio cada vez mayor en la vida. La medicina reconoce que el juego compulsivo puede convertirse en un trastorno — el trastorno del juego. En este proceso se produce una activación intensa del sistema de recompensa del cerebro. La expectativa de ganar, incluso ante la pérdida, puede generar repetición del comportamiento. Por eso muchas personas dicen que van a parar y acaban volviendo a apostar. No se trata solo de falta de carácter o fuerza de voluntad — existe un proceso psicológico y conductual implicado. Comprenderlo ayuda a la familia a manejar la situación de forma más consciente.',
              },
              {
                titulo: '2. Cómo el juego suele afectar a la familia',
                texto: 'Cuando el juego se convierte en un problema, raramente solo le afecta a quien juega. Muchos familiares relatan preocupación constante por el dinero, pérdida de confianza en casa, discusiones frecuentes, tensión emocional y sensación de estar siempre intentando controlar la situación. Este desgaste puede generar ansiedad, tristeza e impotencia. Reconocer este impacto es importante para que la familia también busque apoyo.',
              },
              {
                titulo: '3. Algo importante que recordar',
                texto: 'Muchos familiares se preguntan: "¿Seré yo la causa de esto?" El desarrollo de un comportamiento compulsivo implica varios factores — características individuales, contexto emocional, facilidad de acceso y factores sociales. La familia no es responsable del problema. Pero puede tener un papel importante en el proceso de recuperación.',
              },
              {
                titulo: '4. Comportamientos que pueden empeorar la situación',
                texto: 'Muchas veces, intentando ayudar, el familiar acaba reforzando el problema sin darse cuenta. Pagar deudas repetidamente, prestar dinero esperando que sea la última vez, ocultar el problema o asumir responsabilidades financieras que eran del jugador — este proceso se llama facilitación involuntaria. La intención es ayudar, pero el efecto puede ser el contrario.',
              },
              {
                titulo: '5. Lo que puede ayudar de forma más saludable',
                texto: 'Algunas actitudes contribuyen a enfrentar el problema de forma más constructiva: establecer límites claros en relación al dinero, evitar financiar el comportamiento de juego, animar a buscar ayuda profesional, mantener un diálogo respetuoso sin acusaciones constantes y reconocer pequeños cambios positivos. Los cambios duraderos ocurren de forma gradual, con reorganización de hábitos y rutinas.',
              },
              {
                titulo: '6. Cuidarte también es importante',
                texto: 'Muchos familiares acaban viviendo solo en función del problema del otro — y esto genera un desgaste emocional intenso, ansiedad constante y sensación de haber perdido la propia vida. Cuidarte no significa abandonar al otro. Significa preservar tu propia salud emocional: hablar con personas de confianza, buscar orientación profesional, participar en grupos de apoyo y mantener actividades personales.',
              },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 18, color: '#2C2C2A',
                  marginBottom: 10,
                }}>
                  {s.titulo}
                </h3>
                <p style={{ fontSize: 15 }}>{s.texto}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bloco para familiares — enviar resultado pelo WhatsApp */}
        {isFamilia && (
          <div style={{
            maxWidth: 620,
            margin: "2.5rem auto 0",
            background: "#F0F4FF",
            border: "1px solid #D8DFF0",
            borderRadius: 16,
            padding: "2rem",
            fontFamily: "DM Sans, sans-serif",
          }}>
            <h3 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.3rem",
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}>
              El próximo paso puede ser una conversación
            </h3>
            <p style={{ color: "#444", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
              Acabas de completar una evaluación importante. Compartir este resultado puede ser el inicio de una conversación transformadora — no para acusar ni juzgar, sino para invitar a la reflexión sobre el bienestar y la calidad de vida.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, color: "#1A3A6B", marginBottom: "0.6rem", fontSize: "0.9rem" }}>
                Antes de enviar, reflexiona:
              </p>
              {[
                "Elige un momento tranquilo, sin interrupciones ni estrés inmediato.",
                "Usa el lenguaje del 'Yo': en vez de 'Estás enganchado', prueba 'Me preocupa que el juego esté afectando tu descanso'.",
                "Céntrate en la preocupación, no en el control — deja claro que tu motivación es el cuidado.",
                "Prepárate para escuchar: la persona puede reaccionar con negación. Mantén la calma.",
                "Evita ultimátums: frases como 'o paras, o…' tienden a generar resistencia.",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#1A3A6B", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fff",
              border: "1px solid #D8DFF0",
              borderRadius: 10,
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              fontSize: "0.88rem",
              color: "#333",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}>
              "Hola, [Nombre]. Hice una evaluación sobre hábitos de juego que me hizo reflexionar. El resultado trajo algunos puntos que me parecieron importantes y me gustaría compartirlos contigo — sin juicios. Si quieres verlo y hablar cuando puedas, estoy aquí para ti."
            </div>

            <p style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              ⚠️ Este test es una herramienta educativa y no sustituye el diagnóstico profesional. En caso de crisis emocional, llama al Teléfono de la Esperanza: <strong>717 003 717</strong>.
            </p>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `¡Hola! Hice una evaluación sobre hábitos de juego en DejaDeJugar y el resultado me hizo reflexionar sobre algo importante.\n\nMe gustaría compartirlo contigo — sin juicios, solo con cuidado.\n\n👉 Accede: https://dejadejugar.com/quiz\n\n"Cuando el juego deja de ser diversión y empieza a controlar la vida, existe un camino de vuelta. Y empieza con una conversación."\n\nSi quieres hablar cuando puedas, estoy aquí para ti.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "#25D366",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.9rem",
                borderRadius: 10,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              Pensé en ti al ver esto. Vale la pena echarle un vistazo
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
