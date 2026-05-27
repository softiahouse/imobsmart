import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const CATEGORIAS = ["todos", "jogador", "familia", "educacao"];
const LABELS = { todos: "Todos", jogador: "Jogador", familia: "Família", educacao: "Educação" };

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      let query = supabase
        .from("blog_posts")
        .select("id, titulo, slug, categoria, resumo, imagem_url, visualizacoes, created_at")
        .eq("publicado", true)
        .order("created_at", { ascending: false });
      if (categoria !== "todos") query = query.eq("categoria", categoria);
      const { data } = await query;
      setPosts(data || []);
      setLoading(false);
    }
    carregar();
  }, [categoria]);

  const destaque = posts[0];
  const demais = posts.slice(1);
  const maisVistos = [...posts].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#f9f6f1", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e4dc", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo-icon.png" alt="PareDeJogar" style={{ height: 36 }} />
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.1rem", color: "#3B6D11" }}>Blog</span>
        </Link>
        <Link to="/painel" style={{ fontSize: "0.82rem", color: "#3B6D11", fontWeight: 600, textDecoration: "none" }}>Meu painel →</Link>
      </div>

      {/* Ticker */}
      <div style={{ background: "#1a1a1a", overflow: "hidden", height: 36, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 32, animation: "ticker 20s linear infinite", whiteSpace: "nowrap", padding: "0 2rem" }}>
          {[...Array(3)].flatMap(() => posts.map((p, i) => (
            <span key={`${p.id}-${i}`} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>{p.titulo}</span>
          )))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {CATEGORIAS.map(c => (
            <button key={c} onClick={() => setCategoria(c)} style={{
              padding: "6px 18px", borderRadius: 99, border: "1px solid",
              borderColor: categoria === c ? "#3B6D11" : "#e8e4dc",
              background: categoria === c ? "#3B6D11" : "#fff",
              color: categoria === c ? "#fff" : "#555",
              fontSize: "0.82rem", fontWeight: categoria === c ? 600 : 400,
              cursor: "pointer", fontFamily: "DM Sans, sans-serif",
            }}>{LABELS[c]}</button>
          ))}
          <button onClick={() => setCategoria("maisvistos")} style={{
            padding: "6px 18px", borderRadius: 99, border: "1px solid",
            borderColor: categoria === "maisvistos" ? "#3B6D11" : "#e8e4dc",
            background: categoria === "maisvistos" ? "#3B6D11" : "#fff",
            color: categoria === "maisvistos" ? "#fff" : "#555",
            fontSize: "0.82rem", fontWeight: categoria === "maisvistos" ? 600 : 400,
            cursor: "pointer", fontFamily: "DM Sans, sans-serif",
          }}>Mais vistos</button>
        </div>

        {loading && <p style={{ color: "#aaa", textAlign: "center", padding: "3rem 0" }}>Carregando...</p>}

        {!loading && (categoria === "maisvistos" ? maisVistos : posts).length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", padding: "3rem 0" }}>Nenhum post nesta categoria ainda.</p>
        )}

        {/* Destaque */}
        {!loading && categoria !== "maisvistos" && destaque && (
          <Link to={`/blog/${destaque.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 280, background: "#1a3a0a" }}>
              {destaque.imagem_url && (
                <img src={destaque.imagem_url} alt={destaque.titulo} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, position: "absolute", inset: 0 }} />
              )}
              {/* Watermark logo */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.06 }}>
                <img src="/logo-icon.png" alt="" style={{ width: 180 }} />
              </div>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "1.5rem" }}>
                <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.2)", maxWidth: "80%" }}>
                  <span style={{ fontSize: "0.7rem", color: "#7dc742", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, display: "block", marginBottom: 4 }}>Destaque · {LABELS[destaque.categoria] || destaque.categoria}</span>
                  <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.2rem", color: "#fff", margin: "0 0 4px", lineHeight: 1.3 }}>{destaque.titulo}</h2>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>{destaque.visualizacoes} leituras</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {!loading && (categoria === "maisvistos" ? maisVistos : demais).map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc", overflow: "hidden", transition: "box-shadow 0.2s" }}>
                <div style={{ height: 120, background: post.imagem_url ? "none" : "linear-gradient(135deg, #1a3a0a, #3B6D11)", position: "relative", overflow: "hidden" }}>
                  {post.imagem_url
                    ? <img src={post.imagem_url} alt={post.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}><img src="/logo-icon.png" alt="" style={{ width: 60 }} /></div>
                  }
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "0.65rem", padding: "3px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.08em" }}>{LABELS[post.categoria] || post.categoria}</span>
                </div>
                <div style={{ padding: "0.75rem 1rem" }}>
                  <h3 style={{ fontFamily: "DM Serif Display, serif", fontSize: "0.95rem", color: "#1a1a1a", margin: "0 0 4px", lineHeight: 1.35 }}>{post.titulo}</h3>
                  {post.resumo && <p style={{ fontSize: "0.78rem", color: "#888", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.resumo}</p>}
                  <p style={{ fontSize: "0.7rem", color: "#aaa", margin: "6px 0 0" }}>{post.visualizacoes} leituras</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Redes sociais */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc", padding: "1.25rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Comunidade</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <a href="https://instagram.com/paredejogar" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#fce4f0", borderRadius: 12, padding: "10px 12px", border: "1px solid #f4c0d1", textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#E1306C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem" }}>📸</div>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Instagram</p>
                <p style={{ fontSize: "0.7rem", color: "#888", margin: 0 }}>@paredejogar</p>
              </div>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#e1f5ee", borderRadius: 12, padding: "10px 12px", border: "1px solid #9fe1cb", textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem" }}>💬</div>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Canal WhatsApp</p>
                <p style={{ fontSize: "0.7rem", color: "#888", margin: 0 }}>Entrar no grupo</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      `}</style>
    </div>
  );
}
