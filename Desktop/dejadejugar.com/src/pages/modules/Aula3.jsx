import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Aula3() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      supabase.from('user_progress').upsert({ user_id: user.id, module_id: 1, lesson_id: 3 })
    }
  }, [user])

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <Link to="/painel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Voltar ao Painel</Link>
        </div>
        <div style={{ background: 'var(--navy)', color: 'white', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.08em' }}>MÓDULO 1 · AULA 3</div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 38, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 12 }}>
          Reconhecendo os sinais de perda de controle
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 40 }}>
          Perceber cedo os sinais protege você, sua saúde e as pessoas que ama.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { num: '1', title: 'Um início discreto', body: 'O problema raramente começa com um “grande colapso”. Muitas vezes começa com pequenas apostas, curiosidade ou entretenimento após o trabalho. O sinal inicial é quando o jogo passa a ocupar espaço mental mesmo fora do aplicativo — pensamentos frequentes, planejamento de próximas jogadas ou leitura de placares o tempo todo.' },
            { num: '2', title: 'Sinais emocionais', body: 'Irritação quando não consegue jogar, ansiedade antes e durante as apostas, euforia rápida seguida de vazio, e sensação de que só o jogo “desliga” o estresse. Também podem aparecer humor deprimido após perdas e dificuldade de sentir prazer em outras atividades que antes eram gratificantes.' },
            { num: '3', title: 'Sinais comportamentais', body: 'Aumento do tempo e do dinheiro dedicados ao jogo, jogar mais do que pretendia, dificuldade em parar quando já decidiu parar, mentiras ou omissões sobre quanto joga, e abandono gradual de hobbies, estudos ou responsabilidades. Pegar o celular “só para conferir” dezenas de vezes ao dia também é um alerta.' },
            { num: '4', title: 'Sinais financeiros', body: 'Uso de dinheiro reservado para contas, empréstimos, cartões ou vendas de bens para continuar apostando; perseguição de perdas; sensação de que “falta pouco” para recuperar tudo. Mesmo quando há ganhos pontuais, o saldo ao longo do tempo tende a ser negativo e o estresse financeiro aumenta.' },
            { num: '5', title: 'Impacto nas relações', body: 'Discussões sobre dinheiro ou tempo ausente, distanciamento de parceiros, amigos e família, e sensação de isolamento. Quem ama pode expressar preocupação ou frustração — e o jogador pode interpretar isso como julgamento, o que aumenta a vergonha e o segredo.' },
            { num: '6', title: 'Fuga emocional', body: 'Usar o jogo para não sentir tédio, solidão, raiva ou tristeza. Quanto mais o jogo vira válvula de escape, mais outras áreas da vida perdem espaço para oferecer alívio saudável. Sem perceber, a pessoa fica dependente do ciclo de tensão → aposta → alívio momentâneo → culpa.' },
            { num: '7', title: 'Vergonha e silêncio', body: 'Muitas pessoas demoram a pedir ajuda por vergonha, medo de julgamento ou crença de que devem resolver sozinhas. O silêncio prolonga o sofrimento. Reconhecer os sinais e falar com alguém de confiança — ou buscar apoio profissional — é um ato de coragem, não de fraqueza.' },
          ].map(section => (
            <div key={section.num} className="card fade-up">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--navy)', color: 'white', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{section.num}</div>
                <div>
                  <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: 'var(--navy)', marginBottom: 12 }}>{section.title}</h3>
                  <p style={{ color: 'var(--text)', lineHeight: 1.8 }}>{section.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 16, padding: '28px 32px', marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>📓</span>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#0F766E' }}>Exercício da Aula 3</h3>
          </div>
          <p style={{ color: '#115E59', marginBottom: 16, lineHeight: 1.7 }}>Marque mentalmente quais sinais você já notou em si (sem autopunição):</p>
          {['Emocionais', 'Comportamentais', 'Financeiros', 'Nas relações'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ background: '#0D9488', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
              <p style={{ color: '#115E59', lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <Link to="/modulo/1/aula/2" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>← Aula anterior</Link>
          <Link to="/checkin" className="btn-primary">Ir ao Check-in ISTOP →</Link>
        </div>
      </div>
    </div>
  )
}
