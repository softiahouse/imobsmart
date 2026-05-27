export default function Footer() {
  return (
    <footer
      style={{
        background: "#F7F6F2",
        borderTop: "1px solid #D8DFF0",
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
            color: "#1A3A6B",
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
          Para quienes aman y sufren junto a ellos
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
          Te vemos.
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
          Sabemos cuánto duele ver a alguien que amas perdiéndose en el juego. Las noches en vela, las discusiones
          que se repiten, la sensación de impotencia cuando las palabras no llegan... Ya lo has intentado todo. Has
          llorado a escondidas. Te has preguntado <em>"¿qué hice mal?"</em>.
        </p>

        <p
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1rem",
            color: "#1A3A6B",
            marginBottom: "0.5rem",
          }}
        >
          No fue tu culpa.
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
          La dependencia no es una elección. Y no tienes que cargar con ese peso solo.
        </p>

        <h3
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.2rem",
            color: "#1a1a1a",
            marginBottom: "0.75rem",
          }}
        >
          Tu corazón merece paz
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
          Mientras intentas ayudar a quien amas, ¿quién está cuidando de ti? Aquí entendemos que la familia también
          enferma. Y también necesita ser cuidada. Por eso hemos creado un espacio solo para ti:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "2rem" }}>
          {[
            {
              icone: "🤗",
              texto: "Grupo de Apoyo — donde puedes hablar sin ser juzgado y encontrar a quienes realmente entienden tu dolor",
            },
            {
              icone: "📗",
              texto: 'Guía "Amando sin Perderse" — palabras que te van a abrazar y te mostrarán que hay una salida',
            },
            {
              icone: "💬",
              texto: "Conversación privada — a veces, todo lo que necesitamos es alguien que escuche de verdad",
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
                border: "1px solid #D8DFF0",
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
          Hay esperanza. Te lo prometemos.
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
          Ya hemos visto familias enteras reencontrarse. Hemos visto al amor vencer al miedo. Hemos visto comienzos
          hermosos suceder. El tuyo también puede suceder. No te rindas. No te aisles. Respira hondo. Y permítenos
          ayudarte a llevar esa carga.
        </p>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.93rem",
            color: "#1A3A6B",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          Eres más importante de lo que imaginas.
        </p>

        <div
          style={{
            borderLeft: "3px solid #1A3A6B",
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
            "Cuidar de quien cuida no es solo parte del tratamiento. Es un acto de amor."
          </p>
        </div>

        <a
          href="/quiz/familias"
          style={{
            display: "inline-block",
            background: "#1A3A6B",
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
          Hacer el test para familiares →
        </a>

        <div
          style={{
            borderTop: "1px solid #D8DFF0",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa" }}>
            © 2025 Instituto ISTOP España. Todos los derechos reservados.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="/privacidade"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa", textDecoration: "none" }}
            >
              Privacidad
            </a>
            <a
              href="/termos"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#aaa", textDecoration: "none" }}
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
