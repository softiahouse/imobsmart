export default function Footer() {
  return (
    <footer
      style={{
        background: "#F7F5F0",
        borderTop: "1px solid #E8E4DC",
        padding: "4rem 1.5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#3B6D11",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Para familiares
        </p>

        <h2
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.6rem",
            color: "#1a1a1a",
            lineHeight: 1.25,
            marginBottom: "1.5rem",
          }}
        >
          Para quem ama e sofre junto
        </h2>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            color: "#444",
            lineHeight: 1.8,
            fontStyle: "italic",
            marginBottom: "1rem",
          }}
        >
          Nós vemos você.
        </p>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#555",
            lineHeight: 1.8,
            marginBottom: "1rem",
          }}
        >
          Sabemos o quanto dói ver alguém que você ama se perdendo nos jogos. As noites em claro, as discussões
          que se repetem, a sensação de impotência quando as palavras não alcançam... Você já tentou de tudo. Já
          chorou escondido. Já se perguntou <em>"o que eu fiz de errado?"</em>.
        </p>

        <p
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1rem",
            color: "#3B6D11",
            marginBottom: "0.5rem",
          }}
        >
          Não foi sua culpa.
        </p>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#555",
            lineHeight: 1.8,
            marginBottom: "2rem",
          }}
        >
          A dependência não é escolha. E você não precisa carregar esse peso sozinho.
        </p>

        <h3
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.2rem",
            color: "#1a1a1a",
            marginBottom: "0.75rem",
          }}
        >
          Seu coração merece paz
        </h3>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#555",
            lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}
        >
          Enquanto você tenta ajudar quem ama, quem está cuidando de você? Aqui, entendemos que a família também
          adoece. E também precisa ser cuidada. Por isso criamos um espaço só para você:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "2rem" }}>
          {[
            {
              icone: "🤗",
              texto: "Grupo de Apoio — onde você pode desabafar sem julgamento e encontrar quem realmente entende sua dor",
            },
            {
              icone: "📗",
              texto: 'Guia "Amando sem Se Perder" — palavras que vão te abraçar e te mostrar que existe saída',
            },
            {
              icone: "💬",
              texto: "Conversa Particular — às vezes, tudo o que precisamos é de alguém que escute de verdade",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                padding: "0.75rem 1rem",
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #E8E4DC",
              }}
            >
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icone}</span>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.88rem",
                  color: "#444",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.2rem",
            color: "#1a1a1a",
            marginBottom: "0.75rem",
          }}
        >
          Existe esperança. Nós prometemos.
        </h3>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#555",
            lineHeight: 1.8,
            marginBottom: "1rem",
          }}
        >
          Já vimos famílias inteiras se reencontrarem. Já vimos o amor vencer o medo. Já vimos recomeços lindos
          acontecerem. O seu também pode acontecer. Não desista. Não se isole. Respire fundo. E nos permita te
          ajudar a carregar esse fardo.
        </p>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#3B6D11",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Você é mais importante do que imagina.
        </p>

        <div
          style={{
            borderLeft: "3px solid #3B6D11",
            paddingLeft: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1rem",
              color: "#444",
              fontStyle: "italic",
              lineHeight: 1.7,
            }}
          >
            "Cuidar de quem cuida não é apenas parte do tratamento. É um ato de amor."
          </p>
        </div>

        <a
          href="/quiz/familias"
          style={{
            display: "inline-block",
            background: "#3B6D11",
            color: "#fff",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            padding: "0.85rem 2rem",
            borderRadius: 10,
            textDecoration: "none",
            marginBottom: "3rem",
          }}
        >
          Fazer o teste para familiares →
        </a>

        <div
          style={{
            borderTop: "1px solid #E8E4DC",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa" }}>
            © 2025 Instituto ISTOP. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="/privacidade"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa", textDecoration: "none" }}
            >
              Privacidade
            </a>
            <a
              href="/termos"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa", textDecoration: "none" }}
            >
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
