import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Aula1() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      supabase.from('user_progress').upsert({ user_id: user.id, module_id: 1, lesson_id: 1 })
    }
  }, [user])

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '60px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <Link to="/painel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Voltar ao Painel</Link>
        </div>
        <div style={{ background: 'var(--navy)', color: 'white', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.08em' }}>MÓDULO 1 · AULA 1</div>
        <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 38, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 12 }}>
          O vício invisível: quando o jogo deixa de ser diversão
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 40 }}>
          O primeiro passo para interromper o ciclo do jogo não é força de vontade — é compreensão.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { num: '1', title: 'O jogo online não é apenas entretenimento', body: 'A ciência moderna mostra que o jogo pode ativar os mesmos mecanismos cerebrais envolvidos nas dependências químicas. No cérebro humano existe um sistema chamado circuito de recompensa, responsável por gerar sensação de prazer e motivação. Quando algo é percebido como recompensador, o cérebro libera dopamina — o neurotransmissor ligado ao prazer e à expectativa de recompensa. O problema surge quando esse sistema é estimulado de forma artificial e repetitiva.' },
            { num: '2', title: 'O cérebro do jogador', body: 'Nos jogos online e aplicativos de apostas, pequenas vitórias, quase acertos e recompensas inesperadas liberam dopamina em doses sucessivas. Cada clique pode produzir uma nova expectativa de recompensa. Com o tempo, o comportamento deixa de ser apenas escolha consciente e passa a ser condicionado neurologicamente. O cérebro aprende que apostar pode trazer prazer.' },
            { num: '3', title: 'O reforço intermitente: o mecanismo que prende o jogador', body: 'Um dos fatores mais poderosos é o chamado reforço intermitente. A recompensa aparece de forma imprevisível — às vezes a pessoa ganha, às vezes perde. E justamente essa imprevisibilidade faz o comportamento se tornar extremamente difícil de interromper. O cérebro permanece esperando que a próxima tentativa seja a vencedora. É o mesmo princípio utilizado em máquinas caça-níqueis.' },
            { num: '4', title: 'Quando o prazer desaparece e sobra a compulsão', body: 'Com a repetição ocorre a adaptação dopaminérgica: o prazer diminui, mas o impulso de continuar aumenta. Nesse momento o comportamento deixa de ser busca de prazer e passa a ser tentativa de aliviar ansiedade ou recuperar perdas. A pessoa continua jogando não porque está feliz, mas porque não consegue parar.' },
            { num: '5', title: 'A armadilha do "quase ganhar"', body: 'Os jogos exploram um mecanismo poderoso: o quase acerto. Quase acertar um placar, quase ganhar um prêmio — esses eventos ativam o cérebro de forma semelhante à vitória real. O jogador sente que está perto de ganhar, o que reforça a crença: "na próxima tentativa eu consigo." Esse mecanismo mantém o jogador preso no ciclo.' },
            { num: '6', title: 'Por que parar se torna tão difícil', body: 'Quando o jogador tenta parar, o cérebro pode reagir com irritação, ansiedade, inquietação e sensação de vazio. Essas reações não significam fraqueza moral — elas refletem alterações reais no sistema de recompensa cerebral. Por isso o vício em jogos online deve ser tratado com a mesma seriedade que outras formas de dependência.' },
            { num: '7', title: 'Uma droga dentro do bolso', body: 'Diferente dos cassinos tradicionais, os jogos digitais possuem três características que aumentam o risco: acesso permanente pelo celular, estímulos visuais e notificações constantes, e recompensas rápidas e frequentes. Isso cria uma situação inédita na história humana: um cassino disponível 24 horas por dia no bolso. A aposta está sempre a um clique de distância.' },
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

        {/* Exercício */}
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 16, padding: '28px 32px', marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>📓</span>
            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: '#9A3412' }}>Exercício da Aula 1</h3>
          </div>
          <p style={{ color: '#7C2D12', marginBottom: 16, lineHeight: 1.7 }}>Durante os próximos dias observe e anote:</p>
          {['Quando surge vontade de apostar', 'O que você está sentindo naquele momento', 'Qual situação desencadeou o impulso'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ background: '#9A3412', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
              <p style={{ color: '#7C2D12', lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <Link to="/painel" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>← Painel</Link>
          <Link to="/modulo/1/aula/2" className="btn-primary">Próxima Aula →</Link>
        </div>
      </div>
    </div>
  )
}
