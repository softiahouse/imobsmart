import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(247,246,242,0.95)',
        borderBottom: '1px solid #D8DFF0',
        padding: '0 24px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#1A3A6B',
            letterSpacing: '-0.01em',
          }}
        >
          Deja<span style={{ color: '#C8962A' }}>De</span>Jugar
        </Link>

        {/* Nav links + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link
            to="/#metodo"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '0.88rem',
              color: '#4A4A6A',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            El método
          </Link>
          <Link
            to="/#programa"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '0.88rem',
              color: '#4A4A6A',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            El programa
          </Link>
          <Link
            to="/blog"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '0.88rem',
              color: '#4A4A6A',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Blog
          </Link>

          {user ? (
            <>
              <Link
                to="/painel"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '0.88rem',
                  color: '#1A3A6B',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Mi panel
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '0.88rem',
                  color: '#4A4A6A',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/entrar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 20px',
                borderRadius: 12,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: '#1A3A6B',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(26,58,107,0.22)',
              }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
