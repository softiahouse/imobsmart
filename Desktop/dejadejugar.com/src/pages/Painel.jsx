import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import BotaoEmergencia from "../components/BotaoEmergencia";

function calcularStatus(moduloId, liberados, concluidos) {
  const ehSocio = liberados.length >= 5;
  const concluido = concluidos.includes(moduloId);
  const pago = liberados.includes(moduloId);
  const anteriorOk =
    moduloId === 1 ||
    ehSocio ||
    concluidos.includes(moduloId - 1) ||
    liberados.includes(moduloId - 1);

  if (concluido) return "concluido";
  if (pago && anteriorOk) return "disponivel";
  if (!pago && anteriorOk) return "pagar";
  return "bloqueado";
}

const PRECOS = {
  1: { label: "R$ 29,90", valor: 29.9 },
  2: { label: "R$ 49,90", valor: 49.9 },
  3: { label: "R$ 89,90", valor: 89.9 },
  4: { label: "R$ 149,90", valor: 149.9 },
  5: { label: "R$ 199,90", valor: 199.9 },
};

const modulos = [
  {
    id: 1,
    etapa: "I",
    nome: "Interrupção",
    descricao:
      "Você começa entendendo como o ciclo do jogo se instala e dá o primeiro passo para sair do piloto automático.",
    aulas: 3,
    ferramenta: "Contrato de Interrupção",
    detalhes: `OBJETIVO: Identificar e interromper o ciclo automático do jogo antes que ele se transforme em ação. O impulso NÃO é incontrolável — ele segue uma curva previsível: surge, aumenta, atinge o pico e diminui naturalmente.\n\n⏱ Duração: 3 aulas (45–60 min) · Nível: Iniciante\n\n1️⃣ Modelo Cognitivo-Comportamental — identificação de pensamentos automáticos e distorções cognitivas.\n2️⃣ Curva do Impulso (Marlatt & Gordon, 1985) — duração média de 15–30 min do surgimento ao declínio.\n3️⃣ Sistema Nervoso Autônomo — técnicas de respiração ativam o nervo vago e reduzem a urgência em 2–5 min.\n\nResultado: você não luta contra o impulso — você o atravessa conscientemente até ele diminuir.`,
  },
  {
    id: 2,
    etapa: "S",
    nome: "Compreendendo os Gatilhos do Jogo",
    descricao:
      "Identifique os momentos e emoções que despertam o impulso de apostar.",
    aulas: 5,
    ferramenta: "Mapa de Gatilhos ISTOP",
    detalhes: `OBJETIVO: Identificar, mapear e compreender os gatilhos pessoais que desencadeiam o impulso de apostar. O jogo não acontece "do nada" — ele é ativado por estímulos específicos que, quando reconhecidos, perdem seu poder automático.\n\n⏱ Duração: 5 aulas (75–100 min) · Nível: Intermediário\n\n1️⃣ Condicionamento Clássico (Pavlov) — seu cérebro associou estímulos como tédio ou notificações à recompensa do jogo, criando gatilhos condicionados que ativam a dopamina antes de você começar a jogar.\n2️⃣ Modelo Cognitivo-Comportamental (Beck, 1976) — Situação → Pensamento Automático → Emoção → Comportamento. Os gatilhos ativam pensamentos como "só mais uma vez".\n3️⃣ Prevenção de Recaída (Marlatt & Gordon, 1985) — gatilhos intrapessoais (tédio, estresse, solidão, comemoração) e interpessoais (pressão social, conflito, isolamento).\n4️⃣ Sistema de Recompensa Cerebral — os gatilhos ativam o núcleo accumbens e criam vias neurais automatizadas: gatilho → impulso → ação. Interromper esse ciclo exige consciência + estratégias alternativas.\n\nResultado: ao final você terá um Mapa Pessoal de Gatilhos completo para antecipar situações de risco.`,
  },
  {
    id: 3,
    etapa: "T",
    nome: "Autorregulação",
    descricao:
      "Você aprende a criar uma pausa entre o gatilho e a ação. Aqui começa o controle real.",
    aulas: 5,
    ferramenta: "Plano Pessoal de Manejo",
    detalhes: `OBJETIVO: Criar uma pausa consciente entre o gatilho e a ação, substituindo respostas automáticas por escolhas deliberadas. Autorregulação não é "lutar contra" o impulso — é atravessar o pico com clareza.\n\n⏱ Duração: 5 aulas (75–100 min) · Nível: Intermediário-Avançado\n\n1️⃣ TCC (Beck, 1976) — reestruturação cognitiva: identificar pensamentos automáticos ("vou recuperar", "só mais uma rodada") e substituí-los por interpretações realistas. Fortalece o córtex pré-frontal e reduz a dominância da amígdala.\n2️⃣ Urge Surfing (Marlatt & Gordon, 1985) — o impulso é como uma onda: sobe, atinge o pico e desce naturalmente em 15–30 min. A técnica ensina a observá-lo e respirar com ele até a dissipação.\n3️⃣ ACT (Hayes, 1999) — defusão cognitiva: observar pensamentos como eventos passageiros, não como ordens. Tolerância ao desconforto emocional sem usar o jogo como escape.\n4️⃣ Teoria Polivagal (Porges, 1995) — respiração e mindfulness estimulam o nervo vago, restaurando o estado de calma onde o controle executivo opera.\n5️⃣ Autoeficácia (Bandura, 1977) — cada vez que você atravessa o pico usando uma técnica, seu cérebro registra: "Eu consigo." Esse ciclo fortalece a confiança progressivamente.\n\nResultado: Plano Pessoal de Manejo estruturado com técnicas validadas para gerenciar situações de risco.`,
  },
  {
    id: 4,
    etapa: "O",
    nome: "Reorganização comportamental",
    descricao:
      "Compreenda como hábitos se formam e aprenda a reorganizar rotinas e padrões comportamentais para consolidar mudanças duradouras.",
    aulas: 5,
    ferramenta: "Estrutura de Rotina",
    detalhes: `OBJETIVO: Reconstruir rotina e estrutura de vida alinhadas aos seus valores após interromper o ciclo (M1), compreender gatilhos (M2) e desenvolver autorregulação (M3).\n\n⏱ Duração: 5 aulas (60–80 min) · Nível: Intermediário-Avançado\n\n1️⃣ Ativação Comportamental (Martell, 2001) — comportamentos geram emoções, não o contrário: agir diferente → sentir diferente. Foco em atividades que dão sentido, conexão e realização.\n2️⃣ Formação de Hábitos (Lally, 2010) — um hábito leva em média 66 dias para se consolidar. Fórmula: Deixa → Rotina → Recompensa. Consistência diária importa mais que intensidade.\n3️⃣ Design de Ambiente (Clear, 2018) — o ambiente molda o comportamento mais que a força de vontade. Torne o desejado fácil e o indesejado difícil: remover apps de aposta, criar fricção para jogar.\n4️⃣ Gestão de Limites (Cloud & Townsend, 1992) — limites saudáveis protegem tempo, energia e valores. Assertividade: expressar necessidades com clareza, sem agressividade ou passividade.\n5️⃣ Gestão do Tempo (Covey, 1989) — Matriz de Eisenhower: realocar tempo do quadrante "Urgente/Não Importante" (jogo compulsivo) para "Não Urgente/Importante" (saúde, relacionamentos, crescimento).\n\nResultado: Mapa de Rotina ISTOP personalizado para criar uma vida que não dependa do jogo para fazer sentido.`,
  },
  {
    id: 5,
    etapa: "P",
    nome: "Manutenção da Mudança e Prevenção de Recaídas",
    descricao:
      "Consolide as mudanças comportamentais iniciadas no programa e desenvolva estratégias estruturadas para reduzir o risco de recaída ao longo do tempo.",
    aulas: 5,
    ferramenta: "Protocolo de Prevenção de Recaída",
    detalhes: `OBJETIVO: Manter a estabilidade e prevenir recaídas a longo prazo, transformando a recuperação em estilo de vida sustentável. Não é "nunca mais falhar" — é desenvolver resiliência para navegar desafios sem retornar ao padrão compulsivo.\n\n⏱ Duração: 5 aulas (60–80 min) · Nível: Avançado\n\n1️⃣ Prevenção de Recaída (Marlatt & Gordon, 1985) — diferencia lapse (escorregão isolado) de relapse (retorno crônico). Recaídas são processos: gatilho → permissão → ação → justificativa → ciclo. Inclui plano de ação para retomar sem culpa paralisante.\n2️⃣ Autoeficácia (Bandura, 1977) — confiança baseada em experiência: "Já fiz antes, consigo de novo." Cada desafio superado fortalece a crença de que você consegue se manter em recuperação.\n3️⃣ ACT (Hayes, 1999) — agir com valores mesmo com desconforto. Aceitação, defusão cognitiva, momento presente e identidade além do comportamento: "Sou mais que meu jogo."\n4️⃣ Psicologia Positiva (Seligman, 2011) — prevenção sustentável vem de cultivar o bom: forças de caráter, significado, relacionamentos positivos e crescimento pós-traumático.\n5️⃣ Neuroplasticidade (Doidge, 2007) — cada escolha diferente fortalece vias neurais de autocontrole. Sono, nutrição, exercício e mindfulness potencializam a mudança cerebral permanente.\n\nResultado: Protocolo Pessoal de Prevenção de Recaídas completo, pronto para ser consultado sempre que precisar.`,
  },
];

