import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #E5E0D8', borderTop: '3px solid #1B3558', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}/>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}>Carregando...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/entrar" replace />
  return children
}
