import { useState } from 'react'
import { Link } from 'react-router-dom'

const questions = [
  { id: 1, text: 'Hoje pensei em apostar ou em recuperar dinheiro perdido?' },
  { id: 2, text: 'Estou sentindo vontade de jogar neste momento?' },
  { id: 3, text: 'Estou pensando que "uma aposta pode resolver ou recuperar minhas perdas"?' },
  { id: 4, text: 'Estou com alguma emoção difícil agora (ansiedade, tristeza, estresse) que me faz querer jogar?' },
  { id: 5, text: 'Eu reconheço que o jogo ativa o sistema de recompensa do cérebro e pode me prender no ciclo de apostas?' },
  { id: 6, text: 'Se eu apostar agora, isso pode trazer prejuízos financeiros ou emocionais para mim ou minha família?' },
  { id: 7, text: 'Estou disposto a adiar a aposta por pelo menos 15 minutos para recuperar o controle?' },
]

export default function CheckIn() {
  const [answers, setAnswers] = useState({})

  const simCount = Object.values(answers).filter(a => a === 'sim').length
  const answered = Object.keys(answers).length === questions.length

  const getRisk = () => {
    if (simCount <= 1) return { level: 'baixo', color: '#15803D', bg: '#F0FDF4', border: '#86EFAC', text: 'Baixo risco momentâneo. Continue atento.' }
    if (simCount <= 3) return { level: 'moderado', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: 'Atenção. Pode haver impulso de jogo. Use as técnicas aprendidas.' }
    return { level: 'alto', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '⚠️ Momento de risco. Ative o Protocolo de Interrupção ISTOP agora.' }
  }

  const risk = getRisk()

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link to="/painel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Voltar ao Painel</Link>

        <div style={{ textAlign: 'center', margin: '32px 0 40px' }}>
          <div style={{ background: 'var(--navy)', color: 'white', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>CHECK-IN ISTOP</div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 36, color: 'var(--navy)', marginBottom: 12 }}>Avaliação de risco momentâneo</h1>
          <p style={{ color: 'var(--text-muted)' }}>Respire fundo e responda com sinceridade — leva apenas 1 minuto.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {questions.map((q, i) => (
            <div key={q.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ background: 'var(--navy)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text)', paddingTop: 2 }}>{q.text}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingLeft: 40 }}>
                {['sim', 'nao'].map(val => (
                  <button key={val} type="button" onClick={() => setAnswers({...answers, [q.id]: val})}
                    style={{ padding: '10px 28px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, transition: 'all 0.15s',
                      borderColor: answers[q.id] === val ? (val === 'sim' ? 'var(--teal)' : '#9CA3AF') : 'var(--border)',
                      background: answers[q.id] === val ? (val === 'sim' ? '#F0FDFA' : '#F9FAFB') : 'white',
                      color: answers[q.id] === val ? (val === 'sim' ? 'var(--teal)' : '#374151') : 'var(--text-muted)'
                    }}
                  >
                    {val === 'sim' ? '✔ Sim' : '✕ Não'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {answered && (
          <div style={{ animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: risk.color }}>Resultado do Check-in</h3>
                <div style={{ background: risk.color, color: 'white', padding: '4px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                  {simCount} de 7 &quot;Sim&quot;
                </div>
              </div>
              <p style={{ color: risk.color, fontSize: 16, lineHeight: 1.6 }}>{risk.text}</p>
            </div>

            {simCount >= 4 && (
              <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: 'white', marginBottom: 16 }}>Protocolo de Interrupção ISTOP</h3>
                {['Afaste-se do celular ou aplicativo de apostas agora', 'Aguarde pelo menos 15 minutos sem abrir o app', 'Respire profundamente — inspire 4s, segure 4s, expire 4s', 'Após 15 minutos, repita o check-in'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--orange)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                    <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button type="button" onClick={() => setAnswers({})} className="btn-secondary" style={{ marginRight: 12 }}>Refazer Check-in</button>
              <Link to="/painel" className="btn-primary">Voltar ao Painel</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
