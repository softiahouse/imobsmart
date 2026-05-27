import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const lessons = [
  { id: 1, moduleId: 1, title: 'O vício invisível', subtitle: 'Quando o jogo deixa de ser diversão', path: '/modulo/1/aula/1', icon: '🧠' },
  { id: 2, moduleId: 1, title: 'O ciclo psicológico', subtitle: 'O padrão mental do jogador', path: '/modulo/1/aula/2', icon: '🔄' },
  { id: 3, moduleId: 1, title: 'Reconhecendo os sinais', subtitle: 'Identificando a perda de controle', path: '/modulo/1/aula/3', icon: '🚨' },
  { id: 4, moduleId: 1, title: 'Check-in ISTOP', subtitle: 'Avaliação de risco momentâneo', path: '/checkin', icon: '✅', special: true },
]

const glassRow = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.9)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [contract, setContract] = useState(null)
  const [progress, setProgress] = useState([])
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'participante'

  useEffect(() => {
    if (!user) return
    supabase.from('contracts').select('*').eq('user_id', user.id).single().then(({ data }) => setContract(data))
    supabase.from('user_progress').select('*').eq('user_id', user.id).then(({ data }) => setProgress(data || []))
  }, [user])

  const isCompleted = (moduleId, lessonId) => progress.some(p => p.module_id === moduleId && p.lesson_id === lessonId)

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px 80px', background: 'transparent' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 'clamp(30px, 4vw, 38px)', color: 'var(--navy)', marginBottom: 8, fontWeight: 600 }}>
            Olá, {name} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Continue sua jornada de recuperação</p>
        </div>

        {!contract && (
          <div
            style={{
              borderRadius: 22,
              padding: '28px 32px',
              marginBottom: 32,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
              background: 'linear-gradient(135deg, rgba(27,53,88,0.95) 0%, rgba(38,69,115,0.92) 100%)',
              boxShadow: '0 12px 40px rgba(27,53,88,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600, marginBottom: 6, letterSpacing: '0.08em' }}>PASSO IMPORTANTE</div>
              <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: 'white', marginBottom: 6, fontWeight: 600 }}>Assine seu Contrato de Interrupção</h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.55 }}>Antes de iniciar as aulas, faça seu compromisso consigo mesmo.</p>
            </div>
            <Link to="/contrato" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Assinar Agora →</Link>
          </div>
        )}

        {contract && (
          <div
            style={{
              ...glassRow,
              padding: '20px 24px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              border: '1px solid rgba(134, 239, 172, 0.5)',
              background: 'rgba(240, 253, 244, 0.85)',
            }}
          >
            <div
              className="icon-circle"
              style={{ width: 48, height: 48, fontSize: 22, background: 'linear-gradient(145deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))' }}
            >
              ✅
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#15803D', fontSize: 15 }}>Contrato assinado em {new Date(contract.signed_at).toLocaleDateString('pt-BR')}</p>
              <p style={{ color: '#16A34A', fontSize: 13, marginTop: 4 }}>&quot;{contract.signed_name}&quot; — você assumiu o compromisso. Continue firme.</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div
              style={{
                background: 'rgba(27,53,88,0.1)',
                color: 'var(--navy)',
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              MÓDULO 1
            </div>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: 'var(--navy)', fontWeight: 600 }}>Interrupção</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {lessons.map(lesson => {
              const completed = isCompleted(lesson.moduleId, lesson.id)
              const borderColor = completed ? 'rgba(26, 107, 114, 0.35)' : lesson.special ? 'rgba(224, 123, 53, 0.35)' : 'rgba(255,255,255,0.9)'
              return (
                <Link key={lesson.id} to={lesson.path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      ...glassRow,
                      padding: '22px 24px',
                      border: `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(4px)'
                      e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: lesson.special
                          ? 'linear-gradient(145deg, rgba(255,247,237,0.95), rgba(254,215,170,0.5))'
                          : 'linear-gradient(145deg, rgba(239,246,255,0.95), rgba(219,234,254,0.5))',
                        border: '1px solid rgba(255,255,255,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        flexShrink: 0,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      }}
                    >
                      {completed ? '✅' : lesson.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--navy)', marginBottom: 4 }}>{lesson.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{lesson.subtitle}</div>
                    </div>
                    <div style={{ color: lesson.special ? 'var(--orange)' : 'var(--navy)', fontWeight: 600, fontSize: 20, opacity: 0.85 }}>→</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {['Sensibilização', 'Transformação', 'Organização', 'Prevenção'].map((mod, i) => (
          <div
            key={mod}
            style={{
              ...glassRow,
              padding: '22px 24px',
              marginBottom: 12,
              opacity: 0.65,
              border: '1px dashed rgba(0,0,0,0.12)',
              background: 'rgba(255,255,255,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  background: 'rgba(243,244,246,0.95)',
                  borderRadius: 12,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                MÓDULO {i + 2}
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{mod}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  background: 'rgba(243,244,246,0.95)',
                  padding: '6px 12px',
                  borderRadius: 100,
                  fontWeight: 600,
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                Em breve
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
