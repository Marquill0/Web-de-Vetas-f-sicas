
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  ShoppingCart, 
  Plus, 
  Minus, 
  CreditCard,
  Banknote,
  Send,
  User as UserIcon,
  FileText
} from 'lucide-react';
import { Product, SaleItem, PaymentMethod, SaleOrigin } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ORIGINS } from '../constants';

interface NewSaleProps {
  products: Product[];
  // Added paymentMethods to props to resolve the error in App.tsx and support dynamic methods
  paymentMethods: string[];
  // Changed payment parameter to string to match handleCompleteSale in App.tsx
  onCompleteSale: (items: SaleItem[], total: number, payment: string, origin: SaleOrigin, client?: string, obs?: string) => void;
}

const NewSale: React.FC<NewSaleProps> = ({ products, paymentMethods, onCompleteSale }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Use string type for state and initialize with the first available method from props
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0] || 'Efectivo');
  const [origin, setOrigin] = useState<SaleOrigin>('Tienda física');
  const [client, setClient] = useState('');
  const [obs, setObs] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, products]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert('No hay stock disponible');
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, quantity: 1, price: product.price }];
    });
    setSearchTerm('');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const product = products.find(p => p.id === id);
      return prev.map(item => {
        if (item.productId === id) {
          const newQty = Math.max(0, item.quantity + delta);
          if (product && newQty > product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinish = () => {
    if (cart.length === 0) return;
    onCompleteSale(cart, total, paymentMethod, origin, client, obs);
    setCart([]);
    setClient('');
    setObs('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <label className="block text-sm font-bold text-slate-700 mb-2">Búsqueda Rápida de Productos</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Escribe el nombre o código del producto..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-10 overflow-hidden divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => addToCart(p)}
                    disabled={p.stock <= 0}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <div className="text-left">
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-400">Stock: {p.stock} | {p.code}</div>
                    </div>
                    <div className="font-bold text-emerald-600">{formatCurrency(p.price)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white flex-1 rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <ShoppingCart size={18} /> Carrito de Venta
            </h3>
            <span className="text-xs font-medium text-slate-400">{cart.length} productos</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white hover:border-slate-300 transition-all">
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-400">{formatCurrency(item.price)} c/u</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-all"><Minus size={14}/></button>
                    <span className="px-3 font-bold text-slate-700 min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-all"><Plus size={14}/></button>
                  </div>
                  <div className="w-24 text-right font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                  <button onClick={() => updateQuantity(item.productId, -item.quantity)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
                <ShoppingCart size={64} strokeWidth={1} />
                <p className="font-medium">El carrito está vacío</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold text-slate-500 uppercase text-sm tracking-widest">Total a Pagar</span>
              <span className="font-black text-3xl text-emerald-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3"><CreditCard size={14} /> Método de Pago</label>
            <div className="grid grid-cols-1 gap-2">
              {/* Use paymentMethods from props instead of the constant */}
              {paymentMethods.map(m => (
                <button 
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-3 px-4 rounded-xl border text-left flex justify-between items-center transition-all ${paymentMethod === m ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                >
                  {m}
                  {paymentMethod === m && <Plus size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3"><Send size={14} /> Canal de Venta</label>
            <select 
              value={origin}
              onChange={(e) => setOrigin(e.target.value as SaleOrigin)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
            >
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><UserIcon size={14} /> Cliente (Opcional)</label>
            <input 
              type="text" 
              placeholder="Nombre del cliente..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><FileText size={14} /> Observaciones</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none text-sm"
              placeholder="Notas internas..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            ></textarea>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleFinish}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:bg-slate-400 disabled:shadow-none"
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSale;
