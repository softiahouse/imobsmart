import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await resetPassword(email)
    setStatus(error ? 'error' : 'success')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'DM Serif Display', fontSize: 28, color: 'var(--navy)' }}>Pare<span style={{ color: 'var(--orange)' }}>De</span>Jogar</Link>
          <h1 style={{ fontSize: 26, marginTop: 16, marginBottom: 8 }}>Recuperar senha</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enviaremos um link para redefinir sua senha</p>
        </div>
        <div className="card">
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <p style={{ color: 'var(--green)', fontWeight: 600, marginBottom: 8 }}>E-mail enviado!</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
              <Link to="/entrar" className="btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>Voltar ao Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--navy)' }}>E-mail da conta</label>
                <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
              {status === 'error' && <p style={{ color: 'var(--red)', fontSize: 14 }}>Ops, algo deu errado. Tente novamente.</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Enviar link de recuperação</button>
              <Link to="/entrar" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>← Voltar ao login</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
