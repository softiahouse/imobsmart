import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    const storedUser = localStorage.getItem('crm_user');
    const storedTenant = localStorage.getItem('crm_tenant');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setTenant(storedTenant ? JSON.parse(storedTenant) : null);
      applyTenantTheme(storedTenant ? JSON.parse(storedTenant) : null);
    }
    setLoading(false);
  }, []);

  const applyTenantTheme = (t) => {
    if (!t) return;
    const root = document.documentElement;
    if (t.primary_color) {
      root.style.setProperty('--color-primary', t.primary_color);
      root.style.setProperty('--color-primary-dark', darkenColor(t.primary_color, 15));
      root.style.setProperty('--color-primary-darker', darkenColor(t.primary_color, 25));
      const light = lightenColor(t.primary_color, 90);
      root.style.setProperty('--color-primary-50', light);
      root.style.setProperty('--color-primary-100', lightenColor(t.primary_color, 80));
    }
    if (t.name) document.title = `${t.name} - CRM`;
  };

  const login = async (email, password, slug) => {
    const { data } = await api.post('/auth/login', { email, password, slug });
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    localStorage.setItem('crm_tenant', JSON.stringify(data.tenant));
    setUser(data.user);
    setTenant(data.tenant);
    applyTenantTheme(data.tenant);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_tenant');
    setUser(null);
    setTenant(null);
  };

  const updateTenant = (updates) => {
    const updated = { ...tenant, ...updates };
    localStorage.setItem('crm_tenant', JSON.stringify(updated));
    setTenant(updated);
    applyTenantTheme(updated);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, login, logout, updateTenant }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Helpers de cor
function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount * 2.55);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount * 2.55);
  const b = Math.max(0, (num & 0xff) - amount * 2.55);
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount * 2.55);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount * 2.55);
  const b = Math.min(255, (num & 0xff) + amount * 2.55);
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}
