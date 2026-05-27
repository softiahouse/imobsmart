import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function NovaSenha() {
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setErro('')
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirma) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setCarregando(false)

    if (error) {
      setErro('Erro ao atualizar a senha. Tente novamente.')
    } else {
      setSucesso(true)
      setTimeout(() => navigate('/painel', { replace: true }), 2500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream, #f5f0e8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--navy, #1a2e44)', fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          Nova senha
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Escolha uma senha segura para a sua conta.
        </p>

        {sucesso ? (
          <p style={{ color: 'green', fontWeight: 600 }}>
            ✅ Senha atualizada! Redirecionando...
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nova senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirma}
              onChange={e => setConfirma(e.target.value)}
              style={{ ...inputStyle, marginTop: '0.75rem' }}
            />
            {erro && (
              <p style={{ color: 'var(--red, #c0392b)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                {erro}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={carregando}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: 'var(--green, #27ae60)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '1rem',
                cursor: carregando ? 'not-allowed' : 'pointer',
                opacity: carregando ? 0.7 : 1
              }}
            >
              {carregando ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1.5px solid #ddd',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box'
}
