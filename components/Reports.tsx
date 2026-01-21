
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Sale, Product } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const Reports: React.FC<ReportsProps> = ({ sales, products }) => {
  const completedSales = useMemo(() => sales.filter(s => s.status === 'completada'), [sales]);

  // Data for Sales by Category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    completedSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cat = product?.category || 'Otros';
        categories[cat] = (categories[cat] || 0) + (item.price * item.quantity);
      });
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [completedSales, products]);

  // Data for Sales by Origin
  const originData = useMemo(() => {
    const origins: Record<string, number> = {};
    completedSales.forEach(sale => {
      origins[sale.origin] = (origins[sale.origin] || 0) + sale.total;
    });
    return Object.entries(origins).map(([name, value]) => ({ name, value }));
  }, [completedSales]);

  // Data for Payment Method
  const paymentData = useMemo(() => {
    const methods: Record<string, number> = {};
    completedSales.forEach(sale => {
      methods[sale.paymentMethod] = (methods[sale.paymentMethod] || 0) + sale.total;
    });
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [completedSales]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Reportes y Análisis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ventas por Categoría</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Origin */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Procedencia de Ingresos</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Payment Method */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Métodos de Pago</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking of top products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Productos más Vendidos</h3>
          <div className="space-y-4">
            {completedSales.length === 0 ? (
              <p className="text-center text-slate-400 py-10">Sin datos de ventas</p>
            ) : (
              products
                .map(p => {
                  const qty = completedSales.reduce((acc, sale) => {
                    const item = sale.items.find(i => i.productId === p.id);
                    return acc + (item?.quantity || 0);
                  }, 0);
                  return { ...p, qty };
                })
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 5)
                .map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-600 rounded-full text-xs font-bold">{idx + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{p.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{p.category}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-emerald-600">{p.qty} <span className="text-[10px] font-normal text-slate-400">uds</span></div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
