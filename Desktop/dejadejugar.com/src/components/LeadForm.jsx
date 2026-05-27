import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LeadForm({ dark, tipo }) {
  const labelColor = dark ? 'rgba(255,255,255,0.9)' : 'var(--navy)'
  const muted = dark ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)'
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const row = { ...form }
    if (tipo) row.message = `[${tipo}] ${form.message || ''}`.trim()
    const { error } = await supabase.from('leads').insert([row])
    if (error) { setStatus('error'); return }
    setStatus('success')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  if (status === 'success') return (
    <div style={{ textAlign: 'center', padding: '40px 24px', animation: 'fadeUp 0.5s ease both' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
      <h3 style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: dark ? 'white' : 'var(--navy)', marginBottom: 12 }}>Recebemos seu contato!</h3>
      <p style={{ color: dark ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>Em breve entraremos em contato. O primeiro passo já foi dado.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: labelColor }}>Seu nome *</label>
        <input className="input" type="text" required placeholder="Como você se chama?" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: labelColor }}>E-mail *</label>
        <input className="input" type="email" required placeholder="seu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: labelColor }}>WhatsApp</label>
        <input className="input" type="tel" placeholder="(48) 99999-9999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: labelColor }}>Como posso te ajudar?</label>
        <textarea className="input" rows={3} placeholder="Conte um pouco sobre sua situação (opcional)" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: 'vertical' }}/>
      </div>
      {status === 'error' && <p style={{ color: 'var(--red)', fontSize: 14 }}>Ops, algo deu errado. Tente novamente.</p>}
      <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
        {status === 'loading' ? 'Enviando...' : 'Quero Receber Orientação Gratuita'}
      </button>
      <p style={{ fontSize: 12, color: muted, textAlign: 'center' }}>Seus dados são confidenciais. Sem spam.</p>
    </form>
  )
}
