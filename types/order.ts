export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  restaurantId: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  deliveryAddressId: number;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  items?: OrderItem[];
  User?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  Restaurant?: {
    name: string;
    logo?: string;
    phone?: string;
  };
  Address?: {
    addressName: string;
    city: string;
    sector: string;
  };
}
export type OrderStatusType = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type KitchenTab = 'pending' | 'preparing' | 'ready';

export interface OrdersQueryParams {
  status?: OrderStatusType | KitchenTab;
  restaurantId?: number;
  customerId?: number;
  page?: number;
  limit?: number;
}
export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  quantity: number;
  dishNameFr: string;
  dishNameAr?: string;
  dishPrice: string;
  Dish?: {
    image: string[];
  };
}

export interface CreateOrderRequest {
  items: {
    dishId: number;
    quantity: number;
  }[];
  deliveryAddressId: number;
  notes?: string;
}