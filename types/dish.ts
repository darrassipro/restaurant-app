export interface Category {
  id: number;
  nameAr: string;
  nameFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  parentId?: number;
  sortOrder: number;
  subCategories?: Category[];
}

export interface Dish {
  id: number;
  restaurantId: number;
  categoryId: number;
  nameFr: string;
  nameAr: string;
  descriptionFr?: string;
  descriptionAr?: string;
  price: string;
  originalPrice?: string;
  preparationTime?: number;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  isAvailable?: boolean;
  isActive?: boolean;
  averageRating?: string;
  totalOrders?: number;
  image: string[];
}