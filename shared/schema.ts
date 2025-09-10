import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  photoURL: z.string().optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(['user', 'admin', 'creator']).default('user'),
  isVerified: z.boolean().default(false),
  youtubeUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  firebaseUid: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Product schema
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  downloadUrl: z.string().optional(),
  creatorId: z.string(),
  approved: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  ratings: z.number().default(0),
  downloads: z.number().default(0),
  downloadCount: z.number().default(0),
  mainImageIndex: z.number().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  fileType: z.string().optional(),
  discount: z.number().default(0),
  youtubeVideoId: z.string().optional(),
  compatibility: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  modelUrl: z.string().optional(),
  originalPrice: z.number().optional(),
  sellerId: z.string().optional(),
  rating: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Order schema
export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number()
  })),
  total: z.number(),
  status: z.enum(['pending', 'paid', 'cancelled']),
  paymentMethod: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Review schema
export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  helpfulCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Advertisement schema
export const AdvertisementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  link: z.string(),
  linkUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  position: z.number().default(0),
  priority: z.number().default(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Cart Item schema
export const CartItemSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string(),
  product: ProductSchema.optional(),
  quantity: z.number().default(1)
});

// Favorite schema
export const FavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.date()
});

// Insert schemas for database operations
export const InsertProductSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const InsertUserSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const InsertOrderSchema = OrderSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Notification schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  read: z.boolean().default(false),
  createdAt: z.date()
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Advertisement = z.infer<typeof AdvertisementSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type Favorite = z.infer<typeof FavoriteSchema>;

// Insert types
export type InsertProduct = z.infer<typeof InsertProductSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;
export type InsertOrder = z.infer<typeof InsertOrderSchema>;