import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { modulos } from "../data/modulosContent";

function buildIndiceGeral() {
  return Object.keys(modulos)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
    .map((modId) => ({
      modulo: `Módulo ${modId} — ${modulos[modId].nome}`,
      aulas: modulos[modId].aulas.map(
        (a) => `Aula ${a.id} — ${a.titulo}`,
      ),
    }));
}

function dataHoje() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function CertificadoPage() {
  const [virada, setVirada] = useState(false);
  const [encerrado, setEncerrado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const navigate = useNavigate();

  const indiceGeral = useMemo(() => buildIndiceGeral(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const nome =
        data?.user?.user_metadata?.full_name ||
        data?.user?.user_metadata?.name ||
        data?.user?.email?.split("@")[0] ||
        "Participante";
      setNomeUsuario(nome);
    });
  }, []);

  if (encerrado) {
    return (
      <div className="encerramento-programa">
        <div className="encerramento-inner">
          <div className="encerramento-selo">✦</div>
          <h1 className="encerramento-titulo">Parabéns, {nomeUsuario}.</h1>
          <p className="encerramento-subtitulo">
            Você concluiu o Método ISTOP.
          </p>
          <p className="encerramento-texto">
            Mudanças consistentes começam com pequenas escolhas repetidas ao
            longo do tempo. O percurso que você realizou representa o
            desenvolvimento de habilidades reais — que podem ser utilizadas
            sempre que necessário.
          </p>
          <p className="encerramento-texto">
            O processo não termina aqui. Ele continua a cada dia, a cada
            escolha, a cada pausa consciente diante de um impulso.
          </p>
          <div className="encerramento-citacao">
            &ldquo;Mudanças consistentes começam com pequenas escolhas repetidas ao
            longo do tempo.&rdquo;
          </div>
          <button
            type="button"
            className="encerramento-btn"
            onClick={() => navigate("/painel")}
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificado-pagina">
      <div className={`certificado-flip ${virada ? "virado" : ""}`}>
        {/* FRENTE */}
        <div className="certificado-face certificado-frente">
          <div className="cert-borda-outer">
            <div className="cert-borda-inner">
              <div className="cert-ornamento">❧</div>
              <h1 className="cert-titulo">Certificado de Conclusão</h1>
              <div className="cert-subtitulo-linha">
                <span>— Método ISTOP —</span>
              </div>
              <p className="cert-certificamos">Certificamos que</p>
              <div className="cert-nome-linha">
                <p className="cert-nome">{nomeUsuario}</p>
              </div>
              <p className="cert-descricao">concluiu o programa</p>
              <h2 className="cert-programa">
                Método ISTOP – Interrupção e Organização do Comportamento
              </h2>
              <p className="cert-corpo">
                dedicando-se ao processo de estudo, reflexão e desenvolvimento
                de estratégias voltadas à compreensão e reorganização de padrões
                comportamentais relacionados ao jogo online.
              </p>
              <div className="cert-temas">
                <span>• consciência do comportamento</span>
                <span>• identificação de gatilhos</span>
                <span>• autorregulação do impulso</span>
                <span>• reorganização de hábitos e rotinas</span>
                <span>• prevenção de recaídas e manutenção da mudança</span>
              </div>
              <p className="cert-reconhecimento">
                Reconhecemos o empenho, a dedicação e o compromisso
                demonstrados ao longo deste processo.
              </p>
              <p className="cert-frase-italico">
                <em>
                  Mudanças consistentes começam com pequenas escolhas repetidas
                  ao longo do tempo.
                </em>
              </p>
              <div className="cert-rodape">
                <div className="cert-data">
                  <span>Data de conclusão:</span>
                  <strong>{dataHoje()}</strong>
                </div>
                <div className="cert-assinatura">
                  <div className="cert-assinatura-linha" />
                  <span>Responsável pelo Programa</span>
                </div>
                <div className="cert-selo">
                  <div className="cert-selo-circulo">
                    <span>Método</span>
                    <strong>ISTOP</strong>
                    <span className="cert-selo-icone" aria-hidden>
                      🧠
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="cert-virar-btn"
            onClick={() => setVirada(true)}
          >
            Ver índice do programa →
          </button>
        </div>

        {/* VERSO */}
        <div className="certificado-face certificado-verso">
          <div className="cert-borda-outer">
            <div className="cert-borda-inner verso-inner">
              <h2 className="verso-titulo">Índice Geral</h2>
              <p className="verso-subtitulo">
                Método ISTOP — Interrupção e Organização do Comportamento
              </p>
              <div className="verso-modulos">
                {indiceGeral.map((m, i) => (
                  <div key={i} className="verso-modulo">
                    <p className="verso-modulo-nome">{m.modulo}</p>
                    <ul className="verso-aulas">
                      {m.aulas.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="cert-verso-btns">
            <button
              type="button"
              className="cert-virar-btn"
              onClick={() => setVirada(false)}
            >
              ← Ver certificado
            </button>
            <button
              type="button"
              className="cert-encerrar-btn"
              onClick={() => setEncerrado(true)}
            >
              Concluir programa ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
