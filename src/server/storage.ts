import {
  users, products, orders, reviews, favorites, cartItems, advertisements, contactMessages, siteSettings, chatMessages, chatSessions, platformSettings, sellerPayouts, activityLogs,
  type User, type Product, type Order, type Review, type Favorite, type CartItem, type Advertisement, type ContactMessage, type SiteSetting,
  type ChatMessage, type ChatSession, type PlatformSetting, type SellerPayout, type ActivityLog,
  type InsertUser, type InsertProduct, type InsertOrder, type InsertReview, type InsertFavorite, type InsertCartItem, type InsertAdvertisement, type InsertContactMessage, type InsertSiteSetting,
  type InsertChatMessage, type InsertChatSession, type InsertPlatformSetting, type InsertSellerPayout, type InsertActivityLog
} from "@shared/schema";
import { desc, eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDisplayName(displayName: string): Promise<User | null>;
  getUserByUniqueId(uniqueId: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser & { uniqueId?: string; createdBy?: number; canCreateProducts?: boolean }): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateUserPermissions(userId: number, canCreateProducts: boolean, updatedBy: number): Promise<User | undefined>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductById(uniqueId: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  createPixOrder(userId: number, products: Array<{id: number, quantity: number}>, total: string): Promise<{orderId: number, pixCode: string, sellerPixKey: string, amount: string, expiresAt: string}>;
  updateOrderSellerPayment(orderId: number, status: string, processedAt?: string | null, transferId?: string | null): Promise<Order | undefined>;

  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProduct(productId: number): Promise<(Review & { user: Pick<User, 'displayName' | 'email' | 'photoURL'> })[]>;
  createReview(review: InsertReview & { isVerified?: boolean }): Promise<Review>;
  updateReview(id: number, review: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  markReviewHelpful(reviewId: number): Promise<Review | undefined>;

  // Favorites
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<boolean>;
  isFavorite(userId: number, productId: number): Promise<boolean>;

  // Cart
  getCartByUser(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Advertisements
  getAdvertisements(): Promise<Advertisement[]>;
  getAdvertisementsByPosition(position: string): Promise<Advertisement[]>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: number, ad: Partial<Advertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: number): Promise<boolean>;

  // Enhanced user/product methods
  getUserWithProducts(id: number): Promise<User & { products: Product[] } | undefined>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;

  // Site Settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined>;

  // Chat System
  getChatSession(contactMessageId: number): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: number, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  getChatMessages(contactMessageId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Platform Settings for automatic payments
  getPlatformSettings(): Promise<PlatformSetting | undefined>;
  createPlatformSettings(settings: InsertPlatformSetting): Promise<PlatformSetting>;
  updatePlatformSettings(settings: Partial<PlatformSetting>): Promise<PlatformSetting | undefined>;

  // Seller Payouts for automatic distribution
  getSellerPayouts(): Promise<SellerPayout[]>;
  getSellerPayoutsBySeller(sellerId: number): Promise<SellerPayout[]>;
  createSellerPayout(payout: InsertSellerPayout): Promise<SellerPayout>;
  updateSellerPayout(id: number, payout: Partial<SellerPayout>): Promise<SellerPayout | undefined>;

  // Activity Logging
  logActivity(data: InsertActivityLog): Promise<void>;
  getActivityLogs(limit?: number): Promise<(ActivityLog & { user: Pick<User, 'displayName' | 'email' | 'photoURL'> })[]>;

  // Notification methods
  getNotificationsByUser(userId: number): Promise<any[]>;
  markNotificationAsRead(notificationId: number): Promise<any | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  createNotification(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    productId?: number;
    orderId?: number;
  }): Promise<any>;
  deleteNotification(notificationId: number): Promise<boolean>;
  getUserByFirebaseUid(firebaseUid: string): Promise<any | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  private favorites: Map<number, Favorite>;
  private cartItems: Map<number, CartItem>;
  private advertisements: Map<number, Advertisement>;
  private contactMessages: Map<number, ContactMessage>;
  private siteSettings: Map<string, SiteSetting>;
  private chatMessages: Map<number, ChatMessage>;
  private chatSessions: Map<number, ChatSession>;
  private platformSettings: PlatformSetting | undefined;
  private sellerPayouts: Map<number, SellerPayout>;
  private activityLogs: Map<number, ActivityLog>;
  private notifications: Map<number, any>;

  private currentUserId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentReviewId: number;
  private currentFavoriteId: number;
  private currentCartItemId: number;
  private currentAdvertisementId: number;
  private currentContactMessageId: number;
  private currentSiteSettingId: number;
  private currentChatMessageId: number;
  private currentChatSessionId: number;
  private currentSellerPayoutId: number;
  private currentActivityLogId: number;
  private currentNotificationId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.favorites = new Map();
    this.cartItems = new Map();
    this.advertisements = new Map();
    this.contactMessages = new Map();
    this.siteSettings = new Map();
    this.chatMessages = new Map();
    this.chatSessions = new Map();
    this.platformSettings = undefined;
    this.sellerPayouts = new Map();
    this.activityLogs = new Map();
    this.notifications = new Map();

    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentReviewId = 1;
    this.currentFavoriteId = 1;
    this.currentCartItemId = 1;
    this.currentAdvertisementId = 1;
    this.currentContactMessageId = 1;
    this.currentSiteSettingId = 1;
    this.currentChatMessageId = 1;
    this.currentChatSessionId = 1;
    this.currentSellerPayoutId = 1;
    this.currentActivityLogId = 1;
    this.currentNotificationId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize site settings
    this.initializeSiteSettings();

    // Duas contas admin
    const adminUser1: User = {
      id: 1,
      email: "heylokibr333@gmail.com",
      firstName: "Admin",
      lastName: "Principal",
      displayName: "AdminChefe",
      photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150",
      role: "admin",
      bio: "Administrador principal da plataforma MineCart Store.",
      website: null,
      socialLinks: [],
      isVerified: true,
      pixKey: null,
      canCreateProducts: true,
      createdBy: null,
      createdAt: new Date().toISOString(),
      uniqueId: "000", // ID do usuário principal
      firebaseUid: "firebase_uid_admin1"
    };

    const adminUser2: User = {
      id: 2,
      email: "pixelsengineers@gmail.com",
      firstName: "Pixels",
      lastName: "Engineers",
      displayName: "PixelsEngineers",
      photoURL: null,
      role: "admin",
      bio: "Administrador da plataforma MineCart Store.",
      website: null,
      socialLinks: [],
      isVerified: true,
      pixKey: null,
      canCreateProducts: true,
      createdBy: null,
      createdAt: new Date().toISOString(),
      uniqueId: "001",
      firebaseUid: "firebase_uid_admin2"
    };

    const adminUser3: User = {
      id: 3,
      email: "juniorbanda216@gmail.com",
      firstName: "Junior",
      lastName: "Admin",
      displayName: "JuniorAdmin",
      photoURL: null,
      role: "admin",
      bio: "Administrador da plataforma MineCart Store.",
      website: null,
      socialLinks: [],
      isVerified: true,
      pixKey: null,
      canCreateProducts: true,
      createdBy: null,
      createdAt: new Date().toISOString(),
      uniqueId: "002",
      firebaseUid: "firebase_uid_admin3"
    };

    this.users.set(1, adminUser1);
    this.users.set(2, adminUser2);
    this.users.set(3, adminUser3);
    this.currentUserId = 4;

    // Não inicializar anúncios - começar limpo

    // Não inicializar produtos - começar limpo
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByDisplayName(displayName: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.displayName === displayName) || null;
  }

  async getUserByUniqueId(uniqueId: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.uniqueId === uniqueId) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(data: InsertUser & { uniqueId?: string; createdBy?: number; canCreateProducts?: boolean }): Promise<User> {
    const now = new Date().toISOString();

    // Check if display name is taken
    if (data.displayName) {
      const existingUser = await this.getUserByDisplayName(data.displayName);
      if (existingUser) {
        throw new Error('Nome de exibição já está em uso');
      }
    }

    // Generate unique ID if not provided
    let uniqueId = data.uniqueId;
    if (!uniqueId) {
      const userCount = this.users.size; // Usando o tamanho atual do mapa para simular a contagem
      const nextNumber = userCount + 1;
      uniqueId = nextNumber.toString().padStart(3, '0');
    }

    // Check if unique ID is taken
    const existingUniqueId = await this.getUserByUniqueId(uniqueId);
    if (existingUniqueId) {
      throw new Error('ID único já está em uso');
    }

    // Sistema de ID automático sequencial
    let id: number;
    let role = data.role ?? 'user';
    let isVerified = data.isVerified ?? false;
    let canCreateProducts = data.canCreateProducts ?? false;

    if (data.email === "heylokibr333@gmail.com") {
      // Owner sempre tem ID 1
      id = 1;
      role = 'admin';
      isVerified = true;
      canCreateProducts = true;
    } else if (data.email === "pixelsengineers@gmail.com") {
      // Admin sempre tem ID 2
      id = 2;
      role = 'admin';
      isVerified = true;
      canCreateProducts = true;
    } else if (data.email === "juniorbanda216@gmail.com") {
      // Admin sempre tem ID 3
      id = 3;
      role = 'admin';
      isVerified = true;
      canCreateProducts = true;
    } else {
      // Novos usuários recebem próximo ID disponível (4+)
      id = this.currentUserId++;
      if (id < 4) {
        id = 4;
        this.currentUserId = 5;
      }
    }

    const user: User = {
      ...data,
      id,
      role,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      displayName: data.displayName ?? null,
      photoURL: data.photoURL ?? null,
      bio: data.bio ?? null,
      website: data.website ?? null,
      socialLinks: data.socialLinks ?? [],
      pixKey: null,
      canCreateProducts,
      createdBy: null,
      isVerified,
      createdAt: now,
      uniqueId,
      firebaseUid: data.uniqueId // Assuming uniqueId is used for firebaseUid in this context
    };
    this.users.set(id, user);

    // Log activity
    if (data.createdBy) {
      await this.logActivity({
        userId: data.createdBy,
        action: 'user_created',
        description: `Usuário ${data.displayName || data.email} criado`,
        entityType: 'user',
        entityId: user.id,
        metadata: { role: user.role, uniqueId }
      });
    }

    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    // Handle photoURL upload specifically
    if (updateData.photoURL && typeof updateData.photoURL === 'string') {
      // In a real app, this would involve uploading to a cloud storage and returning a URL.
      // For this simulation, we'll just update the URL directly.
      user.photoURL = updateData.photoURL;
    }

    // Update other fields
    const updatedUser = { ...user, ...updateData, updatedAt: new Date().toISOString() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPermissions(userId: number, canCreateProducts: boolean, updatedBy: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, canCreateProducts, updatedAt: new Date().toISOString() };
    this.users.set(userId, updatedUser);

    await this.logActivity({
      userId: updatedBy,
      action: 'user_permissions_updated',
      description: `Permissões atualizadas para ${updatedUser.displayName || updatedUser.email}`,
      entityType: 'user',
      entityId: userId,
      metadata: { canCreateProducts }
    });

    return updatedUser;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductById(uniqueId: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.uniqueId === uniqueId);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    // YouTube video is handled via youtubeVideoId field in the schema

    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category && p.isActive);
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]>{
    return Array.from(this.products.values()).filter(p => p.sellerId === sellerId && p.isActive);
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const now = new Date().toISOString();
    const id = this.currentProductId++;

    // Gerar ID único de 6 caracteres (letras e números)
    const generateUniqueId = () => {
      return Math.random().toString(36).substr(2, 6).toUpperCase();
    };

    let uniqueId = generateUniqueId();
    // Verificar se já existe (muito improvável, mas garantir)
    while (Array.from(this.products.values()).some(p => p.uniqueId === uniqueId)) {
      uniqueId = generateUniqueId();
    }

    const product: Product = {
      id,
      ...data,
      uniqueId, // Novo campo para ID único
      createdAt: now,
      images: data.images ? (Array.isArray(data.images) ? data.images : []) : [],
      mainImageIndex: data.mainImageIndex || 0,
      compatibility: data.compatibility ? (Array.isArray(data.compatibility) ? data.compatibility : []) : [],
      features: data.features ? (Array.isArray(data.features) ? data.features : []) : [],
      downloadCount: 0,
      tags: data.tags ? (Array.isArray(data.tags) ? data.tags : []) : [],
      rating: "0",
      reviewCount: 0,
      isActive: true,
      isFeatured: data.isFeatured || false,
      sellerId: data.sellerId || null,
      status: 'pending',
      rejectionReason: null,
      updatedAt: now,
    };
    this.products.set(id, product);

    // Log activity
    if (data.sellerId) {
      await this.logActivity({
        userId: data.sellerId,
        action: 'product_created',
        description: `Produto "${data.name}" foi criado`,
        entityType: 'product',
        entityId: product.id,
        metadata: { category: data.category, price: data.price }
      });
    }

    return product;
  }

  async updateProduct(id: number, updateData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updateData, updatedAt: new Date().toISOString() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async incrementProductDownload(productId: number): Promise<void> {
    const product = this.products.get(productId);
    if (product) {
      product.downloadCount = (product.downloadCount || 0) + 1;
      this.products.set(productId, product);
      console.log(`📥 Download count atualizado: Produto ${productId} agora tem ${product.downloadCount} downloads`);
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const userOrders = Array.from(this.orders.values()).filter(o => o.userId === userId);

    // Incluir dados completos do produto em cada pedido
    return userOrders.map(order => {
      const product = this.products.get(order.productId);
      return {
        ...order,
        product: product ? {
          id: product.id,
          name: product.name,
          uniqueId: product.uniqueId,
          description: product.description,
          price: product.price,
          images: product.images,
          mainImageIndex: product.mainImageIndex,
          category: product.category,
          fileType: product.fileType,
          fileSize: product.fileSize,
          downloadUrl: product.downloadUrl,
          fileName: product.fileName
        } : null
      };
    });
  }

  async createOrder(insertOrder: any): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      id,
      userId: insertOrder.userId,
      productId: insertOrder.productId,
      amount: insertOrder.amount,
      status: insertOrder.status || 'pending',
      paymentMethod: insertOrder.paymentMethod || 'pix',
      pixCode: insertOrder.pixCode || null,
      sellerId: insertOrder.sellerId || null,
      sellerPixKey: insertOrder.sellerPixKey || null,
      downloadToken: insertOrder.downloadToken || null,
      downloadExpiresAt: insertOrder.downloadExpiresAt || null,
      platformFee: insertOrder.platformFee || "0",
      sellerAmount: insertOrder.sellerAmount || "0",
      sellerPaymentStatus: insertOrder.sellerPaymentStatus || null,
      sellerPaymentDate: insertOrder.sellerPaymentDate || null,
      mercadoPagoPaymentId: insertOrder.mercadoPagoPaymentId || null,
      sellerTransactionId: insertOrder.sellerTransactionId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updateData: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, ...updateData, updatedAt: new Date().toISOString() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async createPixOrder(userId: number, products: Array<{id: number, quantity: number}>, total: string): Promise<{orderId: number, pixCode: string, sellerPixKey: string, amount: string, expiresAt: string}> {
    try {
      // Simula criação de código PIX (em produção seria integração com gateway de pagamento)
      const pixCode = `00020101021126${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const sellerPixKey = "vendedor@minecartstore.com"; // PIX do vendedor
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos

      // Cria pedido com status pendente
      const order: Order = {
        id: this.currentOrderId++,
        userId,
        productId: products.length > 0 ? products[0].id : 0, // Para simplificar, usando primeiro produto
        amount: total,
        status: "awaiting_payment",
        paymentMethod: "pix",
        pixCode,
        sellerId: products.length > 0 ? this.products.get(products[0].id)?.sellerId || 1 : 1, // ID do vendedor
        sellerPixKey,
        downloadToken: Math.random().toString(36).substr(2, 15),
        downloadExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        platformFee: "0",
        sellerAmount: "0",
        sellerPaymentStatus: null,
        sellerPaymentDate: null,
        mercadoPagoPaymentId: null,
        sellerTransactionId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.orders.set(order.id, order);

      return {
        orderId: order.id,
        pixCode,
        sellerPixKey,
        amount: total,
        expiresAt
      };
    } catch (error) {
      console.error('Error creating PIX order:', error);
      throw error;
    }
  }

  async updateOrderSellerPayment(orderId: number, status: string, processedAt?: string | null, transferId?: string | null): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;

    const updatedOrder = { ...order, sellerPaymentStatus: status, sellerPaymentProcessedAt: processedAt, mercadoPagoTransferId: transferId, updatedAt: new Date().toISOString() };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByProduct(productId: number): Promise<(Review & { user: Pick<User, 'displayName' | 'email' | 'photoURL'> })[]> {
    return Array.from(this.reviews.values())
      .filter(r => r.productId === productId)
      .map(review => {
        const user = this.users.get(review.userId);
        return {
          ...review,
          user: user ? { displayName: user.displayName, email: user.email, photoURL: user.photoURL } : null
        } as (Review & { user: Pick<User, 'displayName' | 'email' | 'photoURL'> });
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(data: InsertReview & { isVerified?: boolean }): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...data,
      id,
      isVerified: data.isVerified ?? false,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comment: data.comment || null,
    };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, updateData: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, ...updateData, updatedAt: new Date().toISOString() };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  async markReviewHelpful(reviewId: number): Promise<Review | undefined> {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;

    const updatedReview = { ...review, helpfulCount: (review.helpfulCount || 0) + 1, updatedAt: new Date().toISOString() };
    this.reviews.set(reviewId, updatedReview);
    return updatedReview;
  }

  // Favorites methods
  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(f => f.userId === userId);
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date().toISOString(),
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(f => f.userId === userId && f.productId === productId);
    if (favorite) {
      return this.favorites.delete(favorite.id);
    }
    return false;
  }

  async isFavorite(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(f => f.userId === userId && f.productId === productId);
  }

  // Cart methods
  async getCartByUser(userId: number): Promise<CartItem[]> {
    const cartItems = Array.from(this.cartItems.values()).filter(c => c.userId === userId);

    // Incluir dados do produto em cada item do carrinho
    return cartItems.map(item => {
      const product = this.products.get(item.productId);
      return {
        ...item,
        product: product || null
      } as CartItem;
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      c => c.userId === insertCartItem.userId && c.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + (insertCartItem.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);

      // Include product data
      const product = this.products.get(updatedItem.productId);
      return {
        ...updatedItem,
        product: product || null
      } as CartItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      quantity: insertCartItem.quantity || 1,
      createdAt: new Date().toISOString(),
    };
    this.cartItems.set(id, cartItem);

    // Include product data
    const product = this.products.get(cartItem.productId);
    return {
      ...cartItem,
      product: product || null
    } as CartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);

    // Include product data
    const product = this.products.get(updatedItem.productId);
    return {
      ...updatedItem,
      product: product || null
    } as CartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.values()).filter(c => c.userId === userId);
    userCartItems.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Advertisement methods
  async getAdvertisements(): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values()).filter(ad => ad.isActive);
  }

  async getAdvertisementsByPosition(position: string): Promise<Advertisement[]> {
    return Array.from(this.advertisements.values())
      .filter(ad => ad.isActive && ad.position === position)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  async createAdvertisement(insertAd: InsertAdvertisement): Promise<Advertisement> {
    const id = this.currentAdvertisementId++;
    const ad: Advertisement = {
      ...insertAd,
      id,
      isActive: true,
      priority: insertAd.priority || 0,
      createdAt: new Date().toISOString(),
      description: insertAd.description || null,
      startDate: insertAd.startDate || null,
      endDate: insertAd.endDate || null,
    };
    this.advertisements.set(id, ad);
    return ad;
  }

  async updateAdvertisement(id: number, updateData: Partial<Advertisement>): Promise<Advertisement | undefined> {
    const ad = this.advertisements.get(id);
    if (!ad) return undefined;

    const updatedAd = { ...ad, ...updateData, updatedAt: new Date().toISOString() };
    this.advertisements.set(id, updatedAd);
    return updatedAd;
  }

  async deleteAdvertisement(id: number): Promise<boolean> {
    return this.advertisements.delete(id);
  }

  // Enhanced user/product methods
  async getUserWithProducts(id: number): Promise<User & { products: Product[] } | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const products = await this.getProductsBySeller(id);
    return { ...user, products };
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    return message;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = {
      id,
      ...insertMessage,
      isRead: false,
      isUrgent: insertMessage.isUrgent || false,
      createdAt: new Date().toISOString()
    };
    this.contactMessages.set(message.id, message);
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;

    message.isRead = true;
    this.contactMessages.set(id, message);
    return message;
  }

  private initializeSiteSettings() {
    const defaultSettings: SiteSetting[] = [
      {
        id: 1,
        key: "social_discord",
        value: "https://discord.gg/minecart",
        category: "social",
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        key: "social_twitter",
        value: "https://twitter.com/minecart",
        category: "social",
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        key: "social_youtube",
        value: "https://youtube.com/minecart",
        category: "social",
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        key: "social_linkedin",
        value: "https://linkedin.com/company/minecart",
        category: "social",
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        key: "support_email",
        value: "minecartstore.help@gmail.com", // Updated support email
        category: "support",
        updatedAt: new Date().toISOString()
      }
    ];

    defaultSettings.forEach(setting => {
      this.siteSettings.set(setting.key, setting);
      this.currentSiteSettingId = Math.max(this.currentSiteSettingId, setting.id + 1);
    });
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettings.values());
  }

  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.get(key);
  }

  async createSiteSetting(insertSetting: InsertSiteSetting): Promise<SiteSetting> {
    const id = this.currentSiteSettingId++;
    const setting: SiteSetting = {
      id,
      ...insertSetting,
      updatedAt: new Date().toISOString()
    };
    this.siteSettings.set(setting.key, setting);
    return setting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting | undefined> {
    const setting = this.siteSettings.get(key);
    if (!setting) return undefined;

    setting.value = value;
    setting.updatedAt = new Date().toISOString();
    this.siteSettings.set(key, setting);
    return setting;
  }

  // Chat System Methods
  async getChatSession(contactMessageId: number): Promise<ChatSession | undefined> {
    for (const session of this.chatSessions.values()) {
      if (session.contactMessageId === contactMessageId) {
        return session;
      }
    }
    return undefined;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentChatSessionId++;
    const session: ChatSession = {
      id,
      ...insertSession,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.chatSessions.set(session.id, session);
    return session;
  }

  async updateChatSession(id: number, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates, updatedAt: new Date().toISOString() };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getChatMessages(contactMessageId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.contactMessageId === contactMessageId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      id,
      ...insertMessage,
      createdAt: new Date().toISOString()
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  // Platform Settings Methods
  async getPlatformSettings(): Promise<PlatformSetting | undefined> {
    return this.platformSettings;
  }

  async createPlatformSettings(insertSettings: InsertPlatformSetting): Promise<PlatformSetting> {
    const settings: PlatformSetting = {
      id: 1, // Assuming only one set of platform settings
      ...insertSettings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.platformSettings = settings;
    return settings;
  }

  async updatePlatformSettings(updates: Partial<PlatformSetting>): Promise<PlatformSetting | undefined> {
    if (!this.platformSettings) return undefined;

    const updatedSettings = { ...this.platformSettings, ...updates, updatedAt: new Date().toISOString() };
    this.platformSettings = updatedSettings;
    return updatedSettings;
  }

  // Seller Payout Methods
  async getSellerPayouts(): Promise<SellerPayout[]> {
    return Array.from(this.sellerPayouts.values());
  }

  async getSellerPayoutsBySeller(sellerId: number): Promise<SellerPayout[]> {
    return Array.from(this.sellerPayouts.values()).filter(payout => payout.sellerId === sellerId);
  }

  async createSellerPayout(insertPayout: InsertSellerPayout): Promise<SellerPayout> {
    const id = this.currentSellerPayoutId++;
    const payout: SellerPayout = {
      id,
      ...insertPayout,
      createdAt: new Date().toISOString()
    };
    this.sellerPayouts.set(payout.id, payout);
    return payout;
  }

  async updateSellerPayout(id: number, updates: Partial<SellerPayout>): Promise<SellerPayout | undefined> {
    const payout = this.sellerPayouts.get(id);
    if (!payout) return undefined;

    const updatedPayout = { ...payout, ...updates, updatedAt: new Date().toISOString() };
    this.sellerPayouts.set(id, updatedPayout);
    return updatedPayout;
  }

  // Activity Logging Methods
  async logActivity(data: InsertActivityLog): Promise<void> {
    const id = this.currentActivityLogId++;
    const log: ActivityLog = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.activityLogs.set(id, log);
  }

  // Get all activity logs with limit
  async getActivityLogs(limit: number = 50): Promise<(ActivityLog & { user: Pick<User, 'displayName' | 'email' | 'photoURL'> })[]> {
    const logs = Array.from(this.activityLogs.values()).slice(-limit).reverse(); // Get last 'limit' logs

    const logsWithUsers = await Promise.all(logs.map(async log => {
      const user = this.users.get(log.userId);
      return {
        ...log,
        user: user ? {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        } : null
      };
    }));

    return logsWithUsers;
  }

  // Notification methods
  async getNotificationsByUser(userId: number): Promise<any[]> {
    if (!this.notifications) {
      this.notifications = new Map();
      this.currentNotificationId = 1;
    }

    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(notificationId: number): Promise<any | undefined> {
    if (!this.notifications) {
      this.notifications = new Map();
      return undefined;
    }

    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(notificationId, notification);
      return notification;
    }
    return undefined;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    if (!this.notifications) return;

    const userNotifications = Array.from(this.notifications.values()).filter(n => n.userId === userId);
    userNotifications.forEach(notification => {
      notification.isRead = true;
      this.notifications.set(notification.id, notification);
    });
  }

  async createNotification(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    productId?: number;
    orderId?: number;
    contactMessageId?: number;
  }): Promise<any> {
    if (!this.notifications) {
      this.notifications = new Map();
      this.currentNotificationId = 1;
    }

    const id = this.currentNotificationId++;
    const newNotification = {
      id,
      ...data,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.set(id, newNotification);
    console.log(`📣 Notificação criada: ${data.title} para usuário ${data.userId}`);
    return newNotification;
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    if (!this.notifications) return false;

    const deleted = this.notifications.delete(notificationId);
    if (deleted) {
      console.log(`🗑️ Notificação ${notificationId} deletada`);
    }
    return deleted;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<any | null> {
    const users = Array.from(this.users.values());
    return users.find(user => user.firebaseUid === firebaseUid) || null;
  }
}

export const storage = new MemStorage();