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
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'DM Serif Display', fontSize: 28, color: 'var(--navy)' }}>Deja<span style={{ color: '#C8962A' }}>De</span>Jugar</Link>
          <h1 style={{ fontSize: 26, marginTop: 16, marginBottom: 8 }}>Recuperar contraseña</h1>
          <p style={{ color: 'var(--text-muted)' }}>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>
        <div className="card">
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <p style={{ color: 'var(--green)', fontWeight: 600, marginBottom: 8 }}>¡Correo enviado!</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.</p>
              <Link to="/entrar" className="btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>Volver al inicio de sesión</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--navy)' }}>Correo electrónico de tu cuenta</label>
                <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
              </div>
              {status === 'error' && <p style={{ color: 'var(--red)', fontSize: 14 }}>Ups, algo salió mal. Inténtalo de nuevo.</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Enviar enlace de recuperación</button>
              <Link to="/entrar" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>← Volver al inicio de sesión</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
