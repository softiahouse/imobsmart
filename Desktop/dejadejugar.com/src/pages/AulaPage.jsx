import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { modulos } from "../data/modulosContent";

/** Fragmentos de texto com trechos **negrito** (sem markdown completo). */
function partesComNegrito(texto) {
  if (!texto) return null;
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, idx) => {
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return <strong key={idx}>{parte.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{parte}</span>;
  });
}

export default function AulaPage() {
  const { moduloId, aulaId } = useParams();
  const navigate = useNavigate();

  const mId = parseInt(moduloId);
  const aId = parseInt(aulaId);
  const modulo = modulos[mId];
  const aula = modulo?.aulas.find((a) => a.id === aId);
  const totalAulas = modulo?.aulas.length || 0;
  const isUltimaAula = aId === totalAulas;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/entrar");
    });
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mId, aId]);

  if (!modulo || !aula) {
    return (
      <div style={styles.centro}>
        <p style={{ fontFamily: "DM Sans, sans-serif", color: "#999" }}>
          Aula não encontrada.
        </p>
        <Link to="/painel" style={styles.linkVerde}>
          Voltar ao painel
        </Link>
      </div>
    );
  }

  async function irParaProxima() {
    // Salva progresso no Supabase ao concluir a última aula de qualquer módulo
    if (isUltimaAula) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("progresso_usuario")
          .upsert(
            { user_id: user.id, modulo_id: mId },
            { onConflict: "user_id,modulo_id" }
          );
      }
    }

    if (isUltimaAula && modulo.proximoPasso) {
      navigate(modulo.proximoPasso.rota);
    } else {
      navigate(`/modulo/${mId}/aula/${aId + 1}`);
    }
  }

  function irParaAnterior() {
    if (aId === 1) {
      navigate("/painel");
    } else {
      navigate(`/modulo/${mId}/aula/${aId - 1}`);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0" }}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <button onClick={() => navigate("/painel")} style={styles.btnVoltar}>
          ← Painel
        </button>

        <div style={styles.progressoWrap}>
          <span style={styles.progressoLabel}>
            Módulo {mId} · {modulo.nome}
          </span>
          <div style={styles.progressoBarOuter}>
            {modulo.aulas.map((a) => (
              <div
                key={a.id}
                style={{
                  ...styles.progressoSegmento,
                  background: a.id <= aId ? "#3B6D11" : "#E8E4DC",
                }}
              />
            ))}
          </div>
          <span style={styles.progressoCount}>
            {aId}/{totalAulas}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={styles.container}>
        {/* Cabeçalho da aula */}
        <div style={{ marginBottom: "2rem" }}>
          <span style={styles.labelAula}>Aula {aId}</span>
          <h1 style={styles.tituloAula}>{aula.titulo}</h1>
          <span style={styles.duracao}>⏱ {aula.duracao} de leitura</span>
        </div>

        {/* Ordem: conteudo (pode incluir bloco tipo exercicio) → quiz → exercicio|checkin em aula → encerramento → marcoJornada */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {aula.conteudo.map((bloco, i) => {
            if (bloco.tipo === "intro") {
              return (
                <p key={i} style={styles.intro}>
                  {bloco.texto}
                </p>
              );
            }
            if (bloco.tipo === "titulo") {
              return (
                <h2 key={i} style={styles.subtitulo}>
                  {bloco.texto}
                </h2>
              );
            }
            if (bloco.tipo === "subtitulo") {
              return (
                <h3 key={i} style={styles.subtituloSecao}>
                  {bloco.texto}
                </h3>
              );
            }
            if (bloco.tipo === "paragrafo") {
              return (
                <p key={i} style={styles.paragrafo}>
                  {bloco.texto}
                </p>
              );
            }
            if (bloco.tipo === "destaque") {
              return (
                <div key={i} style={styles.destaque}>
                  <p style={styles.destaqueTexto}>{bloco.texto}</p>
                </div>
              );
            }
            if (bloco.tipo === "imagem") {
              return (
                <figure key={i} style={styles.figuraImagem}>
                  <img
                    src={bloco.src}
                    alt={bloco.alt || ""}
                    style={styles.imagemConteudo}
                    loading="lazy"
                  />
                  {bloco.legenda && (
                    <figcaption style={styles.legendaImagem}>{bloco.legenda}</figcaption>
                  )}
                </figure>
              );
            }
            if (bloco.tipo === "coluna_imagem") {
              const paragrafos = (bloco.texto || "").split(/\n\n+/).filter(Boolean);
              return (
                <div key={i} style={styles.colunaImagemWrap}>
                  <div style={styles.colunaImagemTexto}>
                    {paragrafos.map((par, j) => (
                      <p key={j} style={styles.paragrafo}>
                        {partesComNegrito(par)}
                      </p>
                    ))}
                  </div>
                  <figure style={styles.colunaImagemFig}>
                    <img
                      src={bloco.src}
                      alt={bloco.alt || ""}
                      style={styles.imagemConteudo}
                      loading="lazy"
                    />
                  </figure>
                </div>
              );
            }
            if (bloco.tipo === "exercicio") {
              return (
                <div key={i} className="exercicio-modulo">
                  <h3>{bloco.titulo}</h3>
                  <p>{bloco.instrucao}</p>
                  <ul>
                    {bloco.itens.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                  {bloco.descricao && (
                    <p className="exercicio-descricao">{bloco.descricao}</p>
                  )}
                </div>
              );
            }
            if (bloco.tipo === "lista") {
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {bloco.itens.map((item, j) => {
                    if (typeof item === "string") {
                      return (
                        <div key={j} style={styles.itemLista}>
                          <p style={{ ...styles.itemDescricao, paddingLeft: "0.5rem", borderLeft: "3px solid #3B6D11" }}>
                            {item}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div key={j} style={styles.itemLista}>
                        <strong style={styles.itemTitulo}>{item.titulo}</strong>
                        <p style={styles.itemDescricao}>{item.descricao}</p>
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (bloco.tipo === "reflexao") {
              return (
                <div key={i} style={styles.reflexao}>
                  <span style={styles.reflexaoLabel}>{bloco.pergunta || "Reflexão"}</span>
                  <p style={styles.reflexaoTexto}>{bloco.texto}</p>
                </div>
              );
            }
            return null;
          })}

          {aula.quiz && aula.quiz.length > 0 && (
            <div style={styles.quizWrap}>
              <h2 style={styles.quizTitulo}>Quiz — confira o que aprendeu</h2>
              {aula.quiz.map((q) => (
                <div key={q.id} style={styles.quizItem}>
                  <p style={styles.paragrafo}>{q.pergunta}</p>
                  <details style={styles.quizDetails}>
                    <summary style={styles.quizSummary}>Ver resposta sugerida</summary>
                    <p style={styles.quizResposta}>
                      <strong>{q.respostaCorreta}</strong>
                      <span style={styles.quizTipo}> ({q.tipo.replace(/_/g, " ")})</span>
                    </p>
                  </details>
                </div>
              ))}
            </div>
          )}

          {aula.exercicio && (
            <div className="exercicio-modulo">
              <h3>{aula.exercicio.titulo}</h3>
              <p>{aula.exercicio.instrucao}</p>
              <ul>
                {aula.exercicio.itens.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              {aula.exercicio.descricao && (
                <p className="exercicio-descricao">{aula.exercicio.descricao}</p>
              )}
            </div>
          )}

          {aula.checkin && (
            <div className="checkin-modulo">
              <h3>{aula.checkin.titulo}</h3>
              <p>{aula.checkin.instrucao}</p>
              <ol>
                {aula.checkin.perguntas.map((pergunta, i) => (
                  <li key={i}>{pergunta}</li>
                ))}
              </ol>
            </div>
          )}

          {aula.encerramento && (
            <div style={styles.encerramento}>
              <p style={styles.encerramentoTexto}>{aula.encerramento}</p>
            </div>
          )}

          {aula.marcoJornada && (
            <div className="marco-jornada">
              <span className="marco-icone" aria-hidden>
                →
              </span>
              <div>
                <span style={styles.marcoJornadaLabel}>Marco de Jornada</span>
                <p style={styles.marcoJornadaTexto}>{aula.marcoJornada}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navegação entre aulas */}
        <div style={styles.navAulas}>
          <button onClick={irParaAnterior} style={styles.btnSecundario}>
            ← {aId === 1 ? "Painel" : `Aula ${aId - 1}`}
          </button>

          <button onClick={irParaProxima} style={styles.btnPrimario}>
            {isUltimaAula && modulo.proximoPasso
              ? modulo.proximoPasso.label + " →"
              : `Aula ${aId + 1} →`}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  centro: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    background: "#F7F5F0",
  },
  linkVerde: {
    color: "#3B6D11",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.9rem",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #E8E4DC",
    padding: "0.9rem 2rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  btnVoltar: {
    background: "none",
    border: "none",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.85rem",
    color: "#777",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
  },
  progressoWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  progressoLabel: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.78rem",
    color: "#999",
    flexShrink: 0,
  },
  progressoBarOuter: {
    flex: 1,
    display: "flex",
    gap: 4,
  },
  progressoSegmento: {
    flex: 1,
    height: 6,
    borderRadius: 99,
    transition: "background 0.3s",
  },
  progressoCount: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.78rem",
    color: "#3B6D11",
    fontWeight: 600,
    flexShrink: 0,
  },
  container: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 4rem",
  },
  labelAula: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.72rem",
    color: "#3B6D11",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.4rem",
  },
  tituloAula: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "2rem",
    color: "#1a1a1a",
    marginBottom: "0.5rem",
    lineHeight: 1.2,
  },
  duracao: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.8rem",
    color: "#aaa",
  },
  intro: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.2rem",
    color: "#333",
    lineHeight: 1.6,
    fontStyle: "italic",
    textAlign: "justify",
  },
  subtitulo: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.25rem",
    color: "#1a1a1a",
    marginTop: "0.5rem",
  },
  subtituloSecao: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.1rem",
    color: "#2a2a2a",
    marginTop: "0.35rem",
    marginBottom: 0,
    fontWeight: 600,
  },
  paragrafo: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "1rem",
    color: "#444",
    lineHeight: 1.75,
    textAlign: "justify",
  },
  destaque: {
    background: "#EFF5E8",
    border: "1px solid #C8DFB0",
    borderLeft: "4px solid #3B6D11",
    borderRadius: 10,
    padding: "1.25rem 1.5rem",
  },
  destaqueTexto: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.05rem",
    color: "#2A5009",
    lineHeight: 1.55,
    margin: 0,
  },
  figuraImagem: {
    margin: "1rem 0",
    textAlign: "center",
  },
  imagemConteudo: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: 10,
    border: "1px solid #E8E4DC",
    display: "block",
    margin: "0 auto",
  },
  legendaImagem: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.82rem",
    color: "#777",
    marginTop: "0.6rem",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  colunaImagemWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1.5rem",
    alignItems: "flex-start",
    margin: "0.5rem 0",
  },
  colunaImagemTexto: {
    flex: "1 1 280px",
    minWidth: 0,
  },
  colunaImagemFig: {
    flex: "0 1 300px",
    margin: 0,
    maxWidth: "100%",
    alignSelf: "center",
  },
  itemLista: {
    background: "#fff",
    border: "1px solid #E8E4DC",
    borderRadius: 10,
    padding: "1rem 1.25rem",
  },
  itemTitulo: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.9rem",
    color: "#1a1a1a",
    display: "block",
    marginBottom: "0.25rem",
  },
  itemDescricao: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.88rem",
    color: "#666",
    lineHeight: 1.55,
    margin: 0,
    textAlign: "justify",
  },
  reflexao: {
    background: "#FFF8F0",
    border: "1px solid #F0DFC0",
    borderRadius: 10,
    padding: "1.25rem 1.5rem",
  },
  reflexaoLabel: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.72rem",
    color: "#B07030",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.5rem",
  },
  reflexaoTexto: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.95rem",
    color: "#664420",
    lineHeight: 1.6,
    margin: 0,
    textAlign: "justify",
  },
  encerramento: {
    background: "#fff",
    border: "1px solid #C8DFB0",
    borderRadius: 10,
    padding: "1.25rem 1.5rem",
    marginTop: "0.5rem",
  },
  encerramentoTexto: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.02rem",
    color: "#2A5009",
    lineHeight: 1.65,
    margin: 0,
    textAlign: "justify",
  },
  marcoJornadaLabel: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.72rem",
    color: "#B07030",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    display: "block",
    marginBottom: "0.5rem",
  },
  marcoJornadaTexto: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.95rem",
    color: "#333",
    lineHeight: 1.65,
    margin: 0,
    textAlign: "justify",
  },
  quizWrap: {
    marginTop: "0.5rem",
    padding: "1.5rem",
    background: "#fafafa",
    border: "1px solid #E8E4DC",
    borderRadius: 12,
  },
  quizTitulo: {
    fontFamily: "DM Serif Display, serif",
    fontSize: "1.2rem",
    color: "#1a1a1a",
    marginBottom: "1rem",
    marginTop: 0,
  },
  quizItem: {
    marginBottom: "1.25rem",
  },
  quizDetails: {
    marginTop: "0.5rem",
  },
  quizSummary: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.85rem",
    color: "#3B6D11",
    cursor: "pointer",
    fontWeight: 600,
  },
  quizResposta: {
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.9rem",
    color: "#444",
    margin: "0.5rem 0 0",
    lineHeight: 1.5,
  },
  quizTipo: {
    color: "#888",
    fontWeight: 400,
    fontSize: "0.82rem",
  },
  navAulas: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "3rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #E8E4DC",
    gap: "1rem",
  },
  btnPrimario: {
    background: "#3B6D11",
    color: "#fff",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    padding: "0.7rem 1.5rem",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },
  btnSecundario: {
    background: "#fff",
    color: "#555",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.9rem",
    padding: "0.7rem 1.25rem",
    borderRadius: 10,
    border: "1px solid #ddd",
    cursor: "pointer",
  },
};
