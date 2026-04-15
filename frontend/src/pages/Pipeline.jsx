import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Euro, User, GripVertical, X, Save, TrendingUp } from 'lucide-react';

function DealCard({ deal, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{deal.title}</p>
          {deal.contact_name && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><User className="w-3 h-3" />{deal.contact_name}</p>}
        </div>
        <div {...attributes} {...listeners} className="text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing mt-0.5">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      {(deal.value > 0 || deal.probability) && (
        <div className="flex items-center justify-between mt-2">
          {deal.value > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <Euro className="w-3 h-3" />{deal.value.toLocaleString('es-ES')}
            </span>
          )}
          {deal.probability && (
            <span className="text-xs text-gray-400">{deal.probability}%</span>
          )}
        </div>
      )}
    </div>
  );
}

function Column({ stage, onAddDeal }) {
  const { setNodeRef } = useSortable({ id: `stage-${stage.id}` });

  return (
    <div ref={setNodeRef} className="flex flex-col min-w-[260px] max-w-[280px] bg-gray-50 rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[140px]">{stage.name}</span>
          <span className="text-xs font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded-full">{stage.deals.length}</span>
        </div>
        <div className="text-xs text-gray-400 font-medium">
          €{(stage.total || 0).toLocaleString('es-ES')}
        </div>
      </div>

      {/* Cards */}
      <SortableContext items={stage.deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 min-h-[60px]">
          {stage.deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onClick={() => {}} />
          ))}
        </div>
      </SortableContext>

      {/* Add button */}
      <button
        onClick={() => onAddDeal(stage.id)}
        className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Añadir negociación
      </button>
    </div>
  );
}

function DealModal({ stageId, stages, onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', stage_id: stageId, value: '', probability: 50, notes: '' });
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);
  const { tenant } = useAuth();
  const primaryColor = tenant?.primary_color || '#6366f1';

  useEffect(() => {
    api.get('/contacts', { params: { limit: 50 } }).then(r => setContacts(r.data.data));
  }, []);

  const handleSave = async () => {
    if (!form.title) return toast.error('El título es obligatorio');
    setSaving(true);
    try {
      await api.post('/pipeline/deals', { ...form, value: Number(form.value) || 0 });
      toast.success('Negociación creada');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold text-gray-900">Nueva Negociación</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Nombre de la negociación" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
              <select className="input-field" value={form.stage_id} onChange={e => setForm({ ...form, stage_id: e.target.value })}>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
              <select className="input-field" value={form.contact_id || ''} onChange={e => setForm({ ...form, contact_id: e.target.value })}>
                <option value="">Sin contacto</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (€)</label>
              <input className="input-field" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad %</label>
              <input className="input-field" type="number" min={0} max={100} value={form.probability} onChange={e => setForm({ ...form, probability: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notas opcionales..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const { tenant } = useAuth();
  const [stages, setStages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [dealModal, setDealModal] = useState(null);
  const primaryColor = tenant?.primary_color || '#6366f1';

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const load = async () => {
    setLoading(true);
    try {
      const [pipeline, statsRes] = await Promise.all([
        api.get('/pipeline'),
        api.get('/pipeline/stats'),
      ]);
      setStages(pipeline.data);
      setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    // Find which stage the card moved to
    const targetStage = stages.find(s => s.deals.some(d => d.id === over.id) || `stage-${s.id}` === over.id);
    const sourceDeal = stages.flatMap(s => s.deals).find(d => d.id === active.id);

    if (targetStage && sourceDeal && targetStage.id !== sourceDeal.stage_id) {
      try {
        await api.put(`/pipeline/deals/${active.id}`, { stage_id: targetStage.id });
        load();
      } catch {
        toast.error('Error al mover negociación');
      }
    }
  };

  const activeDeal = activeId ? stages.flatMap(s => s.deals).find(d => d.id === activeId) : null;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {dealModal && (
        <DealModal stageId={dealModal} stages={stages} onClose={() => setDealModal(null)} onSaved={() => { setDealModal(null); load(); }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline de Ventas</h1>
          <p className="text-gray-500 text-sm">{stats.totalDeals || 0} negociaciones · €{(stats.totalValue || 0).toLocaleString('es-ES')} en total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-400">Ganadas</p>
            <p className="text-sm font-semibold text-green-600">{stats.wonDeals || 0} · €{(stats.wonValue || 0).toLocaleString('es-ES')}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-500 hidden md:block" />
        </div>
      </div>

      {/* Kanban */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <Column key={stage.id} stage={stage} onAddDeal={setDealModal} />
          ))}
        </div>
        <DragOverlay>
          {activeDeal && (
            <div className="bg-white rounded-lg p-3 shadow-lg border border-indigo-200 rotate-2 w-[260px]">
              <p className="text-sm font-medium text-gray-900">{activeDeal.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
