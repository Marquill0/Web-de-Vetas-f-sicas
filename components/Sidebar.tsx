
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { ViewType } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, collapsed, setCollapsed, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'new-sale', label: 'Nueva Venta', icon: ShoppingCart },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className={`bg-[#0f172a] text-white transition-all duration-300 flex flex-col h-full shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-700 min-h-[64px]">
        {!collapsed && <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent truncate">Gestión Pro</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-2 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center p-3 rounded-lg transition-all group ${
              currentView === item.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={22} className={currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
            {!collapsed && <span className="ml-4 font-medium truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          className="w-full flex items-center p-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={22} />
          {!collapsed && <span className="ml-4 font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
