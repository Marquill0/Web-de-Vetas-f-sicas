
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUpDown, 
  Download,
  Filter,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, 'id' | 'lastUpdate'>) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || p.stock < p.minStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
      minStock: Number(formData.get('minStock')),
      price: Number(formData.get('price')),
    };

    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...productData, lastUpdate: new Date().toISOString() });
    } else {
      onAddProduct(productData);
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const exportCSV = () => {
    const headers = ['Código', 'Nombre', 'Categoría', 'Stock', 'Mínimo', 'Precio', 'Valor Total'];
    const rows = filteredProducts.map(p => [
      p.code, 
      p.name, 
      p.category, 
      p.stock, 
      p.minStock, 
      p.price, 
      p.stock * p.price
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventario.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Inventario de Productos</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            <span>Exportar</span>
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o código..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Todas las Categorías</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setStockFilter('all')}
              className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${stockFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setStockFilter('low')}
              className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${stockFilter === 'low' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}
            >
              Bajo Stock
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-400">Act: {formatDate(p.lastUpdate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${p.stock < p.minStock ? 'text-amber-600' : 'text-slate-700'}`}>
                        {p.stock}
                      </span>
                      {p.stock < p.minStock && <AlertCircle size={14} className="text-amber-500" />}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">Mín: {p.minStock}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{formatCurrency(p.price)}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{formatCurrency(p.stock * p.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic">No se encontraron productos</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código</label>
                  <input name="code" defaultValue={editingProduct?.code} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                  <select name="category" defaultValue={editingProduct?.category} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock Actual</label>
                  <input type="number" name="stock" defaultValue={editingProduct?.stock || 0} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mínimo</label>
                  <input type="number" name="minStock" defaultValue={editingProduct?.minStock || 5} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Unit.</label>
                  <input type="number" step="0.01" name="price" defaultValue={editingProduct?.price} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 shadow-lg shadow-emerald-200">
                  {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
