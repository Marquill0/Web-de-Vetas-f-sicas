
import { Product, User } from './types';

export const CATEGORIES = [
  'Cigarros por Caja',
  'Cigarros por Unidad',
  'Alcohol',
  'Cerveza'
];

export const USERS: (User & { password: string })[] = [
  { id: 'u1', username: 'admin', name: 'Administrador Principal', role: 'admin', password: '1234578' },
  { id: 'u2', username: 'vendedor', name: 'Vendedor de Turno', role: 'vendedor', password: 'ventas123' }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: 'C001', name: 'Marlboro Gold (Caja x10)', category: 'Cigarros por Caja', stock: 25, minStock: 5, price: 45.00, lastUpdate: new Date().toISOString() },
  { id: '2', code: 'C002', name: 'Lucky Strike (Caja x10)', category: 'Cigarros por Caja', stock: 15, minStock: 5, price: 42.50, lastUpdate: new Date().toISOString() },
  { id: '3', code: 'U001', name: 'Marlboro Red (Unidad)', category: 'Cigarros por Unidad', stock: 85, minStock: 20, price: 5.50, lastUpdate: new Date().toISOString() },
  { id: '4', code: 'U002', name: 'Camel (Unidad)', category: 'Cigarros por Unidad', stock: 4, minStock: 15, price: 5.00, lastUpdate: new Date().toISOString() },
  { id: '5', code: 'A001', name: 'Johnnie Walker Black Label 750ml', category: 'Alcohol', stock: 12, minStock: 3, price: 38.00, lastUpdate: new Date().toISOString() },
  { id: '6', code: 'A002', name: 'Vodka Absolut 1L', category: 'Alcohol', stock: 8, minStock: 2, price: 22.00, lastUpdate: new Date().toISOString() },
  { id: '7', code: 'B001', name: 'Corona Extra 355ml (Pack 6)', category: 'Cerveza', stock: 30, minStock: 10, price: 11.50, lastUpdate: new Date().toISOString() },
  { id: '8', code: 'B002', name: 'Heineken Lata 473ml', category: 'Cerveza', stock: 120, minStock: 24, price: 2.25, lastUpdate: new Date().toISOString() },
];

export const INITIAL_USER = USERS[0];

export const ORIGINS = ['Tienda física', 'WhatsApp', 'Teléfono', 'Pedido online'];
export const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Transferencia'];
