import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Palette, Users, Building, Save, Plus, Edit2, Shield } from 'lucide-react';

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input type="color" value={value || '#6366f1'} onChange={e => onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 uppercase">{value || '#6366f1'}</p>
      </div>
    </div>
  );
}

function UsersTab() {
  const { tenant, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent' });
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    api.get('/auth/users').then(r => setUsers(r.data));
  }, []);

  const createUser = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Todos los campos son obligatorios');
    try {
      await api.post('/auth/register', form);
      toast.success('Usuario creado');
      setForm({ name: '', email: '', password: '', role: 'agent' });
      setShowForm(false);
      api.get('/auth/users').then(r => setUsers(r.data));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{users.length} usuarios en este tenant</p>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: primaryColor }}>
            <Plus className="w-4 h-4" /> Nuevo usuario
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input-field" placeholder="Contraseña" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="agent">Agente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={createUser} className="px-3 py-1.5 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: primaryColor }}>Crear</button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>
              {u.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{u.name}</p>
              <p className="text-xs text-gray-400">{u.email}</p>
            </div>
            <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {u.role}
            </span>
            <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-400' : 'bg-gray-300'}`} title={u.active ? 'Activo' : 'Inactivo'} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const { tenant, updateTenant, user } = useAuth();
  const [tab, setTab] = useState('branding');
  const [form, setForm] = useState({ name: '', tagline: '', logo_url: '', primary_color: '#6366f1', secondary_color: '#8b5cf6' });
  const [saving, setSaving] = useState(false);
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name || '',
        tagline: tenant.tagline || '',
        logo_url: tenant.logo_url || '',
        primary_color: tenant.primary_color || '#6366f1',
        secondary_color: tenant.secondary_color || '#8b5cf6',
      });
    }
  }, [tenant]);

  const saveBranding = async () => {
    setSaving(true);
    try {
      await api.put('/tenants/me', form);
      updateTenant(form);
      toast.success('Configuración guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Marca', icon: Palette },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'account', label: 'Cuenta', icon: Building },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm">Personaliza tu CRM white label</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        {tab === 'branding' && (
          <div className="space-y-5">
            <h2 className="font-semibold text-gray-900">Identidad Visual (White Label)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input className="input-field" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="Tu slogan aquí" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
                <input className="input-field" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} placeholder="https://..." />
                {form.logo_url && <img src={form.logo_url} alt="Logo preview" className="mt-2 h-10 object-contain rounded" />}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Colores de la marca</h3>
              <ColorPicker label="Color principal" value={form.primary_color} onChange={v => setForm({ ...form, primary_color: v })} />
              <ColorPicker label="Color secundario" value={form.secondary_color} onChange={v => setForm({ ...form, secondary_color: v })} />
            </div>

            {/* Preview */}
            <div className="p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${form.primary_color}, ${form.secondary_color})` }}>
              <p className="text-white/70 text-xs mb-1">Vista previa del sidebar:</p>
              <p className="text-white font-semibold">{form.name || 'Nombre de tu empresa'}</p>
              <p className="text-white/60 text-xs">{form.tagline || 'Powered by Soft IA House'}</p>
            </div>

            <button
              onClick={saveBranding}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar cambios
            </button>
          </div>
        )}

        {tab === 'users' && <UsersTab />}

        {tab === 'account' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Información de la cuenta</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Tenant ID</span>
                <span className="text-sm font-mono text-gray-700">{tenant?.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Slug</span>
                <span className="text-sm font-semibold text-gray-700">{tenant?.slug}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Plan</span>
                <span className="text-sm font-semibold capitalize" style={{ color: primaryColor }}>{tenant?.plan || 'basic'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Tu rol</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role}
                </span>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
              <p className="font-medium mb-1">¿Necesitas más funcionalidades?</p>
              <p>Contacta con <strong>Soft IA House</strong> para planes enterprise con más tenants, integraciones y soporte prioritario.</p>
              <a href="mailto:info@softiahouse.com" className="text-blue-600 font-medium underline mt-1 block">info@softiahouse.com</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
