
import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Trash2, 
  Download, 
  Plus, 
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SettingsProps {
  paymentMethods: string[];
  setPaymentMethods: (methods: string[]) => void;
  onClearData: () => void;
  onExportSales: () => void;
}

const DEFAULT_METHODS = ['Efectivo', 'Tarjeta', 'Transferencia'];

const Settings: React.FC<SettingsProps> = ({ 
  paymentMethods, 
  setPaymentMethods, 
  onClearData, 
  onExportSales 
}) => {
  const [newMethod, setNewMethod] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const customMethods = paymentMethods.filter(m => !DEFAULT_METHODS.includes(m));

  const toggleMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      // Don't allow removing all methods
      if (paymentMethods.length <= 1) {
        setMsg({ type: 'error', text: 'Debe haber al menos un método de pago activo.' });
        setTimeout(() => setMsg(null), 3000);
        return;
      }
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const addCustomMethod = () => {
    const trimmed = newMethod.trim();
    if (!trimmed) return;
    if (paymentMethods.includes(trimmed)) {
      setMsg({ type: 'error', text: 'El método ya existe.' });
      return;
    }
    setPaymentMethods([...paymentMethods, trimmed]);
    setNewMethod('');
    setMsg({ type: 'success', text: 'Método agregado.' });
    setTimeout(() => setMsg(null), 3000);
  };

  const removeCustomMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter(m => m !== method));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (passwordForm.new.length < 4) {
      setMsg({ type: 'error', text: 'La contraseña debe tener al menos 4 caracteres.' });
      return;
    }
    setMsg({ type: 'success', text: 'Contraseña actualizada correctamente (simulado).' });
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h1>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span className="text-sm font-medium">{msg.text}</span>
        </div>
      )}

      {/* 1. MÉTODOS DE PAGO */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={20} /></div>
          <h2 className="text-lg font-bold">Métodos de Pago Aceptados</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Selecciona los métodos que aceptas en tu tienda:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predefinidos</span>
              {DEFAULT_METHODS.map(m => (
                <label key={m} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    checked={paymentMethods.includes(m)}
                    onChange={() => toggleMethod(m)}
                  />
                  <span className="text-sm font-medium text-slate-700">{m}</span>
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personalizados</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Agregar otro..."
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomMethod()}
                />
                <button 
                  onClick={addCustomMethod}
                  className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>
              
              <div className="space-y-2">
                {customMethods.map(m => (
                  <div key={m} className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        checked={paymentMethods.includes(m)}
                        onChange={() => toggleMethod(m)}
                      />
                      <span className="text-sm font-medium text-slate-700">{m}</span>
                    </div>
                    <button 
                      onClick={() => removeCustomMethod(m)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAMBIO DE CONTRASEÑA */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Lock size={20} /></div>
          <h2 className="text-lg font-bold">Mi Contraseña</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña Actual</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nueva Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar Nueva</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cambiar Contraseña
          </button>
        </form>
      </section>

      {/* 3. ACCIONES RÁPIDAS */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 text-slate-800 border-b border-slate-50 pb-4">
          <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><CheckCircle2 size={20} /></div>
          <h2 className="text-lg font-bold">Acciones</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onClearData}
            className="flex items-center gap-2 px-6 py-3 border border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all text-sm"
          >
            <Trash2 size={18} />
            Borrar datos de prueba
          </button>
          <button 
            onClick={onExportSales}
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm"
          >
            <Download size={18} />
            Exportar ventas
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
