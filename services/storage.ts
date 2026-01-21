
import { Product, Sale, ActivityLog, User, Session } from '../types';

const KEYS = {
  PRODUCTS: 'gpro_products',
  SALES: 'gpro_sales',
  LOGS: 'gpro_logs',
  SESSION: 'gpro_session',
  REMEMBER_ME: 'gpro_remember_me',
  PAYMENT_METHODS: 'gpro_payment_methods'
};

const SESSION_EXPIRY_HOURS = 8;

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  getSales: (): Sale[] => {
    const data = localStorage.getItem(KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },
  saveSales: (sales: Sale[]) => {
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
  },
  getLogs: (): ActivityLog[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  saveLog: (log: ActivityLog) => {
    const logs = StorageService.getLogs();
    localStorage.setItem(KEYS.LOGS, JSON.stringify([log, ...logs].slice(0, 100)));
  },
  
  // Auth & Session
  setSession: (user: User) => {
    const session: Session = {
      user,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  },
  getSession: (): Session | null => {
    const data = sessionStorage.getItem(KEYS.SESSION);
    if (!data) return null;
    
    const session: Session = JSON.parse(data);
    const loginTime = new Date(session.loginTime).getTime();
    const now = new Date().getTime();
    const hoursElapsed = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursElapsed > SESSION_EXPIRY_HOURS) {
      sessionStorage.removeItem(KEYS.SESSION);
      return null;
    }
    
    return session;
  },
  clearSession: () => {
    sessionStorage.removeItem(KEYS.SESSION);
  },
  
  // Remember Me
  saveRememberMe: (username: string | null) => {
    if (username) {
      localStorage.setItem(KEYS.REMEMBER_ME, username);
    } else {
      localStorage.removeItem(KEYS.REMEMBER_ME);
    }
  },
  getRememberMe: (): string | null => {
    return localStorage.getItem(KEYS.REMEMBER_ME);
  },

  getPaymentMethods: (): string[] | null => {
    const data = localStorage.getItem(KEYS.PAYMENT_METHODS);
    return data ? JSON.parse(data) : null;
  },
  savePaymentMethods: (methods: string[]) => {
    localStorage.setItem(KEYS.PAYMENT_METHODS, JSON.stringify(methods));
  },
  clearAll: () => {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.SALES);
    localStorage.removeItem(KEYS.LOGS);
  }
};
