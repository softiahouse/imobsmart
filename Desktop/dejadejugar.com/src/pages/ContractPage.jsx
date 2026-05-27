import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const commitments = [
  { id: 'c1', text: 'Reconheço que o jogo online pode gerar perda de controle e prejuízos financeiros, emocionais e familiares.' },
  { id: 'c2', text: 'Reconheço que tentar recuperar perdas apostando novamente costuma aprofundar o problema.' },
  { id: 'c3', text: 'Reconheço que interromper o ciclo exige consciência, prática e apoio.' },
  { id: 'c4', text: 'Estou disposto a observar meu comportamento de jogo com honestidade.' },
  { id: 'c5', text: 'Quando sentir vontade intensa de apostar, me comprometo a fazer uma pausa mínima de 15 minutos antes de qualquer decisão.' },
  { id: 'c6', text: 'Estou disposto a utilizar as ferramentas do programa para apoiar minha mudança.' },
]

const pageBg = {
  background: 'linear-gradient(165deg, var(--page-bg-start) 0%, var(--page-bg-end) 100%)',
  minHeight: '100vh',
}

export default function ContractPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checked, setChecked] = useState({})
  const [signedName, setSignedName] = useState('')
  const [loading, setLoading] = useState(false)
  const [signed, setSigned] = useState(false)
  const [existingContract, setExistingContract] = useState(null)

  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const allChecked = commitments.every(c => checked[c.id])

  useEffect(() => {
    if (user) {
      supabase.from('contracts').select('*').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setExistingContract(data) })
    }
  }, [user])

  const handleSign = async () => {
    if (!allChecked || !signedName.trim()) return
    setLoading(true)
    const { error } = await supabase.from('contracts').upsert({
      user_id: user.id,
      signed_name: signedName.trim(),
      signed_at: new Date().toISOString()
    })
    if (!error) setSigned(true)
    setLoading(false)
  }

  if (existingContract && !signed) return (
    <div style={{ ...pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 560, textAlign: 'center', borderRadius: 22, padding: '48px 36px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 32, color: 'var(--navy)', marginBottom: 12 }}>Contrato já assinado</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontSize: 15 }}>Assinado por: <strong style={{ color: 'var(--navy)' }}>{existingContract.signed_name}</strong></p>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 15 }}>
          Em: {new Date(existingContract.signed_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <button type="button" onClick={() => navigate('/painel')} className="btn-primary">Ir para o Programa</button>
      </div>
    </div>
  )

  if (signed) return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(155deg, #0f2744 0%, #1B3558 45%, #0d1f35 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center', animation: 'fadeUp 0.8s ease both' }}>
        <div style={{ fontSize: 72, marginBottom: 24, animation: 'pulse 2s ease infinite' }}>🌟</div>
        <h1
          className="hero-title-gradient"
          style={{ fontFamily: 'DM Serif Display', fontSize: 'clamp(32px, 5vw, 42px)', marginBottom: 24, lineHeight: 1.2, fontWeight: 600 }}
        >
          Hoje começa seu processo de recuperação do controle.
        </h1>
        <div
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 22,
            padding: '28px 32px',
            marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, lineHeight: 1.75, fontStyle: 'italic' }}>
            &quot;Você tomou a decisão mais importante: escolher se mesmo. O cérebro pode aprender novos caminhos, e você acabou de dar o primeiro passo.&quot;
          </p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 8, fontSize: 15 }}>Assinado por: <strong style={{ color: 'white' }}>{signedName}</strong></p>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32, fontSize: 14 }}>{today}</p>
        <button type="button" onClick={() => navigate('/painel')} className="btn-primary" style={{ fontSize: 17, padding: '15px 36px' }}>
          Iniciar Módulo 1 →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ ...pageBg, padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(27,53,88,0.08)',
              color: 'var(--navy)',
              padding: '8px 18px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 22,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span>📋</span> Contrato de Interrupção — Método ISTOP
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 'clamp(32px, 4vw, 42px)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: 16 }}>
            Um compromisso consigo mesmo
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Este não é um contrato externo. É uma decisão consciente de recuperar o controle da sua própria vida.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(238, 242, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(199, 210, 254, 0.6)',
            borderRadius: 20,
            padding: '26px 28px',
            marginBottom: 28,
            boxShadow: '0 8px 28px rgba(99, 102, 241, 0.08)',
          }}
        >
          <p style={{ color: '#4338CA', lineHeight: 1.8, fontSize: 15 }}>
            O jogo online pode criar um ciclo de impulsos, perdas e tentativas de recuperação que muitas vezes ocorre de forma automática.
            Interromper esse ciclo exige mais do que informação — exige uma <strong>decisão consciente</strong>.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 24, borderRadius: 22 }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: 'var(--navy)', marginBottom: 12 }}>Declaração de compromisso</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 22 }}>Leia cada item com atenção e marque quando estiver pronto:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {commitments.map((c, i) => (
              <label
                key={c.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  cursor: 'pointer',
                  padding: '16px 18px',
                  borderRadius: 18,
                  border: `1px solid ${checked[c.id] ? 'rgba(26, 107, 114, 0.35)' : 'rgba(0,0,0,0.08)'}`,
                  background: checked[c.id] ? 'rgba(240, 253, 250, 0.95)' : 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s ease',
                  boxShadow: checked[c.id] ? '0 4px 16px rgba(26, 107, 114, 0.12)' : 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checked[c.id]}
                  onChange={e => setChecked({...checked, [c.id]: e.target.checked})}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--teal)', flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 15, lineHeight: 1.65, color: checked[c.id] ? 'var(--teal)' : 'var(--text)' }}>
                  <strong style={{ color: 'var(--text-muted)', fontSize: 12 }}>✓ {i + 1}. </strong>
                  {c.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 36, borderRadius: 22 }}>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: 'var(--navy)', marginBottom: 8 }}>Assinatura</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Digite seu nome completo para registrar este compromisso:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--navy)' }}>Seu nome</label>
              <input className="input" type="text" value={signedName} onChange={e => setSignedName(e.target.value)} placeholder="Digite seu nome completo" style={{ fontSize: 16 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--navy)' }}>Data</label>
              <div
                className="input"
                style={{
                  background: 'rgba(249, 250, 251, 0.95)',
                  color: 'var(--text-muted)',
                  cursor: 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                {today}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          {!allChecked && <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Marque todos os itens acima para continuar</p>}
          {allChecked && !signedName.trim() && <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Digite seu nome para assinar</p>}
          <button
            type="button"
            onClick={handleSign}
            disabled={!allChecked || !signedName.trim() || loading}
            className="btn-primary"
            style={{
              fontSize: 17,
              padding: '16px 44px',
              opacity: (!allChecked || !signedName.trim()) ? 0.45 : 1,
              cursor: (!allChecked || !signedName.trim()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {loading ? 'Registrando...' : '✨ Aceito iniciar o processo'}
          </button>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 14 }}>Este ato simbólico marca o início da sua mudança.</p>
        </div>
      </div>
    </div>
  )
}
