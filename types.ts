
export type UserRole = 'admin' | 'vendedor';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Session {
  user: User;
  loginTime: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  lastUpdate: string;
}

export type SaleOrigin = 'Tienda física' | 'WhatsApp' | 'Teléfono' | 'Pedido online';
export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';
export type SaleStatus = 'completada' | 'anulada';

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  origin: SaleOrigin;
  client?: string;
  observations?: string;
  status: SaleStatus;
  cancellationReason?: string;
  sellerId: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export type ViewType = 'dashboard' | 'inventory' | 'new-sale' | 'history' | 'reports' | 'settings';
