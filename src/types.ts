// Re-export all types from shared schema
export * from '@shared/schema';

// Extended types for frontend use
import type { Product } from '@shared/schema';

export interface ExtendedCartItem {
  id?: string;
  userId?: string;
  productId: string;
  product?: Product | null;
  quantity: number;
}

export interface ExtendedFavorite {
  id: string;
  userId: string;
  productId: string;
  product?: Product | null;
  createdAt: Date;
}