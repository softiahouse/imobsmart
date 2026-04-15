import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { Send, MessageCircle, Wifi, WifiOff, QrCode, RefreshCw, Bot, User, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function WhatsApp() {
  const { tenant } = useAuth();
  const [status, setStatus] = useState({ status: 'disconnected', qr: null, phone: null });
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    loadStatus();
    loadConversations();

    // Conectar socket — usa VITE_API_URL em produção, raiz em dev
    const token = localStorage.getItem('crm_token');
    const socketUrl = import.meta.env.VITE_API_URL || '/';
    socketRef.current = io(socketUrl, { auth: { token } });
    socketRef.current.on('whatsapp:connected', () => { loadStatus(); toast.success('WhatsApp conectado!'); });
    socketRef.current.on('whatsapp:disconnected', () => setStatus(s => ({ ...s, status: 'disconnected' })));
    socketRef.current.on('whatsapp:qr', (data) => setStatus(s => ({ ...s, qr: data.qr, status: 'qr_ready' })));
    socketRef.current.on('whatsapp:message', (data) => {
      loadConversations();
      if (selected?.id === data.conversationId) {
        setMessages(m => [...m, data.message]);
      }
    });

    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadStatus = async () => {
    try {
      const { data } = await api.get('/whatsapp/status');
      setStatus(data);
    } catch {}
  };

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/whatsapp/conversations');
      setConversations(data);
      setLoading(false);
    } catch {}
  };

  const loadMessages = async (conv) => {
    setSelected(conv);
    try {
      const { data } = await api.get(`/whatsapp/conversations/${conv.id}/messages`);
      setMessages(data.messages);
      setConversations(cs => cs.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
    } catch {}
  };

  const connect = async () => {
    try {
      await api.post('/whatsapp/connect');
      toast.success('Iniciando conexión...');
      setTimeout(loadStatus, 2000);
    } catch {
      toast.error('Error al conectar');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selected) return;
    setSending(true);
    try {
      await api.post(`/whatsapp/conversations/${selected.id}/send`, { content: input });
      setInput('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al enviar');
    } finally {
      setSending(false);
    }
  };

  const StatusBadge = () => {
    const colors = { connected: 'bg-green-100 text-green-700', disconnected: 'bg-red-100 text-red-700', qr_ready: 'bg-yellow-100 text-yellow-700', connecting: 'bg-blue-100 text-blue-700' };
    const labels = { connected: `Conectado ${status.phone ? `· +${status.phone}` : ''}`, disconnected: 'Desconectado', qr_ready: 'Escanea el QR', connecting: 'Conectando...' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors[status.status] || colors.disconnected}`}>
        {status.status === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {labels[status.status] || 'Desconectado'}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">WhatsApp CRM</h1>
          <StatusBadge />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadConversations} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
          {status.status !== 'connected' && (
            <button
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <QrCode className="w-4 h-4" />
              Conectar WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* QR Code */}
      {status.qr && (
        <div className="m-4 p-6 bg-white rounded-xl border border-yellow-200 flex flex-col items-center gap-3 shadow-sm">
          <p className="font-semibold text-gray-900">Escanea este código QR con WhatsApp</p>
          <p className="text-sm text-gray-500">Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo</p>
          <img src={status.qr} alt="QR Code WhatsApp" className="w-52 h-52 rounded-lg" />
        </div>
      )}

      {/* Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase">Conversaciones ({conversations.length})</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-20 text-gray-400 text-sm">Cargando...</div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <MessageCircle className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">Sin conversaciones</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadMessages(conv)}
                  className={`w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${selected?.id === conv.id ? 'bg-indigo-50' : ''}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {(conv.contact_name || conv.contact_phone || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{conv.contact_name || conv.contact_phone}</p>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.last_message || '...'}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>
                  {(selected.contact_name || selected.contact_phone || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selected.contact_name || selected.contact_phone}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{selected.contact_phone}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from_me ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.from_me ? 'text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm'}`}
                      style={msg.from_me ? { backgroundColor: primaryColor } : {}}>
                      {msg.ai_generated && (
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                          <Bot className="w-3 h-3" />
                          <span className="text-xs">IA</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.from_me ? 'text-white/60' : 'text-gray-400'}`}>
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>Selecciona una conversación</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
