import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const ADMIN_PASSWORD = "istop2025@blog";

function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogAdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ titulo: "", slug: "", categoria: "jogador", resumo: "", conteudo: "", imagem_url: "", publicado: false });
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  const [aba, setAba] = useState("lista");

  useEffect(() => {
    if (localStorage.getItem("blog_admin") === "ok") setAutenticado(true);
  }, []);

  useEffect(() => {
    if (autenticado) carregarPosts();
  }, [autenticado]);

  async function carregarPosts() {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  }

  function login(e) {
    e.preventDefault();
    if (senha === ADMIN_PASSWORD) {
      localStorage.setItem("blog_admin", "ok");
      setAutenticado(true);
    } else {
      setMsg("Senha incorreta.");
    }
  }

  function novoPost() {
    setForm({ titulo: "", slug: "", categoria: "jogador", resumo: "", conteudo: "", imagem_url: "", publicado: false });
    setEditandoId(null);
    setAba("editor");
  }

  function editarPost(p) {
    setForm({ titulo: p.titulo, slug: p.slug, categoria: p.categoria, resumo: p.resumo || "", conteudo: p.conteudo || "", imagem_url: p.imagem_url || "", publicado: p.publicado });
    setEditandoId(p.id);
    setAba("editor");
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setMsg("");
    const dados = {
      ...form,
      slug: form.slug || slugify(form.titulo),
      updated_at: new Date().toISOString()
    };
    if (editandoId) {
      const { error } = await supabase.from("blog_posts").update(dados).eq("id", editandoId);
      setMsg(error ? `Erro: ${error.message}` : "Post atualizado!");
    } else {
      const { error } = await supabase.from("blog_posts").insert(dados);
      setMsg(error ? `Erro: ${error.message}` : "Post criado com sucesso!");
      if (!error) {
        setTimeout(() => {
          setForm({ titulo: "", slug: "", categoria: "jogador", resumo: "", conteudo: "", imagem_url: "", publicado: false });
          setAba("lista");
        }, 1500);
      }
    }
    setSalvando(false);
    carregarPosts();
  }

  async function togglePublicado(p) {
    await supabase.from("blog_posts").update({ publicado: !p.publicado }).eq("id", p.id);
    carregarPosts();
  }

  async function deletar(id) {
    if (!confirm("Apagar este post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    carregarPosts();
  }

  const s = { container: { minHeight: "100vh", background: "#f9f6f1", fontFamily: "DM Sans, sans-serif" }, header: { background: "#1a1a1a", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }, label: { fontSize: "0.78rem", color: "#555", display: "block", marginBottom: 4, fontWeight: 500 }, input: { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e8e4dc", borderRadius: 8, fontSize: "0.88rem", fontFamily: "DM Sans, sans-serif", background: "#fff", marginBottom: "1rem" }, textarea: { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e8e4dc", borderRadius: 8, fontSize: "0.88rem", fontFamily: "DM Sans, sans-serif", background: "#fff", marginBottom: "1rem", resize: "vertical" }, btnPrimary: { background: "#3B6D11", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }, btnSecondary: { background: "#fff", color: "#555", border: "1px solid #e8e4dc", padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans, sans-serif" } };

  if (!autenticado) return (
    <div style={{ ...s.container, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={login} style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: 320, border: "1px solid #e8e4dc" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="/logo-icon.png" alt="" style={{ height: 48, marginBottom: 8 }} />
          <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.25rem", color: "#1a1a1a", margin: 0 }}>Blog Admin</h2>
        </div>
        <label style={s.label}>Senha de acesso</label>
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} style={s.input} placeholder="••••••••" />
        {msg && <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: 8 }}>{msg}</p>}
        <button type="submit" style={{ ...s.btnPrimary, width: "100%" }}>Entrar</button>
      </form>
    </div>
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={{ fontFamily: "DM Serif Display, serif", color: "#7dc742", fontSize: "1rem" }}>Blog Admin</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/blog" target="_blank" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", textDecoration: "none" }}>Ver blog →</a>
          <button onClick={() => { localStorage.removeItem("blog_admin"); setAutenticado(false); }} style={{ ...s.btnSecondary, fontSize: "0.75rem", padding: "4px 10px" }}>Sair</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          <button onClick={() => setAba("lista")} style={{ ...s.btnSecondary, background: aba === "lista" ? "#3B6D11" : "#fff", color: aba === "lista" ? "#fff" : "#555", border: aba === "lista" ? "none" : "1px solid #e8e4dc" }}>Posts ({posts.length})</button>
          <button onClick={novoPost} style={s.btnPrimary}>+ Novo post</button>
        </div>

        {aba === "lista" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {posts.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #e8e4dc", display: "flex", alignItems: "center", gap: 12 }}>
                {p.imagem_url && <img src={p.imagem_url} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 2px" }}>{p.titulo}</p>
                  <p style={{ fontSize: "0.75rem", color: "#aaa", margin: 0 }}>{p.categoria} · {p.visualizacoes} leituras · {p.publicado ? "✅ Publicado" : "⏸ Rascunho"}</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => togglePublicado(p)} style={{ ...s.btnSecondary, fontSize: "0.75rem", padding: "4px 10px" }}>{p.publicado ? "Despublicar" : "Publicar"}</button>
                  <button onClick={() => editarPost(p)} style={{ ...s.btnSecondary, fontSize: "0.75rem", padding: "4px 10px" }}>Editar</button>
                  <button onClick={() => deletar(p.id)} style={{ ...s.btnSecondary, fontSize: "0.75rem", padding: "4px 10px", color: "#e74c3c" }}>Apagar</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: "2rem" }}>Nenhum post ainda. Cria o primeiro!</p>}
          </div>
        )}

        {aba === "editor" && (
          <form onSubmit={salvar} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #e8e4dc" }}>
            <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.25rem", color: "#1a1a1a", marginBottom: "1.25rem" }}>{editandoId ? "Editar post" : "Novo post"}</h2>
            <label style={s.label}>Título *</label>
            <input required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value, slug: slugify(e.target.value) }))} style={s.input} placeholder="Título do artigo" />
            <label style={s.label}>URL (slug)</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={s.input} placeholder="url-do-artigo" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
              <div>
                <label style={s.label}>Categoria</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={{ ...s.input }}>
                  <option value="jogador">Jogador</option>
                  <option value="familia">Família</option>
                  <option value="educacao">Educação</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 20 }}>
                <input type="checkbox" id="publicado" checked={form.publicado} onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))} />
                <label htmlFor="publicado" style={{ fontSize: "0.88rem", color: "#555" }}>Publicar imediatamente</label>
              </div>
            </div>
            <label style={s.label}>Imagem de capa</label>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "1.5rem",
                border: "2px dashed #c8e6a0",
                borderRadius: 12,
                background: "#f0f7e8",
                cursor: "pointer",
                marginBottom: 8,
              }}>
                <span style={{ fontSize: "1.5rem" }}>📷</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#3B6D11" }}>Clique aqui e envie sua imagem</span>
                <span style={{ fontSize: "0.75rem", color: "#888" }}>Formatos aceitos: JPG, PNG, WEBP · Tamanho máximo: 50MB</span>
                <span style={{ fontSize: "0.72rem", color: "#aaa" }}>Tamanho recomendado: 1200 × 630px</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 50 * 1024 * 1024) { setMsg("Imagem muito grande. Máximo 50MB."); return; }
                    setMsg("Enviando imagem...");
                    const ext = file.name.split(".").pop();
                    const nome = `${Date.now()}.${ext}`;
                    const { error } = await supabase.storage.from("blog-imagens").upload(nome, file, { upsert: true });
                    if (error) { setMsg("Erro ao enviar imagem."); return; }
                    const { data: urlData } = supabase.storage.from("blog-imagens").getPublicUrl(nome);
                    setForm(f => ({ ...f, imagem_url: urlData.publicUrl }));
                    setMsg("✅ Imagem enviada com sucesso!");
                  }}
                />
              </label>
              {form.imagem_url && (
                <div style={{ position: "relative" }}>
                  <img src={form.imagem_url} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, imagem_url: "" }))}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 99, width: 28, height: 28, cursor: "pointer", fontSize: "0.9rem" }}
                  >×</button>
                </div>
              )}
            </div>
            <label style={s.label}>Resumo (aparece nos cards)</label>
            <textarea value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} style={{ ...s.textarea, height: 70 }} placeholder="Breve descrição do artigo..." />
            <label style={s.label}>Conteúdo completo *</label>
            <textarea required value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} style={{ ...s.textarea, height: 300 }} placeholder="Escreve o artigo aqui..." />
            {msg && <p style={{ color: msg.includes("Erro") ? "#e74c3c" : "#3B6D11", fontSize: "0.82rem", marginBottom: 8 }}>{msg}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={salvando} style={s.btnPrimary}>{salvando ? "Salvando..." : editandoId ? "Guardar alterações" : "Criar post"}</button>
              <button type="button" onClick={() => setAba("lista")} style={s.btnSecondary}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
