export interface Restaurant {
  id: number;
  name: string;
  description: string;
  logo: string;
  banner: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  email: string;
  isActive: boolean;
  deliveryRadius: number;
  minimumOrder: string;
  deliveryFee: string;
  Address?: Address;
}

export interface Address {
  id?: number;
  userId?: number;
  city: string;
  sector: string;
  addressName: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean;
  deliveryInstructions?: string;
  contactName?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}