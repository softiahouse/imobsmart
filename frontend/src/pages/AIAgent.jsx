import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Bot, Plus, Trash2, Save, Play, ToggleLeft, ToggleRight, Zap } from 'lucide-react';

export default function AIAgent() {
  const { tenant } = useAuth();
  const [config, setConfig] = useState({ ai_enabled: false, ai_prompt: '', has_api_key: false });
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ trigger_keyword: '', response: '' });
  const [testMsg, setTestMsg] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    loadConfig();
    loadRules();
  }, []);

  const loadConfig = async () => {
    try {
      const { data } = await api.get('/ai/config');
      setConfig(data);
    } catch {}
  };

  const loadRules = async () => {
    try {
      const { data } = await api.get('/ai/rules');
      setRules(data);
    } catch {}
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const payload = { ai_enabled: config.ai_enabled, ai_prompt: config.ai_prompt };
      if (apiKey) payload.openai_api_key = apiKey;
      await api.put('/ai/config', payload);
      toast.success('Configuración guardada');
      if (apiKey) { setApiKey(''); setConfig(c => ({ ...c, has_api_key: true })); }
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const addRule = async () => {
    if (!newRule.response) return toast.error('La respuesta es obligatoria');
    try {
      await api.post('/ai/rules', newRule);
      toast.success('Regla añadida');
      setNewRule({ trigger_keyword: '', response: '' });
      loadRules();
    } catch {}
  };

  const deleteRule = async (id) => {
    await api.delete(`/ai/rules/${id}`);
    setRules(r => r.filter(x => x.id !== id));
    toast.success('Regla eliminada');
  };

  const toggleRule = async (rule) => {
    await api.put(`/ai/rules/${rule.id}`, { active: !rule.active });
    setRules(r => r.map(x => x.id === rule.id ? { ...x, active: !x.active } : x));
  };

  const testAI = async () => {
    if (!testMsg) return;
    setTestLoading(true);
    setTestResult('');
    try {
      const { data } = await api.post('/ai/test', { message: testMsg });
      setTestResult(data.response || data.message || 'Sin respuesta');
    } catch {
      setTestResult('Error al probar la IA');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agente de IA</h1>
        <p className="text-gray-500 text-sm">Configura el asistente automático para WhatsApp</p>
      </div>

      {/* Toggle principal */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor + '20' }}>
              <Bot className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Agente IA Activo</p>
              <p className="text-sm text-gray-500">Responde automáticamente mensajes de WhatsApp</p>
            </div>
          </div>
          <button onClick={() => setConfig(c => ({ ...c, ai_enabled: !c.ai_enabled }))}>
            {config.ai_enabled
              ? <ToggleRight className="w-10 h-10" style={{ color: primaryColor }} />
              : <ToggleLeft className="w-10 h-10 text-gray-300" />
            }
          </button>
        </div>
      </div>

      {/* OpenAI API Key */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-900">Configuración OpenAI</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key OpenAI {config.has_api_key && <span className="text-green-600 text-xs ml-1">✓ Configurada</span>}
          </label>
          <div className="flex gap-2">
            <input
              type={showApiKey ? 'text' : 'password'}
              className="input-field flex-1"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={config.has_api_key ? 'Nueva clave (dejar vacío para mantener)' : 'sk-...'}
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
            >
              {showApiKey ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt del sistema</label>
          <textarea
            className="input-field resize-none"
            rows={4}
            value={config.ai_prompt || ''}
            onChange={e => setConfig(c => ({ ...c, ai_prompt: e.target.value }))}
            placeholder="Eres un asistente de ventas de [tu empresa]. Ayuda a los clientes con..."
          />
          <p className="text-xs text-gray-400 mt-1">Define la personalidad y contexto del agente IA</p>
        </div>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar configuración
        </button>
      </div>

      {/* Reglas automáticas */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5" style={{ color: primaryColor }} />
          <h2 className="font-semibold text-gray-900">Respuestas Automáticas</h2>
        </div>
        <p className="text-sm text-gray-500">Respuestas rápidas sin necesitar IA (tienen prioridad sobre OpenAI)</p>

        {/* Add rule */}
        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Palabra clave (opcional)</label>
              <input
                className="input-field text-sm"
                value={newRule.trigger_keyword}
                onChange={e => setNewRule(r => ({ ...r, trigger_keyword: e.target.value }))}
                placeholder="precio, horario, info..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Respuesta *</label>
              <input
                className="input-field text-sm"
                value={newRule.response}
                onChange={e => setNewRule(r => ({ ...r, response: e.target.value }))}
                placeholder="Texto de respuesta automática"
              />
            </div>
          </div>
          <button onClick={addRule} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg self-end" style={{ backgroundColor: primaryColor }}>
            <Plus className="w-4 h-4" /> Añadir regla
          </button>
        </div>

        {/* Rules list */}
        <div className="space-y-2">
          {rules.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No hay reglas configuradas</p>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <button onClick={() => toggleRule(rule)}>
                  {rule.active
                    ? <ToggleRight className="w-6 h-6 mt-0.5" style={{ color: primaryColor }} />
                    : <ToggleLeft className="w-6 h-6 mt-0.5 text-gray-300" />
                  }
                </button>
                <div className="flex-1">
                  {rule.trigger_keyword && (
                    <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mb-1">
                      {rule.trigger_keyword}
                    </span>
                  )}
                  <p className="text-sm text-gray-700">{rule.response}</p>
                </div>
                <button onClick={() => deleteRule(rule.id)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test IA */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-gray-900">Probar Agente</h2>
        <div className="flex gap-3">
          <input
            className="input-field flex-1"
            value={testMsg}
            onChange={e => setTestMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && testAI()}
            placeholder="Escribe un mensaje de prueba..."
          />
          <button
            onClick={testAI}
            disabled={testLoading || !testMsg}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {testLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
            Probar
          </button>
        </div>
        {testResult && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Bot className="w-3 h-3" /> Respuesta del agente:</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
