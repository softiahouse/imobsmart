import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const BLOCOS = [
  {
    id: 1, modulo: "Módulo 1 — Interrupção", cor: "#C0392B",
    perguntas: [
      { texto: "Estou sentindo um impulso forte agora mesmo.", tipo: "Sim/Não" },
      { texto: "Já tentei recuperar perdas apostando mais nas últimas 24 horas.", tipo: "V/F" },
      { texto: "Estou apostando escondido de alguém importante para mim.", tipo: "Sim/Não" },
      { texto: "Sinto que o jogo está controlando minhas decisões hoje.", tipo: "V/F" },
      { texto: "Já usei dinheiro que precisava para outras coisas essenciais.", tipo: "Sim/Não" },
      { texto: "Estou tentando provar algo para mim mesmo ou para outros através do jogo.", tipo: "V/F" },
      { texto: "Sinto ansiedade quando penso em não apostar agora.", tipo: "Sim/Não" },
      { texto: "Já menti sobre quanto tempo ou dinheiro gastei jogando.", tipo: "V/F" },
      { texto: "Estou jogando para fugir de um problema ou emoção difícil.", tipo: "Sim/Não" },
      { texto: "Acredito que \"desta vez vai ser diferente\".", tipo: "V/F" },
      { texto: "Estou sentindo culpa por minhas apostas recentes.", tipo: "Sim/Não" },
      { texto: "Já cancelei ou adiei compromissos importantes para jogar.", tipo: "V/F" },
      { texto: "Estou apostando valores cada vez maiores para sentir a mesma emoção.", tipo: "Sim/Não" },
      { texto: "Penso no jogo mesmo quando não estou jogando.", tipo: "V/F" },
      { texto: "Já pedi dinheiro emprestado para continuar jogando.", tipo: "Sim/Não" },
      { texto: "Sinto que perdi o controle sobre minhas apostas.", tipo: "V/F" },
      { texto: "Estou ignorando sinais de alerta que reconheço.", tipo: "Sim/Não" },
      { texto: "Já tentei parar e não consegui sozinho.", tipo: "V/F" },
      { texto: "Estou justificando o jogo como \"apenas diversão\" agora.", tipo: "Sim/Não" },
      { texto: "Preciso de uma pausa consciente de 15 minutos antes de qualquer ação.", tipo: "V/F" },
    ],
  },
  {
    id: 2, modulo: "Módulo 2 — Sensibilização", cor: "#D35400",
    perguntas: [
      { texto: "Consigo identificar qual emoção estou sentindo agora.", tipo: "Sim/Não" },
      { texto: "Estou apostando porque estou entediado.", tipo: "V/F" },
      { texto: "Estou apostando porque estou estressado.", tipo: "Sim/Não" },
      { texto: "Estou apostando porque me sinto sozinho.", tipo: "V/F" },
      { texto: "Estou apostando porque estou comemorando algo.", tipo: "Sim/Não" },
      { texto: "Estou apostando porque estou frustrado com algo.", tipo: "V/F" },
      { texto: "Recebi algum gatilho externo (propaganda, notificação) nos últimos 30 minutos.", tipo: "Sim/Não" },
      { texto: "Estou tentando aliviar uma tensão emocional através do jogo.", tipo: "V/F" },
      { texto: "Já identifiquei meus principais gatilhos emocionais.", tipo: "Sim/Não" },
      { texto: "Estou apostando para evitar pensar em algo difícil.", tipo: "V/F" },
      { texto: "Consigo nomear o que estou sentindo sem julgar.", tipo: "Sim/Não" },
      { texto: "Estou confundindo tédio com necessidade de jogar.", tipo: "V/F" },
      { texto: "Estou confundindo ansiedade com \"sorte próxima\".", tipo: "Sim/Não" },
      { texto: "Já mapeei quais horários do dia sou mais vulnerável.", tipo: "V/F" },
      { texto: "Estou apostando porque vi alguém falando sobre isso.", tipo: "Sim/Não" },
      { texto: "Reconheço que estou no pico da curva do impulso agora.", tipo: "V/F" },
      { texto: "Estou tentando preencher um vazio emocional com o jogo.", tipo: "Sim/Não" },
      { texto: "Já identifiquei padrões repetitivos no meu comportamento.", tipo: "V/F" },
      { texto: "Estou consciente de que o impulso vai passar naturalmente.", tipo: "Sim/Não" },
      { texto: "Preciso registrar este momento no meu Mapa de Gatilhos.", tipo: "V/F" },
    ],
  },
  {
    id: 3, modulo: "Módulo 3 — Autorregulação", cor: "#1A6B8A",
    perguntas: [
      { texto: "Já se passaram 15 minutos desde que senti o impulso?", tipo: "Sim/Não" },
      { texto: "Respirei profundamente 3 vezes antes de decidir.", tipo: "V/F" },
      { texto: "Consegui observar o impulso sem agir imediatamente.", tipo: "Sim/Não" },
      { texto: "Lembrei que o impulso tem pico e depois diminui.", tipo: "V/F" },
      { texto: "Usei alguma técnica de distração nos últimos 10 minutos.", tipo: "Sim/Não" },
      { texto: "Conversei com alguém sobre o que estou sentindo.", tipo: "V/F" },
      { texto: "Já tomei decisões diferentes em momentos semelhantes antes.", tipo: "Sim/Não" },
      { texto: "Sei que posso escolher não agir mesmo sentindo o impulso.", tipo: "V/F" },
      { texto: "Já pratiquei a pausa consciente hoje.", tipo: "Sim/Não" },
      { texto: "Consegui identificar a diferença entre impulso e decisão.", tipo: "V/F" },
      { texto: "Já usei o Contrato de Interrupção antes.", tipo: "Sim/Não" },
      { texto: "Estou disposto a esperar mais 15 minutos antes de decidir.", tipo: "V/F" },
      { texto: "Já fiz algo prático para me distrair (caminhar, ler, ligar).", tipo: "Sim/Não" },
      { texto: "Consegui \"surfar\" a onda do impulso sem me afogar.", tipo: "V/F" },
      { texto: "Lembrei das consequências negativas de agir por impulso.", tipo: "Sim/Não" },
      { texto: "Já validei que o impulso é temporário.", tipo: "V/F" },
      { texto: "Estou aplicando o que aprendi sobre autorregulação.", tipo: "Sim/Não" },
      { texto: "Consegui criar espaço entre o gatilho e a ação.", tipo: "V/F" },
      { texto: "Estou no controle da minha resposta, não do impulso.", tipo: "Sim/Não" },
      { texto: "Escolhi conscientemente não agir agora.", tipo: "V/F" },
    ],
  },
  {
    id: 4, modulo: "Módulo 4 — Organização", cor: "#1E7E34",
    perguntas: [
      { texto: "Tenho uma rotina estruturada hoje.", tipo: "Sim/Não" },
      { texto: "Já reservei tempo para atividades saudáveis hoje.", tipo: "V/F" },
      { texto: "Conversei com minha família sobre algo importante hoje.", tipo: "Sim/Não" },
      { texto: "Já cuidei das minhas finanças esta semana.", tipo: "V/F" },
      { texto: "Tenho metas claras que não envolvem jogo.", tipo: "Sim/Não" },
      { texto: "Já identifiquei atividades substitutas para fazer agora.", tipo: "V/F" },
      { texto: "Estou priorizando o que realmente importa para mim.", tipo: "Sim/Não" },
      { texto: "Já reorganizei meu ambiente para reduzir gatilhos.", tipo: "V/F" },
      { texto: "Tenho hábitos saudáveis estabelecidos.", tipo: "Sim/Não" },
      { texto: "Já planejei meu dia de forma consciente.", tipo: "V/F" },
      { texto: "Estou investindo tempo em reconstruir minha vida.", tipo: "Sim/Não" },
      { texto: "Já eliminei ou reduzi estímulos digitais que me prejudicam.", tipo: "V/F" },
      { texto: "Tenho pessoas de apoio na minha rotina.", tipo: "Sim/Não" },
      { texto: "Já estabeleci limites claros para mim mesmo.", tipo: "V/F" },
      { texto: "Estou reconstruindo minha relação com o tempo.", tipo: "Sim/Não" },
      { texto: "Já identifiquei o que realmente me traz satisfação.", tipo: "V/F" },
      { texto: "Estou organizando minhas prioridades de vida.", tipo: "Sim/Não" },
      { texto: "Já criei barreiras práticas contra o impulso.", tipo: "V/F" },
      { texto: "Tenho clareza sobre o que quero construir.", tipo: "Sim/Não" },
      { texto: "Estou substituindo padrões antigos por novos hábitos.", tipo: "V/F" },
    ],
  },
  {
    id: 5, modulo: "Módulo 5 — Prevenção", cor: "#5B2C8D",
    perguntas: [
      { texto: "Já identifiquei situações de alto risco para mim.", tipo: "Sim/Não" },
      { texto: "Tenho estratégias de enfrentamento definidas.", tipo: "V/F" },
      { texto: "Já reconheci meus sinais de alerta precoces.", tipo: "Sim/Não" },
      { texto: "Tenho um plano de ação para momentos de crise.", tipo: "V/F" },
      { texto: "Já construí sistemas de proteção ao meu redor.", tipo: "Sim/Não" },
      { texto: "Estou monitorando meu comportamento regularmente.", tipo: "V/F" },
      { texto: "Já fortaleci minha rede de apoio.", tipo: "Sim/Não" },
      { texto: "Tenho clareza sobre meus fatores de proteção.", tipo: "V/F" },
      { texto: "Já pratiquei estratégias de manutenção esta semana.", tipo: "Sim/Não" },
      { texto: "Estou consolidando minhas conquistas.", tipo: "V/F" },
      { texto: "Já aprendi com minhas experiências passadas.", tipo: "Sim/Não" },
      { texto: "Tenho autoeficácia para lidar com desafios.", tipo: "V/F" },
      { texto: "Já identifiquei o que me mantém estável.", tipo: "Sim/Não" },
      { texto: "Estou prevenindo recaídas de forma proativa.", tipo: "V/F" },
      { texto: "Já estabeleci limites saudáveis.", tipo: "Sim/Não" },
      { texto: "Tenho consciência de que a mudança é um processo.", tipo: "V/F" },
      { texto: "Já celebrei minhas vitórias recentes.", tipo: "Sim/Não" },
      { texto: "Estou fortalecendo minha capacidade de escolha.", tipo: "V/F" },
      { texto: "Já integrei o aprendizado em minha vida.", tipo: "Sim/Não" },
      { texto: "Estou comprometido com minha recuperação contínua.", tipo: "V/F" },
    ],
  },
];

