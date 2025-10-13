export const API_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';

export const ORDER_STATUS = {
  pending: { label: 'En attente', color: '#FFC107' },
  confirmed: { label: 'Confirmée', color: '#2196F3' },
  preparing: { label: 'En préparation', color: '#FF9800' },
  ready: { label: 'Prêt', color: '#4CAF50' },
  delivered: { label: 'Livrée', color: '#8BC34A' },
  cancelled: { label: 'Annulée', color: '#F44336' },
};

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