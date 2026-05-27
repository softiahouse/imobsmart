import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    if (form.password !== form.confirm) { setError('As senhas não conferem.'); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password)
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
  }

  if (success) return (
    <div className="page-auth">
      <div className="card" style={{ textAlign: 'center', maxWidth: 440, borderRadius: 22, padding: '40px 32px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 28, color: 'var(--navy)', marginBottom: 12 }}>Confirme seu e-mail</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: 15 }}>
          Enviamos um link de confirmação para <strong style={{ color: 'var(--navy)' }}>{form.email}</strong>. Clique no link para ativar sua conta e iniciar sua jornada.
        </p>
        <Link to="/entrar" className="btn-primary" style={{ display: 'inline-block', marginTop: 28 }}>Voltar ao Login</Link>
      </div>
    </div>
  )

  return (
    <div className="page-auth">
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: 'var(--navy)', fontWeight: 600 }}>
              Pare<span style={{ color: 'var(--orange)' }}>De</span>Jogar
            </div>
          </Link>
          <h1 style={{ fontSize: 28, marginTop: 20, marginBottom: 8, color: 'var(--navy)' }}>Comece sua recuperação</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Cadastro gratuito — sem cartão de crédito</p>
        </div>

        <div className="card" style={{ borderRadius: 22, padding: '32px 28px' }}>
          <button type="button" onClick={signInWithGoogle} className="btn-oauth" style={{ marginBottom: 22 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Cadastrar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>ou com e-mail</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--navy)' }}>E-mail</label>
              <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--navy)' }}>Senha</label>
              <input className="input" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--navy)' }}>Confirmar senha</label>
              <input className="input" type="password" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Repita sua senha" />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', textAlign: 'center' }}>
              {loading ? 'Criando conta...' : 'Criar minha conta gratuita'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
            </p>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          Já tem conta?{' '}
          <Link to="/entrar" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
