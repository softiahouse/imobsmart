import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("publicado", true)
        .single();
      if (data) {
        setPost(data);
        await supabase.from("blog_posts").update({ visualizacoes: (data.visualizacoes || 0) + 1 }).eq("id", data.id);
      }
      setLoading(false);
    }
    carregar();
  }, [slug]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", color: "#aaa" }}>Carregando...</div>;
  if (!post) return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "DM Sans, sans-serif" }}><p style={{ color: "#888" }}>Post não encontrado.</p><Link to="/blog" style={{ color: "#3B6D11", fontWeight: 600 }}>← Voltar ao blog</Link></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f9f6f1", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e4dc", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/blog" style={{ fontSize: "0.82rem", color: "#888", textDecoration: "none" }}>← Blog</Link>
        <span style={{ color: "#ddd" }}>/</span>
        <span style={{ fontSize: "0.82rem", color: "#555" }}>{post.titulo}</span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {post.imagem_url && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: "1.5rem", height: 280, position: "relative" }}>
            <img src={post.imagem_url} alt={post.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <span style={{ fontSize: "0.72rem", color: "#3B6D11", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{post.categoria}</span>
        <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "2rem", color: "#1a1a1a", margin: "0.5rem 0 0.75rem", lineHeight: 1.2 }}>{post.titulo}</h1>
        {post.resumo && <p style={{ fontSize: "1rem", color: "#666", fontStyle: "italic", marginBottom: "1.5rem", lineHeight: 1.6, borderLeft: "3px solid #3B6D11", paddingLeft: "1rem" }}>{post.resumo}</p>}
        <div style={{ borderTop: "1px solid #e8e4dc", paddingTop: "1.5rem", fontSize: "0.95rem", color: "#333", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{post.conteudo}</div>
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e8e4dc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/blog" style={{ color: "#3B6D11", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>← Mais artigos</Link>
          <span style={{ fontSize: "0.78rem", color: "#aaa" }}>{post.visualizacoes} leituras</span>
        </div>
      </div>
    </div>
  );
}