export default function BotaoEmergencia({ modulosLiberados = [], inline = false }) {
  const [modulosState, setModulosState] = useState(modulosLiberados || []);
  const temModulo = modulosState && modulosState.length > 0;
  const [aberto, setAberto] = useState(false);
  const [blocoAtual, setBlocoAtual] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    async function carregarModulos() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("modulos_liberados")
        .select("modulo_id")
        .eq("user_id", user.id);
      if (data && data.length > 0) setModulosState(data);
    }
    if (!modulosLiberados || modulosLiberados.length === 0) {
      carregarModulos();
    }
  }, []);

  async function handleAbrir() {
    if (!temModulo) { setAberto(true); return; }
    setAberto(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: vistos } = await supabase
      .from("emergencia_blocos_vistos")
      .select("bloco_id")
      .eq("user_id", user.id);
    const idsVistos = vistos ? vistos.map(v => v.bloco_id) : [];
    const naoVistos = BLOCOS.filter(b => !idsVistos.includes(b.id));
    const pool = naoVistos.length > 0 ? naoVistos : BLOCOS;
    const escolhido = pool[Math.floor(Math.random() * pool.length)];
    setBlocoAtual(escolhido);
    setRespostas({});
    setConcluido(false);
  }

  async function handleConcluir() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !blocoAtual) return;
    await supabase.from("emergencia_blocos_vistos").upsert(
      { user_id: user.id, bloco_id: blocoAtual.id, visto_em: new Date().toISOString() },
      { onConflict: "user_id,bloco_id" }
    );
    setConcluido(true);
  }

  function handleFechar() {
    setAberto(false);
    setBlocoAtual(null);
    setRespostas({});
    setConcluido(false);
  }

  const totalRespondidas = Object.keys(respostas).length;
  const todasRespondidas = blocoAtual && totalRespondidas === blocoAtual.perguntas.length;

  return (
    <>
      {/* BOTÃO FLUTUANTE — aparece sempre no canto direito */}
      {!inline && (
        <div
          style={{
            position: "fixed",
            right: "1.25rem",
            bottom: "1.75rem",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <button
            onClick={() => (temModulo ? handleAbrir() : setAberto(true))}
            title="Botão de Emergência"
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #e74c3c, #922b21)",
              border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 0 0 0 rgba(231,76,60,0.7)",
              animation: "pulseHeart 1.4s ease-in-out infinite",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              overflow: "hidden",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 L90 20 L90 55 C90 78 72 96 50 105 C28 96 10 78 10 55 L10 20 Z" fill="none" stroke="url(#g)" strokeWidth="6" strokeLinejoin="round"/>
              <rect x="38" y="30" width="9" height="45" rx="4" fill="url(#g)"/>
              <rect x="53" y="30" width="9" height="45" rx="4" fill="url(#g)"/>
              <defs>
                <linearGradient id="g" x1="10" y1="5" x2="90" y2="105" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8"/>
                  <stop offset="100%" stopColor="#34d399"/>
                </linearGradient>
              </defs>
            </svg>
          </button>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#922b21", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2 }}>
            Emergência
          </span>
        </div>
      )}

      {/* MODAL */}
      {aberto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem 1.5rem", maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative" }}>
            <button onClick={handleFechar} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#666" }}>×</button>

            {temModulo ? (
              <>
                {concluido ? (
                  <div style={{ padding: "0.5rem 0" }}>
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
                      <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.2rem", color: "#1a1a1a", marginBottom: "0.4rem" }}>
                        Você observou o impulso sem agir.
                      </h2>
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", color: "#555", lineHeight: 1.6 }}>
                        Isso é Interrupção. O ciclo automático perdeu força.
                      </p>
                    </div>
                    <div style={{ background: "#F0F7FF", border: "1px solid #BFD9F5", borderRadius: 14, padding: "1.25rem", marginBottom: "1.25rem" }}>
                      <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#1A6B8A", marginBottom: "1rem" }}>
                        Respiração regulada — ativando o freio natural do corpo
                      </p>
                      {[
                        { num: "1️⃣", titulo: "PREPARE-SE", itens: ["Sente-se confortavelmente ou fique em pé com os pés no chão", "Coloque uma mão no peito e outra na barriga", "Feche os olhos ou mantenha o olhar suave em um ponto fixo"] },
                        { num: "2️⃣", titulo: "INSPIRE PELO NARIZ (4 segundos)", itens: ["Conte mentalmente: 1... 2... 3... 4", "Sinta a barriga expandir (não só o peito)", "Imagine que está enchendo um balão suave dentro de você"] },
                        { num: "3️⃣", titulo: "SEGURE LEVEMENTE (6 segundos)", itens: ["Conte: 1... 2... 3... 4... 5... 6", "Não force — apenas pause naturalmente", "Observe a sensação de plenitude"] },
                        { num: "4️⃣", titulo: "EXPIRE PELA BOCA (2 segundos)", itens: ["Solte o ar suavemente, como se estivesse assoprando uma vela sem apagar", "Conte: 1... 2", "Sinta a barriga voltar ao lugar"] },
                        { num: "🔁", titulo: "REPITA 5 a 10 CICLOS", itens: ["Tempo total: 2 a 3 minutos", "Se distrair, volte gentilmente para a contagem"] },
                      ].map((passo, i) => (
                        <div key={i} style={{ marginBottom: "0.9rem" }}>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>
                            {passo.num} {passo.titulo}
                          </p>
                          {passo.itens.map((item, j) => (
                            <p key={j} style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", color: "#444", lineHeight: 1.55, paddingLeft: "1.2rem", margin: "0.15rem 0" }}>• {item}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                    {[
                      { texto: "O impulso tem pico... e depois passa.\nVocê não precisa fazer nada agora.\nSó respirar.", bg: "#F5F0FF", border: "#D4C5F5", cor: "#4A2D8D" },
                      { texto: "Seu \"freio natural\" foi ativado.\nO nervo vago respondeu.\nSeu corpo está mais calmo.\nSua mente, mais clara.", bg: "#F0FFF4", border: "#C3E6CB", cor: "#1E5C2E" },
                    ].map((msg, i) => (
                      <div key={i} style={{ background: msg.bg, border: `1px solid ${msg.border}`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "0.75rem", fontFamily: "DM Serif Display, serif", fontSize: "0.95rem", color: msg.cor, lineHeight: 1.7, whiteSpace: "pre-line", textAlign: "center" }}>
                        {msg.texto}
                      </div>
                    ))}
                    <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#aaa", fontFamily: "DM Sans, sans-serif", marginBottom: "1rem" }}>
                      Em crise? CVV: <strong>188</strong> · SAMU: <strong>192</strong>
                    </p>
                    <button onClick={handleFechar} style={{ width: "100%", background: "#3B6D11", color: "#fff", border: "none", padding: "0.9rem", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
                      Fechar
                    </button>
                  </div>
                ) : blocoAtual ? (
                  <>
                    {/* Imagem curva do impulso */}
                    <div style={{ marginBottom: "0.75rem", borderRadius: 10, overflow: "hidden" }}>
                      <img src="/imagens/curva-do-impulso.png" alt="Curva do Impulso" className="w-full rounded-lg" />
                    </div>
                    <div style={{ marginTop: "1rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                      <p style={{ fontWeight: 700, textAlign: "center", color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                        RESPIRAÇÃO REGULADA — ATIVANDO O FREIO NATURAL DO CORPO
                      </p>
                      <div style={{ background: "#f0f7ff", border: "1px solid #bfd9f5", borderRadius: 10, padding: "1rem 1.1rem", marginBottom: "0.75rem" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1A6B8A", marginBottom: "0.5rem" }}>Respiração Guiada para Atravessar o Impulso</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>O QUE É?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}>A técnica de respiração 4-6-2 é uma ferramenta fisiológica baseada em evidências científicas que ativa o sistema nervoso parassimpático através da estimulação do nervo vago, promovendo redução imediata da ativação fisiológica associada ao impulso de jogar.</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO FUNCIONA?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.5rem" }}>Quando executada corretamente, esta sequência respiratória:</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                          ✅ Estimula o nervo vago — principal componente do sistema parassimpático<br />
                          ✅ Reduz a frequência cardíaca e a pressão arterial<br />
                          ✅ Diminui a liberação de cortisol (hormônio do estresse)<br />
                          ✅ Aumenta a variabilidade da frequência cardíaca<br />
                          ✅ Ativa o córtex pré-frontal — área responsável pelo controle executivo
                        </p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO PRATICAR</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 1 — INSPIRAÇÃO (4 segundos):</strong> Inspire lentamente pelo nariz contando 1... 2... 3... 4. A barriga deve expandir.</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 2 — RETENÇÃO (6 segundos):</strong> Segure o ar suavemente contando 1... 2... 3... 4... 5... 6. Não force.</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}><strong>FASE 3 — EXPIRAÇÃO (2 segundos):</strong> Solte o ar pela boca contando 1... 2. Sinta a barriga voltando ao lugar.</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>QUANDO USAR?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8 }}>
                          🎯 No momento do impulso: assim que perceber a vontade de jogar<br />
                          🎯 Antes de situações de risco: quando souber que estará exposto a gatilhos<br />
                          🎯 Após uma recaída: para retomar o controle sem autocrítica<br />
                          🎯 Na prevenção diária: como prática de manutenção
                        </p>
                      </div>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        Você observou o impulso sem agir.<br />
                        Isso é Interrupção.<br />
                        O ciclo automático perdeu força.
                      </p>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        O impulso tem pico... e depois passa.<br />
                        Você não precisa fazer nada agora.<br />
                        Só respirar.
                      </p>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        Seu "freio natural" foi ativado.<br />
                        O nervo vago respondeu.<br />
                        Seu corpo está mais calmo.<br />
                        Sua mente, mais clara.
                      </p>
                    </div>

                    <div style={{ display: "inline-block", background: blocoAtual.cor + "15", color: blocoAtual.cor, padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.72rem", fontFamily: "DM Sans, sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
                      {blocoAtual.modulo}
                    </div>
                    <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.2rem", color: "#1a1a1a", marginBottom: "0.25rem" }}>
                      Reflexão de emergência
                    </h2>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", color: "#888", marginBottom: "1.5rem" }}>
                      Responda com sinceridade. Não há respostas certas ou erradas. ({totalRespondidas}/{blocoAtual.perguntas.length})
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                      {blocoAtual.perguntas.map((p, i) => (
                        <div key={i} style={{ background: "#F7F5F0", borderRadius: 10, padding: "0.9rem 1rem", border: respostas[i] ? `1px solid ${blocoAtual.cor}40` : "1px solid #E8E4DC" }}>
                          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", color: "#333", marginBottom: "0.6rem", lineHeight: 1.5 }}>
                            {i + 1}. {p.texto}
                          </p>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {(p.tipo === "Sim/Não" ? ["Sim", "Não"] : ["Verdadeiro", "Falso"]).map(op => (
                              <button key={op} onClick={() => setRespostas(r => ({ ...r, [i]: op }))} style={{
                                padding: "0.3rem 0.9rem", borderRadius: 6, border: "none", cursor: "pointer",
                                fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", fontWeight: 600,
                                background: respostas[i] === op ? blocoAtual.cor : "#fff",
                                color: respostas[i] === op ? "#fff" : "#555",
                              }}>
                                {op}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {todasRespondidas && (
                      <button onClick={handleConcluir} style={{ width: "100%", background: blocoAtual.cor, color: "#fff", border: "none", padding: "0.9rem", borderRadius: 10, fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
                        Concluir reflexão
                      </button>
                    )}
                    <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#aaa", fontFamily: "DM Sans, sans-serif", marginTop: "1rem" }}>
                      CVV: 188 · SAMU: 192 (24h)
                    </p>
                  </>
                ) : blocoAtual ? (
                  <>
                    {/* Imagem curva do impulso */}
                    <div style={{ marginBottom: "0.75rem", borderRadius: 10, overflow: "hidden" }}>
                      <img src="/imagens/curva-do-impulso.png" alt="Curva do Impulso" className="w-full rounded-lg" />
                    </div>
                    <div style={{ marginTop: "1rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                      <p style={{ fontWeight: 700, textAlign: "center", color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                        RESPIRAÇÃO REGULADA — ATIVANDO O FREIO NATURAL DO CORPO
                      </p>
                      <div style={{ background: "#f0f7ff", border: "1px solid #bfd9f5", borderRadius: 10, padding: "1rem 1.1rem", marginBottom: "0.75rem" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1A6B8A", marginBottom: "0.5rem" }}>Respiração Guiada para Atravessar o Impulso</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>O QUE É?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}>A técnica de respiração 4-6-2 é uma ferramenta fisiológica baseada em evidências científicas que ativa o sistema nervoso parassimpático através da estimulação do nervo vago, promovendo redução imediata da ativação fisiológica associada ao impulso de jogar.</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO FUNCIONA?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.5rem" }}>Quando executada corretamente, esta sequência respiratória:</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                          ✅ Estimula o nervo vago — principal componente do sistema parassimpático<br />
                          ✅ Reduz a frequência cardíaca e a pressão arterial<br />
                          ✅ Diminui a liberação de cortisol (hormônio do estresse)<br />
                          ✅ Aumenta a variabilidade da frequência cardíaca<br />
                          ✅ Ativa o córtex pré-frontal — área responsável pelo controle executivo
                        </p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO PRATICAR</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 1 — INSPIRAÇÃO (4 segundos):</strong> Inspire lentamente pelo nariz contando 1... 2... 3... 4. A barriga deve expandir.</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 2 — RETENÇÃO (6 segundos):</strong> Segure o ar suavemente contando 1... 2... 3... 4... 5... 6. Não force.</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}><strong>FASE 3 — EXPIRAÇÃO (2 segundos):</strong> Solte o ar pela boca contando 1... 2. Sinta a barriga voltando ao lugar.</p>
                        <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>QUANDO USAR?</p>
                        <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8 }}>
                          🎯 No momento do impulso: assim que perceber a vontade de jogar<br />
                          🎯 Antes de situações de risco: quando souber que estará exposto a gatilhos<br />
                          🎯 Após uma recaída: para retomar o controle sem autocrítica<br />
                          🎯 Na prevenção diária: como prática de manutenção
                        </p>
                      </div>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        Você observou o impulso sem agir.<br />
                        Isso é Interrupção.<br />
                        O ciclo automático perdeu força.
                      </p>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        O impulso tem pico... e depois passa.<br />
                        Você não precisa fazer nada agora.<br />
                        Só respirar.
                      </p>
                      <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                        Seu "freio natural" foi ativado.<br />
                        O nervo vago respondeu.<br />
                        Seu corpo está mais calmo.<br />
                        Sua mente, mais clara.
                      </p>
                    </div>
                    <div style={{ display: "inline-block", background: blocoAtual.cor + "15", color: blocoAtual.cor, padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.72rem", fontFamily: "DM Sans, sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
                      {blocoAtual.modulo}
                    </div>
                    <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.2rem", color: "#1a1a1a", marginBottom: "0.25rem" }}>
                      Reflexão de emergência
                    </h2>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", color: "#888", marginBottom: "1.5rem" }}>
                      Responda com sinceridade. Não há respostas certas ou erradas. ({totalRespondidas}/{blocoAtual.perguntas.length})
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: "DM Sans, sans-serif", color: "#888", textAlign: "center" }}>Carregando...</p>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img src="/logo-icon.png" alt="PareDeJogar" style={{ width: 72, height: 72, objectFit: "contain", margin: "0 auto 0.75rem" }} />
                <div style={{ marginBottom: "0.75rem", borderRadius: 10, overflow: "hidden" }}>
                  <img src="/imagens/curva-do-impulso.png" alt="Curva do Impulso" style={{ width: "100%", borderRadius: 8 }} />
                </div>
                <div style={{ marginTop: "0.75rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.82rem" }}>
                  <p style={{ fontWeight: 700, textAlign: "center", color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.72rem" }}>
                    RESPIRAÇÃO REGULADA — ATIVANDO O FREIO NATURAL DO CORPO
                  </p>
                  <div style={{ background: "#f0f7ff", border: "1px solid #bfd9f5", borderRadius: 10, padding: "1rem 1.1rem", marginBottom: "0.75rem" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1A6B8A", marginBottom: "0.5rem" }}>Respiração Guiada para Atravessar o Impulso</p>
                    <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>O QUE É?</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}>A técnica de respiração 4-6-2 é uma ferramenta fisiológica baseada em evidências científicas que ativa o sistema nervoso parassimpático através da estimulação do nervo vago, promovendo redução imediata da ativação fisiológica associada ao impulso de jogar.</p>
                    <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO FUNCIONA?</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.5rem" }}>Quando executada corretamente, esta sequência respiratória:</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                      ✅ Estimula o nervo vago — principal componente do sistema parassimpático<br />
                      ✅ Reduz a frequência cardíaca e a pressão arterial<br />
                      ✅ Diminui a liberação de cortisol (hormônio do estresse)<br />
                      ✅ Aumenta a variabilidade da frequência cardíaca<br />
                      ✅ Ativa o córtex pré-frontal — área responsável pelo controle executivo
                    </p>
                    <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>COMO PRATICAR</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 1 — INSPIRAÇÃO (4 segundos):</strong> Inspire lentamente pelo nariz contando 1... 2... 3... 4. A barriga deve expandir.</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.3rem" }}><strong>FASE 2 — RETENÇÃO (6 segundos):</strong> Segure o ar suavemente contando 1... 2... 3... 4... 5... 6. Não force.</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.6, marginBottom: "0.75rem" }}><strong>FASE 3 — EXPIRAÇÃO (2 segundos):</strong> Solte o ar pela boca contando 1... 2. Sinta a barriga voltando ao lugar.</p>
                    <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#1A6B8A", marginBottom: "0.3rem" }}>QUANDO USAR?</p>
                    <p style={{ fontSize: "0.8rem", color: "#333", lineHeight: 1.8 }}>
                      🎯 No momento do impulso: assim que perceber a vontade de jogar<br />
                      🎯 Antes de situações de risco: quando souber que estará exposto a gatilhos<br />
                      🎯 Após uma recaída: para retomar o controle sem autocrítica<br />
                      🎯 Na prevenção diária: como prática de manutenção
                    </p>
                  </div>
                  <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                    Você observou o impulso sem agir.<br />Isso é Interrupção.<br />O ciclo automático perdeu força.
                  </p>
                  <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                    O impulso tem pico... e depois passa.<br />Você não precisa fazer nada agora.<br />Só respirar.
                  </p>
                  <p style={{ textAlign: "center", color: "#4b5563", lineHeight: 1.6 }}>
                    Seu "freio natural" foi ativado.<br />O nervo vago respondeu.<br />Seu corpo está mais calmo.<br />Sua mente, mais clara.
                  </p>
                </div>
                <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.3rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                  Você fez a escolha certa ao clicar aqui.
                </h2>
                <div style={{ background: "#f9f5f0", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem", textAlign: "left" }}>
                  <p style={{ fontWeight: 700, color: "#3B6D11", marginBottom: "0.75rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Responda agora, com honestidade:
                  </p>
                  <p style={{ color: "#444", marginBottom: "0.5rem", fontSize: "0.92rem" }}>O que aconteceu antes dessa vontade aparecer?</p>
                  <p style={{ color: "#444", marginBottom: "0.5rem", fontSize: "0.92rem" }}>O que você vai sentir se jogar agora?</p>
                  <p style={{ color: "#444", marginBottom: "1rem", fontSize: "0.92rem" }}>O que você vai sentir se resistir?</p>
                  <div style={{ borderTop: "1px solid #e0d8cc", paddingTop: "0.75rem" }}>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Você está sentindo um impulso AGORA?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Este impulso surgiu nos últimos 15 minutos?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Você já tentou recuperar perdas nas últimas 24h?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Está apostando escondido de alguém?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Você usou dinheiro que precisava para outra coisa?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Está sentindo culpa por suas apostas recentes?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Já mentiu sobre quanto tempo/dinheiro gastou jogando?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Está tentando provar algo através do jogo?</p>
                    <p style={{ color: "#555", marginBottom: "0.4rem", fontSize: "0.88rem" }}>Sente que o jogo está controlando suas decisões hoje?</p>
                    <p style={{ color: "#555", fontSize: "0.88rem" }}>Já cancelou ou adiou algo importante para jogar?</p>
                  </div>
                </div>
                <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  Esta ferramenta tem uma versão completa com <strong>100 perguntas randomizadas</strong>, a Curva do Impulso e técnica de respiração guiada.
                </p>
                <a
                  href="/modulo/1"
                  style={{ display: "block", background: "#3B6D11", color: "#fff", padding: "0.9rem", borderRadius: 10, fontWeight: 700, fontSize: "1rem", textDecoration: "none", marginBottom: "0.75rem" }}
                >
                  Quero o Módulo 1 — Interrupção
                </a>
                <button onClick={handleFechar} style={{ background: "none", border: "none", color: "#aaa", fontSize: "0.8rem", cursor: "pointer" }}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animação pulso coração */}
      <style>{`
        @keyframes pulseHeart {
          0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.7); transform: scale(1); }
          50% { box-shadow: 0 0 0 14px rgba(231,76,60,0); transform: scale(1.08); }
          100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); transform: scale(1); }
        }
      `}</style>
    </>
  );
}
