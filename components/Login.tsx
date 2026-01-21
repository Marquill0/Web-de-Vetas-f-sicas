
import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { USERS } from '../constants';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = StorageService.getRememberMe();
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = USERS.find(u => u.username === username && u.password === password);

    if (foundUser) {
      if (rememberMe) {
        StorageService.saveRememberMe(username);
      } else {
        StorageService.saveRememberMe(null);
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      StorageService.setSession(userWithoutPassword);
      onLogin(userWithoutPassword);
    } else {
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-emerald-50">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestión Pro</h1>
            <p className="text-slate-400 font-medium mt-1">Acceso al Sistema Administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <div className="text-red-500 mt-0.5">&times;</div>
                <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Usuario</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(null); }}
                    placeholder="Tu nombre de usuario"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Recordarme</span>
              </label>
              <button type="button" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">¿Olvidaste tu clave?</button>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Accediendo...
                </>
              ) : (
                'Acceder al Panel'
              )}
            </button>
          </form>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400 font-medium">
              ¿Problemas para acceder? <a href="#" className="text-slate-600 font-bold hover:underline">Contacta soporte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
