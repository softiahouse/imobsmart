import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, TrendingUp, MessageCircle, Bot, Euro, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    api.get('/tenants/dashboard').then(r => {
      setData(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  const stats = data?.stats || {};
  const pipeline = data?.pipeline || [];
  const recentContacts = data?.recent_contacts || [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">{format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Contactos" value={stats.contacts || 0} sub={`${stats.leads || 0} leads activos`} color={primaryColor} />
        <StatCard icon={TrendingUp} label="Negociaciones" value={stats.deals || 0} sub={`€${(stats.deals_value || 0).toLocaleString('es-ES')} en pipeline`} color="#f59e0b" />
        <StatCard icon={MessageCircle} label="Conversaciones" value={stats.open_conversations || 0} sub="Abiertas en WhatsApp" color="#10b981" />
        <StatCard icon={Bot} label="Mensajes IA" value={stats.ai_messages || 0} sub={`${stats.messages_today || 0} hoy`} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Pipeline de Ventas</h2>
          {pipeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipeline} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v, n) => [n === 'count' ? `${v} deals` : `€${v.toLocaleString('es-ES')}`, n === 'count' ? 'Cantidad' : 'Valor']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {pipeline.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color || primaryColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Sin datos de pipeline
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Contactos Recientes</h2>
            <a href="/contacts" className="text-sm font-medium" style={{ color: primaryColor }}>Ver todos</a>
          </div>
          <div className="space-y-3">
            {recentContacts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No hay contactos aún</p>
            ) : (
              recentContacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {contact.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-400 truncate">{contact.company || contact.email || contact.phone}</p>
                  </div>
                  <span className={`badge badge-${contact.status}`}>{contact.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pipeline value breakdown */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Valor por Etapa del Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((stage) => (
            <div key={stage.name} className="text-center p-3 rounded-lg bg-gray-50">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: stage.color }} />
              <p className="text-xs text-gray-500 truncate">{stage.name}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{stage.count}</p>
              <p className="text-xs text-gray-400">€{(stage.total || 0).toLocaleString('es-ES')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
