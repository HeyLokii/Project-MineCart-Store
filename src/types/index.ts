export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount: number;
  category: string;
  images: string[];
  modelUrl?: string;
  downloadUrl?: string;
  fileType?: string;
  fileSize?: string;
  compatibility: string[];
  features: string[];
  rating: string;
  reviewCount: number;
  downloadCount: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  sellerId?: number;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'seller';
  bio?: string;
  website?: string;
  socialLinks: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: User;
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  product?: Product;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product?: Product;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: Product;
}

export interface Advertisement {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl: string;
  position: 'header' | 'sidebar' | 'footer' | 'between-products';
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface CreatorProfile extends User {
  products: Product[];
}
