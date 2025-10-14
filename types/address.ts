// types/address.ts
export interface Address {
  id?: number;
  city: string;
  sector: string;
  addressName: string;
  latitude?: string;
  longitude?: string;
  isDefault: boolean;
  deliveryInstructions?: string;
  contactName: string;
  contactPhone: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}