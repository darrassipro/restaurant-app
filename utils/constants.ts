export const API_URL = 'http://192.168.8.102:5000/api';
export const SOCKET_URL = 'http://192.168.8.102:5000';

export const ORDER_STATUS = {
  pending: { label: 'En attente', color: '#9CA3AF' },
  confirmed: { label: 'Confirmée', color: '#3B82F6' },
  preparing: { label: 'En préparation', color: '#FBBF24' },
  ready: { label: 'Prête', color: '#22C55E' },
  delivered: { label: 'Livrée', color: '#16A34A' },
  cancelled: { label: 'Annulée', color: '#EF4444' },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
export type OrderStatusKey = keyof typeof ORDER_STATUS;

export const PAYMENT_STATUS = {
  pending: { label: 'En attente', color: '#FFC107' },
  paid: { label: 'Payé', color: '#4CAF50' },
  refunded: { label: 'Remboursé', color: '#2196F3' },
};

export const ROLES = {
  admin: 'Administrateur',
  manager: 'Gérant',
  chef: 'Chef',
  customer: 'Client',
};