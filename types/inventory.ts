export interface Inventory {
  id: number;
  dishId: number;
  restaurantId: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  isTracked: boolean;
  lastRestocked: string;
  dish?: {
    nameFr: string;
    nameAr?: string;
    image: string[];
  };
}