const estilos = {
  btnIniciar: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    padding: "0.45rem 1.1rem",
    borderRadius: 8,
    textDecoration: "none",
    display: "inline-block",
    background: "#3B6D11",
    color: "#fff",
    border: "none",
  },
};

export default function Painel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progresso, setProgresso] = useState({ moduloAtual: 1, concluidos: [] });
  const [loading, setLoading] = useState(true);
  const [liberados, setLiberados] = useState([]); // módulos pagos
  const [carregandoPgto, setCarregandoPgto] = useState(null); // id do módulo em loading
  const [moduloExpandido, setModuloExpandido] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/entrar");
        return;
      }
      setUser(data.user);
      carregarProgresso(data.user.id);
    });
  }, []);

  async function carregarProgresso(userId) {
    const { data, error } = await supabase
      .from("progresso_usuario")
      .select("modulo_id")
      .eq("user_id", userId);

    // Módulos pagos (liberados)
    const { data: dadosLiberados } = await supabase
      .from("modulos_liberados")
      .select("modulo_id")
      .eq("user_id", userId);

    if (dadosLiberados) {
      setLiberados(dadosLiberados.map((r) => r.modulo_id));
    }

    if (error) {
      console.error("Erro ao carregar progresso:", error.message);
      setProgresso({ moduloAtual: 1, concluidos: [] });
    } else {
      const concluidos = data.map((r) => r.modulo_id);
      // Próximo módulo = maior concluído + 1, mínimo 1
      const moduloAtual = concluidos.length > 0 ? Math.max(...concluidos) + 1 : 1;
      setProgresso({ moduloAtual, concluidos });
    }

    setLoading(false);
  }

  async function handleComprar(moduloId) {
    setCarregandoPgto(moduloId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const MODULOS_CONFIG = {
        1: { nome: "Módulo 1 — Interrupção", preco: 29.90 },
        2: { nome: "Módulo 2 — Sensibilização", preco: 49.90 },
        3: { nome: "Módulo 3 — Autorregulação", preco: 89.90 },
        4: { nome: "Módulo 4 — Reorganização", preco: 149.90 },
        5: { nome: "Módulo 5 — Manutenção", preco: 199.90 },
      };
      const { nome, preco } = MODULOS_CONFIG[moduloId];
      const res = await fetch(
        "https://gybzuhopxhlbewhjihnd.supabase.co/functions/v1/criar-preferencia-mp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            items: [{ title: nome, quantity: 1, unit_price: preco, currency_id: "BRL" }],
            external_reference: `user_${session.user.id}_modulo_${moduloId}`,
            back_urls: {
              success: "https://paredejogar.com/painel",
              failure: "https://paredejogar.com/painel",
              pending: "https://paredejogar.com/painel",
            },
            auto_return: "approved",
            notification_url:
              "https://gybzuhopxhlbewhjihnd.supabase.co/functions/v1/webhook-mp",
          }),
        }
      );
      const json = await res.json();
      if (json.init_point) {
        window.location.href = json.init_point;
      } else {
        alert("Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar ao sistema de pagamento.");
    } finally {
      setCarregandoPgto(null);
    }
  }

  const nome = user?.user_metadata?.full_name?.split(" ")[0] || "bem-vindo";
  const avatar = user?.user_metadata?.avatar_url;
  const totalConcluidos = progresso.concluidos.length;
  const percentual = Math.round((totalConcluidos / 5) * 100);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F5F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#3B6D11" }}>
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0" }}>
      {/* Header do painel */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E8E4DC",
          padding: "1.25rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <img
            src="/logo-icon.png"
            alt="PareDeJogar"
            style={{ height: 128, width: "auto" }}
          />
          <span
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.25rem",
              color: "#3B6D11",
              letterSpacing: "-0.02em",
            }}
          >
            Instituto ISTOP
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {avatar && (
            <img
              src={avatar}
              alt={nome}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.9rem",
              color: "#555",
            }}
          >
            {nome}
          </span>
          <BotaoEmergencia modulosLiberados={liberados} inline={true} />
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "0.3rem 0.75rem",
              fontSize: "0.8rem",
              fontFamily: "DM Sans, sans-serif",
              color: "#777",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Boas-vindas + progresso */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid #E8E4DC",
          }}
        >
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.75rem",
              color: "#1a1a1a",
              marginBottom: "0.25rem",
            }}
          >
            Olá, {nome}.
          </h1>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#666",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
            }}
          >
            {totalConcluidos === 0
              ? "Sua jornada começa aqui. Cada módulo é um passo real."
              : `Você concluiu ${totalConcluidos} de 5 módulos. Continue.`}
          </p>

          {/* Barra de progresso */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                flex: 1,
                height: 8,
                background: "#E8E4DC",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percentual}%`,
                  background: "#3B6D11",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.85rem",
                color: "#3B6D11",
                fontWeight: 600,
                minWidth: 40,
              }}
            >
              {percentual}%
            </span>
          </div>

          {/* Etapas ISTOP visuais */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {modulos.map((m) => {
              const s = calcularStatus(m.id, liberados, progresso.concluidos);
              const ativo = s === "disponivel" || s === "pagar";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.3rem 0.75rem",
                    borderRadius: 99,
                    background:
                      s === "concluido"
                        ? "#3B6D11"
                        : ativo
                          ? "#EFF5E8"
                          : "#F0EFE9",
                    border: `1px solid ${
                      s === "concluido"
                        ? "#3B6D11"
                        : ativo
                          ? "#3B6D11"
                          : "#DDD"
                    }`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color:
                        s === "concluido"
                          ? "#fff"
                          : ativo
                            ? "#3B6D11"
                            : "#aaa",
                    }}
                  >
                    {m.etapa}
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.75rem",
                      color:
                        s === "concluido"
                          ? "#fff"
                          : ativo
                            ? "#3B6D11"
                            : "#aaa",
                    }}
                  >
                    {m.nome}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Livros gratuitos — Módulo 1 */}
          {liberados.includes(1) && (
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid #E8E4DC",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#3B6D11",
                  fontWeight: 700,
                  marginBottom: "0.9rem",
                }}
              >
                📚 Seus materiais gratuitos
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { titulo: "O Luto", autor: "Marcelo R. Paulo", arquivo: "/livros/o-luto.pdf", capa: "/imagens/capa-o-luto.png" },
                  { titulo: "Jogo Online", autor: "Vício de Bolso", arquivo: "/livros/jogo-online.pdf", capa: "/imagens/capa-jogo-online.png" },
                ].map((livro, i) => (
                  <a
                    key={i}
                    href={livro.arquivo}
                    download
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: "#F7F5F0",
                      border: "1px solid #E8E4DC",
                      borderRadius: 10,
                      padding: "0.65rem 1rem",
                      textDecoration: "none",
                      flex: "1 1 200px",
                      minWidth: 180,
                    }}
                  >
                    <img
                      src={livro.capa}
                      alt={livro.titulo}
                      style={{ width: 36, height: 50, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "DM Serif Display, serif",
                          fontSize: "0.88rem",
                          color: "#1a1a1a",
                          marginBottom: "0.15rem",
                        }}
                      >
                        {livro.titulo}
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.75rem",
                          color: "#888",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {livro.autor}
                      </p>
                      <span
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#3B6D11",
                        }}
                      >
                        ↓ Baixar grátis
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {totalConcluidos === 5 && (
          <div className="painel-certificado-banner">
            <div className="painel-certificado-texto">
              <span className="painel-certificado-icone">✦</span>
              <div>
                <p className="painel-certificado-titulo">Programa concluído</p>
                <p className="painel-certificado-sub">
                  Você completou o Método ISTOP. Seu certificado está disponível.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="painel-certificado-btn"
              onClick={() => navigate("/certificado")}
            >
              Ver meu certificado →
            </button>
          </div>
        )}

        {/* Grid de módulos */}
        <h2
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.2rem",
            color: "#1a1a1a",
            marginBottom: "1rem",
          }}
        >
          Módulos do Programa
        </h2>

        <div
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {modulos.map((m) => {
            const status = calcularStatus(m.id, liberados, progresso.concluidos);
            const ativo = status === "disponivel" || status === "pagar";
            const bloqueado = status === "bloqueado";

            return (
              <div
                key={m.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: `1px solid ${
                    ativo ? "#3B6D11" : "#E8E4DC"
                  }`,
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.25rem",
                  opacity: bloqueado ? 0.55 : 1,
                  transition: "box-shadow 0.2s",
                  boxShadow:
                    ativo
                      ? "0 2px 12px rgba(59,109,17,0.08)"
                      : "none",
                }}
              >
                {/* Círculo da letra */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background:
                      status === "concluido"
                        ? "#3B6D11"
                        : ativo
                          ? "#EFF5E8"
                          : "#F0EFE9",
                    border: `2px solid ${
                      status === "concluido"
                        ? "#3B6D11"
                        : ativo
                          ? "#3B6D11"
                          : "#ddd"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {status === "concluido" ? (
                    <span style={{ color: "#fff", fontSize: "1.2rem" }}>✓</span>
                  ) : (
                    <span
                      style={{
                        fontFamily: "DM Serif Display, serif",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        color: ativo ? "#3B6D11" : "#bbb",
                      }}
                    >
                      {m.etapa}
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.72rem",
                        color: "#999",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Módulo {m.id}
                    </span>
                    {status === "concluido" && (
                      <span
                        style={{
                          background: "#EFF5E8",
                          color: "#3B6D11",
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 99,
                          fontFamily: "DM Sans, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Concluído
                      </span>
                    )}
                    {status === "disponivel" && (
                      <span
                        style={{
                          background: "#3B6D11",
                          color: "#fff",
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 99,
                          fontFamily: "DM Sans, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Disponível
                      </span>
                    )}
                    {status === "pagar" && (
                      <span
                        style={{
                          background: "#FFF4E5",
                          color: "#8B5A00",
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 99,
                          fontFamily: "DM Sans, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Comprar acesso
                      </span>
                    )}
                    {status === "bloqueado" && (
                      <span
                        style={{
                          background: "#F0EFE9",
                          color: "#aaa",
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 99,
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        🔒 Bloqueado
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.15rem",
                      color: "#1a1a1a",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {m.nome}
                  </h3>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.88rem",
                      color: "#666",
                      lineHeight: 1.55,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {m.descricao}
                  </p>
                  {m.detalhes && (status === "concluido" || status === "disponivel" || status === "pagar") && (
                    <div style={{ background: "#f0f7e8", borderRadius: 10, marginBottom: "0.75rem", borderLeft: "3px solid #3B6D11", overflow: "hidden" }}>
                      <div style={{
                        maxHeight: moduloExpandido === m.id ? "2000px" : "80px",
                        overflow: "hidden",
                        transition: "max-height 0.4s ease",
                        padding: "1rem 1.1rem",
                      }}>
                        {m.detalhes.split("\n\n").map((bloco, i) => (
                          <div key={i} style={{ marginBottom: "0.6rem" }}>
                            {bloco.split("\n").map((linha, j) => {
                              const isNumero = /^[1-5]️⃣/.test(linha);
                              return (
                                <p key={j} style={{
                                  fontFamily: "DM Sans, sans-serif",
                                  fontSize: "0.82rem",
                                  color: isNumero ? "#1a1a1a" : "#3a3a3a",
                                  fontWeight: isNumero ? 600 : 400,
                                  lineHeight: 1.6,
                                  textAlign: "justify",
                                  marginBottom: isNumero ? "0.3rem" : 0,
                                }}>
                                  {linha}
                                </p>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setModuloExpandido(moduloExpandido === m.id ? null : m.id)}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          borderTop: "1px solid #c8e6a0",
                          padding: "0.4rem",
                          cursor: "pointer",
                          color: "#3B6D11",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.3rem",
                        }}
                      >
                        {moduloExpandido === m.id ? "▲ Ver menos" : "▼ Ver mais"}
                      </button>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.78rem",
                        color: "#888",
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>📖 {m.aulas} aulas</span>
                      <span>🛠 {m.ferramenta}</span>
                      {(status === "pagar" && m.id === Math.min(...modulos.filter(mod => {
                        const s = liberados.includes(mod.id) ? (progresso.concluidos.includes(mod.id) ? "concluido" : "disponivel") : (liberados.includes(mod.id - 1) || mod.id === 1 ? "pagar" : "bloqueado");
                        return s === "pagar";
                      }).map(mod => mod.id))) && (
                        <span style={{ fontWeight: 600, color: "#3B6D11" }}>
                          {PRECOS[m.id]?.label}
                        </span>
                      )}
                    </div>

                    {status === "concluido" && (
                      <Link to={`/modulo/${m.id}`} style={estilos.btnIniciar}>
                        Revisar
                      </Link>
                    )}
                    {status === "disponivel" && (
                      <Link to={`/modulo/${m.id}`} style={estilos.btnIniciar}>
                        Iniciar módulo →
                      </Link>
                    )}
                    {status === "pagar" && (
                      <button
                        type="button"
                        onClick={() => handleComprar(m.id)}
                        disabled={carregandoPgto === m.id}
                        style={{
                          ...estilos.btnIniciar,
                          background: "#e8a000",
                          color: "#fff",
                          border: "none",
                          cursor:
                            carregandoPgto === m.id ? "wait" : "pointer",
                        }}
                      >
                        {carregandoPgto === m.id
                          ? "Aguarde..."
                          : `Comprar — R$ ${[29.9, 49.9, 89.9, 149.9, 199.9][m.id - 1].toFixed(2).replace(".", ",")} `}
                      </button>
                    )}
                    {status === "bloqueado" && (
                      <span
                        style={{
                          fontSize: "0.82rem",
                          color: "#aaa",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        🔒 Conclua o módulo anterior
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé do painel */}
        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "1rem" }}>
          <Link
            to="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f0f7e8",
              border: "1px solid #c8e6a0",
              borderRadius: 99,
              padding: "0.6rem 1.25rem",
              textDecoration: "none",
              color: "#3B6D11",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            📰 Aceder ao Blog — artigos e recursos gratuitos
          </Link>
        </div>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.78rem",
            color: "#bbb",
            textAlign: "center",
            marginTop: "3rem",
          }}
        >
          Instituto ISTOP — Método científico de interrupção do ciclo do jogo
        </p>
      </div>
    </div>
  );
}


