import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../instituto.css'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="istop-nav">
      <div className="istop-nav-inner">
        <Link to="/" style={{ textDecoration: "none", display: "flex" }}>
          <img
            src="/logo-instituto-istop.svg"
            alt="Instituto ISTOP"
            style={{ height: 56, width: "auto" }}
          />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <Link
                to="/blog"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                  color: "#3B6D11",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Blog
              </Link>
              <Link to="/painel" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>
                Meu painel
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 14,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/blog"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.88rem",
                  color: "#3B6D11",
                  fontWeight: 600,
                  textDecoration: "none",
                  marginRight: "1rem",
                }}
              >
                Blog
              </Link>
              <Link to="/entrar" className="istop-nav-cta">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
