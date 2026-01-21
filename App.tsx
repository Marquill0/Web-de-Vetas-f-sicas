
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Product, Sale, User, SaleItem, SaleOrigin } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Inventory from './components/Inventory.tsx';
import NewSale from './components/NewSale.tsx';
import Reports from './components/Reports.tsx';
import Settings from './components/Settings.tsx';
import Login from './components/Login.tsx';
import { StorageService } from './services/storage.ts';
import { INITIAL_PRODUCTS, PAYMENT_METHODS } from './constants.tsx';
import { getInventoryInsights } from './services/geminiService.ts';
import { Bell, Search, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [insights, setInsights] = useState<{ title: string; description: string }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const session = StorageService.getSession();
    const savedProducts = StorageService.getProducts();
    const savedSales = StorageService.getSales();
    const savedPaymentMethods = StorageService.getPaymentMethods();

    if (savedProducts.length === 0) {
      StorageService.saveProducts(INITIAL_PRODUCTS);
      setProducts(INITIAL_PRODUCTS);
    } else {
      setProducts(savedProducts);
    }

    setSales(savedSales);
    
    if (!savedPaymentMethods) {
      StorageService.savePaymentMethods(PAYMENT_METHODS);
      setPaymentMethods(PAYMENT_METHODS);
    } else {
      setPaymentMethods(savedPaymentMethods);
    }

    if (session) {
      setUser(session.user);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && user && currentView === 'dashboard') {
      const fetchInsights = async () => {
        try {
          const aiInsights = await getInventoryInsights(products, sales);
          setInsights(aiInsights);
        } catch (e) {
          console.error("Error fetching insights", e);
        }
      };
      fetchInsights();
    }
  }, [isInitialized, user, currentView, products, sales]);

  const handleLogout = useCallback(() => {
    StorageService.clearSession();
    setUser(null);
    setCurrentView('dashboard');
  }, []);

  const handleAddProduct = (pData: Omit<Product, 'id' | 'lastUpdate'>) => {
    const newProduct: Product = {
      ...pData,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdate: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleUpdateProduct = (updatedP: Product) => {
    const updated = products.map(p => p.id === updatedP.id ? updatedP : p);
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('¿Seguro que desea eliminar este producto?')) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleCompleteSale = (items: SaleItem[], total: number, payment: string, origin: SaleOrigin, client?: string, obs?: string) => {
    const newSale: Sale = {
      id: `V-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items,
      total,
      paymentMethod: payment,
      origin,
      client,
      observations: obs,
      status: 'completada',
      sellerId: user?.id || 'sys'
    };

    const updatedProducts = [...products];
    items.forEach(item => {
      const pIdx = updatedProducts.findIndex(p => p.id === item.productId);
      if (pIdx > -1) {
        updatedProducts[pIdx] = {
          ...updatedProducts[pIdx],
          stock: updatedProducts[pIdx].stock - item.quantity,
          lastUpdate: new Date().toISOString()
        };
      }
    });

    const newSales = [newSale, ...sales];
    setSales(newSales);
    setProducts(updatedProducts);
    StorageService.saveSales(newSales);
    StorageService.saveProducts(updatedProducts);
    setCurrentView('history');
  };

  if (!isInitialized) return null;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Búsqueda global..." 
                className="w-full pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => setCurrentView('settings')}>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{user.name}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</div>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {currentView === 'dashboard' && <Dashboard products={products} sales={sales} insights={insights} />}
          {currentView === 'inventory' && <Inventory products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />}
          {currentView === 'new-sale' && <NewSale products={products} paymentMethods={paymentMethods} onCompleteSale={handleCompleteSale} />}
          {currentView === 'reports' && <Reports sales={sales} products={products} />}
          {currentView === 'history' && (
            <div className="space-y-6">
               <h1 className="text-2xl font-bold text-slate-800">Historial de Ventas</h1>
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">ID Venta</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Método</th>
                        <th className="px-6 py-4">Origen</th>
                        <th className="px-6 py-4 text-right">Total</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sales.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-500">{s.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{new Date(s.date).toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{s.client || '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{s.paymentMethod}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{s.origin}</td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-600">{s.total.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${s.status === 'completada' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sales.length === 0 && <div className="py-20 text-center text-slate-400">No hay ventas registradas</div>}
               </div>
            </div>
          )}
          {currentView === 'settings' && (
            <Settings 
              paymentMethods={paymentMethods} 
              setPaymentMethods={(m) => { setPaymentMethods(m); StorageService.savePaymentMethods(m); }} 
              onClearData={() => {
                if(confirm('¿Borrar todo?')) {
                  StorageService.clearAll();
                  setProducts(INITIAL_PRODUCTS);
                  setSales([]);
                  StorageService.saveProducts(INITIAL_PRODUCTS);
                }
              }} 
              onExportSales={() => {
                const csv = "ID,Total\n" + sales.map(s => `${s.id},${s.total}`).join("\n");
                const link = document.createElement("a");
                link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                link.download = 'ventas.csv';
                link.click();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
