import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Aula2() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      supabase.from('user_progress').upsert({ user_id: user.id, module_id: 1, lesson_id: 2 })
    }
  }, [user])

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <Link to="/painel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Voltar ao Painel</Link>
        </div>
        <div style={{ background: 'var(--navy)', color: 'white', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.08em' }}>MÓDULO 1 · AULA 2</div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 38, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 12 }}>
          O ciclo psicológico do jogador
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 40 }}>
          Entender o padrão mental ajuda a reconhecer o ciclo antes que ele se feche de novo.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { num: '1', title: 'A excitação inicial', body: 'Antes da aposta, surge um estado de alerta e expectativa: o corpo se prepara para a possibilidade de ganho. Essa fase pode ser agradável e até parecer inofensiva — mas já ativa o sistema de recompensa e antecipa o prazer. Muitas vezes a pessoa minimiza essa fase e não a associa ao risco, embora ela seja a porta de entrada do ciclo.' },
            { num: '2', title: 'A ilusão de controle', body: 'Durante o jogo, é comum acreditar que existe estratégia, intuição ou “feeling” que podem vencer o acaso. Essa ilusão de controle faz o jogador apostar mais tempo e mais dinheiro do que pretendia. Na prática, os jogos são desenhados para que o resultado final favoreça a casa — mas o cérebro interpreta pequenas vitórias como prova de habilidade.' },
            { num: '3', title: 'A tentativa de recuperar perdas', body: 'Após perdas, surge a urgência de “recuperar” o que foi perdido — a chamada perseguição de prejuízos. Essa fase mistura culpa, esperança e medo. Cada nova aposta parece uma chance de corrigir o erro anterior, mas costuma aprofundar o buraco financeiro e emocional. É um dos pontos mais perigosos do ciclo.' },
            { num: '4', title: 'Culpa e sofrimento', body: 'Quando a sessão termina — muitas vezes com prejuízo — aparecem culpa, vergonha e autocrítica. A pessoa pode prometer a si mesma que não vai repetir, enquanto ainda está emocionalmente exausta. Essa dor é real e merece acolhimento; não é falta de caráter, e sim consequência de um padrão repetido e neurologicamente reforçado.' },
            { num: '5', title: 'A fuga emocional', body: 'Para aliviar o desconforto da culpa ou do vazio, o cérebro pode sugerir de novo o jogo como “solução rápida” de alívio. Apostar volta a parecer uma saída para tensão, tédio ou tristeza — fechando o ciclo. Sem perceber, a pessoa troca um problema por outro, e o jogo deixa de ser diversão e passa a ser estratégia de regulação emocional.' },
            { num: '6', title: 'O ciclo completo', body: 'Excitação → ilusão de controle → perdas → tentativa de recuperar → culpa → fuga no jogo: esse loop pode se repetir por meses ou anos. Reconhecer cada fase com honestidade é o primeiro passo para interromper o ciclo no meio — por exemplo, na fase da excitação ou da culpa, antes da próxima aposta. Você não está condenado a repetir esse roteiro para sempre.' },
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

        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 16, padding: '28px 32px', marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>📓</span>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#1E3A8A' }}>Exercício da Aula 2</h3>
          </div>
          <p style={{ color: '#1E40AF', marginBottom: 16, lineHeight: 1.7 }}>Descreva uma rodada recente (sem julgar) e identifique em qual fase do ciclo você estava:</p>
          {['O que sentiu antes de apostar?', 'O que pensou durante?', 'Como se sentiu depois?'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ background: '#1D4ED8', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
              <p style={{ color: '#1E3A8A', lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <Link to="/modulo/1/aula/1" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>← Aula anterior</Link>
          <Link to="/modulo/1/aula/3" className="btn-primary">Próxima Aula →</Link>
        </div>
      </div>
    </div>
  )
}
