// Re-export all types from shared schema
export * from '@shared/schema';

// Extended types for frontend use
import type { CartItem as BaseCartItem, Product, Favorite as BaseFavorite } from '@shared/schema';

export interface CartItem extends BaseCartItem {
  product?: Product | null;
}

export interface Favorite extends BaseFavorite {
  product?: Product | null;
}