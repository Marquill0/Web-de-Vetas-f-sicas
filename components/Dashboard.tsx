
import React from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Product, Sale } from '../types';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  insights: { title: string; description: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, insights }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const inventoryValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter(s => s.date.startsWith(today) && s.status === 'completada');
  const salesTodayCount = salesToday.length;
  const salesTodayAmount = salesToday.reduce((acc, s) => acc + s.total, 0);

  const lowStockProducts = products.filter(p => p.stock < p.minStock);

  const chartData = [
    { name: 'Stock Total', value: totalStock, color: '#10b981' },
    { name: 'Bajo Stock', value: lowStockProducts.length, color: '#f59e0b' },
    { name: 'Ventas Hoy', value: salesTodayCount, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
        <div className="text-sm text-slate-500">Actualizado hace un momento</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Package size={24} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Stock Total</h3>
          <p className="text-2xl font-bold text-slate-900">{totalStock.toLocaleString()} unds.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Valor Inventario</h3>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(inventoryValue)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Ventas Hoy</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(salesTodayAmount)}</p>
            <span className="text-xs text-slate-400">({salesTodayCount} trans.)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Stock Bajo</h3>
          <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {lowStockProducts.length} productos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Resumen Operativo</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Lightbulb size={20} />
            <h3 className="text-lg font-bold">Insights IA</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6">Análisis inteligente de tu negocio en tiempo real.</p>
          
          <div className="space-y-4 flex-1">
            {insights.length > 0 ? insights.map((insight, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-emerald-300 text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-sm">Cargando recomendaciones...</div>
            )}
          </div>
          
          <button className="mt-6 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors">
            Ver Reporte Detallado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
