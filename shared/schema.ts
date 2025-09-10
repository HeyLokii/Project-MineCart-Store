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
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Cart Item schema
export const CartItemSchema = z.object({
  productId: z.string(),
  product: ProductSchema,
  quantity: z.number().default(1)
});

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