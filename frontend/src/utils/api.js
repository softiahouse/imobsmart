import axios from 'axios';

// Dev: proxy Vite (/api → localhost:3001)
// Produção: VITE_API_URL=https://api.softiahouse.com
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Injetar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tratar erros globais
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      localStorage.removeItem('crm_tenant');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
