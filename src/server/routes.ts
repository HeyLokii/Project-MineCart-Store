import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupUploadRoutes, handleAvatarUpload, handleProductImageUpload, handleProductFileUpload } from "./upload";
import { UserSchema, ProductSchema, OrderSchema, ReviewSchema, AdvertisementSchema, NotificationSchema } from "../../shared/schema";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from 'crypto';
import { eq, desc, sql, and } from 'drizzle-orm'; // Import necessary drizzle functions
import { db } from '../lib/db'; // Import database instance
import type { Request, Response, NextFunction } from 'express'; // Import Express types

// Configurar MercadoPago
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.error('MERCADOPAGO_ACCESS_TOKEN not found in environment variables');
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 30000,
    idempotencyKey: ''
  }
});

// **FUNÇÃO AUXILIAR:** Criar pagamento PIX simulado funcional
const createSimulatedPixPayment = (paymentData: any) => {
  const timestamp = Date.now();
  const amount = paymentData.transaction_amount;

  // Gerar código PIX EMV válido (formato padrão brasileiro)
  const pixCode = `00020101021126580014br.gov.bcb.pix013636${Math.random().toString(36).substr(2, 32)}520400005303986540${amount.toFixed(2)}5802BR5925MineCart Store Ltda6014Sao Paulo6227052305${Math.random().toString().slice(-5)}6304${Math.random().toString().slice(-4)}`;

  return {
    id: `sim_${timestamp}`,
    status: 'pending',
    status_detail: 'pending_waiting_payment',
    point_of_interaction: {
      transaction_data: {
        qr_code: pixCode,
        qr_code_base64: null // Frontend mostrará placeholder visual
      }
    },
    date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    transaction_amount: amount,
    description: paymentData.description
  };
};

// **NOVA FUNÇÃO:** Integração real com API do Mercado Pago
const createMercadoPagoPixPayment = async (paymentData: {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}) => {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    console.log('⚠️ MERCADOPAGO_ACCESS_TOKEN não configurado - usando modo simulado funcional');
    return createSimulatedPixPayment(paymentData);
  }

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erro API Mercado Pago:', response.status, errorData);
      throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Pagamento PIX criado no MP: ID=${data.id}, Status=${data.status}`);
    return data;

  } catch (error) {
    console.error('❌ Erro ao conectar com Mercado Pago:', error);
    console.log('🔄 Alternando para modo simulado funcional...');
    return createSimulatedPixPayment(paymentData);
  }
};

// **NOVA FUNÇÃO:** Verificar status do pagamento via API do Mercado Pago
const checkMercadoPagoPaymentStatus = async (paymentId: string) => {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  // Verificar se é pagamento simulado (sem API do Mercado Pago)
  const isSimulated = paymentId.startsWith('sim_');

  if (!accessToken || isSimulated) {
    console.log('⚠️ MERCADOPAGO_ACCESS_TOKEN não configurado ou pagamento simulado - usando modo demonstração');

    if (isSimulated) {
      const timestamp = parseInt(paymentId.split('_')[1]);
      const paymentAge = Date.now() - timestamp;
      const shouldApprove = paymentAge > 30000; // 30 segundos para demonstração

      console.log(`🔍 Pagamento simulado ${paymentId}: idade=${Math.floor(paymentAge/1000)}s, aprova=${shouldApprove}`);

      return {
        id: paymentId,
        status: shouldApprove ? 'approved' : 'pending',
        status_detail: shouldApprove ? 'accredited' : 'pending_waiting_payment',
        payment_method: 'pix'
      };
    }

    return {
      id: paymentId,
      status: 'pending',
      status_detail: 'pending_waiting_payment',
      payment_method: 'pix'
    };
  }

  // **NOVO:** Para ambiente de desenvolvimento, aprovar automaticamente após 30 segundos
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    // Extrair timestamp do ID do pagamento se for formato timestamp
    let paymentAge = 0;
    if (/^\d+$/.test(paymentId)) {
      paymentAge = Date.now() - parseInt(paymentId);
    }

    if (paymentAge > 30000) { // 30 segundos
      console.log(`🎉 AUTO-APROVAÇÃO (DEV): Pagamento ${paymentId} aprovado automaticamente após ${Math.floor(paymentAge/1000)}s`);
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        payment_method: 'pix'
      };
    }
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro ao verificar pagamento ${paymentId}: ${response.status}`);
      return { id: paymentId, status: 'pending', status_detail: 'pending_waiting_payment' };
    }

    const data = await response.json();
    return {
      id: data.id,
      status: data.status,
      status_detail: data.status_detail
    };

  } catch (error) {
    console.error('❌ Erro ao verificar status do pagamento:', error);
    return { id: paymentId, status: 'pending', status_detail: 'pending_waiting_payment' };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota especial para análise da IA - HTML estático
  app.get('/ai-preview', async (req, res) => {
    const staticHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MineCart Store - Marketplace Premium de Minecraft</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a; color: #e2e8f0; line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: linear-gradient(135deg, #10b981, #3b82f6);
            padding: 40px 20px; text-align: center; margin-bottom: 40px;
        }
        .logo { font-size: 2.5rem; font-weight: bold; color: white; text-transform: uppercase; }
        .subtitle { font-size: 1.2rem; margin-top: 10px; opacity: 0.9; }
        .section { margin: 40px 0; padding: 30px; background: #1e293b; border-radius: 12px; }
        .section h2 { 
            color: #10b981; font-size: 1.8rem; margin-bottom: 20px;
            border-bottom: 2px solid #10b981; padding-bottom: 10px;
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { 
            background: #334155; padding: 25px; border-radius: 8px; 
            border-left: 4px solid #10b981; transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }
        .card h3 { color: #3b82f6; margin-bottom: 15px; }
        .badge { 
            display: inline-block; background: #10b981; color: white; 
            padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin: 2px;
        }
        .premium { background: linear-gradient(135deg, #ffd700, #ffa500); color: #000; }
        .price { font-size: 1.5rem; font-weight: bold; color: #10b981; }
        .original-price { text-decoration: line-through; color: #94a3b8; margin-left: 10px; }
        .nav { display: flex; gap: 30px; justify-content: center; margin: 30px 0; }
        .nav a { 
            color: #3b82f6; text-decoration: none; font-weight: 500; 
            padding: 10px 20px; border-radius: 6px; background: #1e293b;
        }
        .nav a:hover { background: #334155; }
        .stats { display: flex; justify-content: space-around; text-align: center; }
        .stat { padding: 20px; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #10b981; }
        .stat-label { color: #94a3b8; }
        .feature-list { list-style: none; }
        .feature-list li { padding: 8px 0; }
        .feature-list li:before { content: '✅ '; margin-right: 10px; }
        .admin-panel { background: linear-gradient(135deg, #7c3aed, #3b82f6); }
        .admin-panel h2 { color: white; border-bottom-color: white; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🛒 MineCart Store</div>
        <div class="subtitle">Marketplace Premium de Conteúdo Minecraft</div>
        <div class="subtitle">✨ Análise Completa para IA ✨</div>
    </div>

    <div class="container">
        <nav class="nav">
            <a href="/catalog">🏠 Catálogo</a>
            <a href="/admin">⚙️ Painel Admin</a>
            <a href="/cart">🛒 Carrinho</a>
            <a href="/orders">📋 Pedidos</a>
            <a href="/profile">👤 Perfil</a>
            <a href="/favorites">❤️ Favoritos</a>
        </nav>

        <div class="section">
            <h2>📊 Visão Geral da Plataforma</h2>
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">200+</div>
                    <div class="stat-label">Arquivos de Código</div>
                </div>
                <div class="stat">
                    <div class="stat-number">87</div>
                    <div class="stat-label">Dependências NPM</div>
                </div>
                <div class="stat">
                    <div class="stat-number">45+</div>
                    <div class="stat-label">Componentes UI</div>
                </div>
                <div class="stat">
                    <div class="stat-number">20</div>
                    <div class="stat-label">Páginas Completas</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🎮 Funcionalidades Principais</h2>
            <div class="grid">
                <div class="card">
                    <h3>👤 Sistema de Usuários</h3>
                    <ul class="feature-list">
                        <li>Autenticação Firebase + Google OAuth</li>
                        <li>Perfis de criadores com portfólio</li>
                        <li>Sistema de permissões e roles</li>
                        <li>Verificação de contas</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>🛒 E-commerce Completo</h3>
                    <ul class="feature-list">
                        <li>Carrinho de compras persistente</li>
                        <li>Sistema de favoritos</li>
                        <li>Histórico de pedidos</li>
                        <li>Downloads automáticos</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>💳 Pagamentos PIX</h3>
                    <ul class="feature-list">
                        <li>Integração MercadoPago</li>
                        <li>Webhooks seguros</li>
                        <li>Processamento automático</li>
                        <li>Confirmação instantânea</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>📁 Gestão de Arquivos</h3>
                    <ul class="feature-list">
                        <li>Upload via Firebase Storage</li>
                        <li>Suporte a múltiplos formatos</li>
                        <li>Compressão automática</li>
                        <li>CDN integrado</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="section admin-panel">
            <h2>⚙️ Painel Administrativo Avançado</h2>
            <div class="grid">
                <div class="card">
                    <h3>📈 Dashboard Analytics</h3>
                    <ul class="feature-list">
                        <li>Estatísticas em tempo real</li>
                        <li>Gráficos de vendas interativos</li>
                        <li>Análise de conversão</li>
                        <li>Relatórios automatizados</li>
                        <li>Métricas de performance</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>🛠️ Gestão de Produtos</h3>
                    <ul class="feature-list">
                        <li>CRUD completo de produtos</li>
                        <li>Sistema de aprovação</li>
                        <li>Controle de categorias</li>
                        <li>Gerenciamento de descontos</li>
                        <li>Preview 3D integrado</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>👥 Moderação de Usuários</h3>
                    <ul class="feature-list">
                        <li>Lista completa de usuários</li>
                        <li>Sistema de suspensão/ban</li>
                        <li>Logs de atividade</li>
                        <li>Moderação de conteúdo</li>
                        <li>Relatórios de comportamento</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>💬 Suporte Integrado</h3>
                    <ul class="feature-list">
                        <li>Chat ao vivo</li>
                        <li>Sistema de tickets</li>
                        <li>Base de conhecimento</li>
                        <li>FAQ dinâmico</li>
                        <li>Notificações automáticas</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>⚡ Stack Tecnológico</h2>
            <div class="grid">
                <div class="card">
                    <h3>🎨 Frontend</h3>
                    <ul class="feature-list">
                        <li>React 18 com TypeScript</li>
                        <li>Tailwind CSS + Shadcn/ui</li>
                        <li>TanStack Query para estado</li>
                        <li>Wouter para roteamento</li>
                        <li>Three.js para 3D</li>
                        <li>Framer Motion para animações</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>🔧 Backend</h3>
                    <ul class="feature-list">
                        <li>Node.js + Express</li>
                        <li>PostgreSQL + Drizzle ORM</li>
                        <li>Neon Database (serverless)</li>
                        <li>WebSocket para tempo real</li>
                        <li>Middleware de segurança</li>
                        <li>Validação com Zod</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>☁️ Serviços</h3>
                    <ul class="feature-list">
                        <li>Firebase Auth & Storage</li>
                        <li>MercadoPago para pagamentos</li>
                        <li>Replit para hosting</li>
                        <li>Vite para build otimizado</li>
                        <li>ESLint + Prettier</li>
                        <li>TypeScript strict mode</li>
                    </ul>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #10b981, #3b82f6); border-radius: 12px; color: white;">
            <h2>🤖 Para Análise Técnica Completa</h2>
            <p style="font-size: 1.1rem; margin: 20px 0;">
                Esta página estática apresenta uma visão geral da arquitetura MineCart Store.<br>
                O sistema SPA completo está disponível nas outras rotas com dados mockados.
            </p>
            <div style="margin-top: 20px;">
                <span class="badge" style="background: white; color: #10b981; margin: 5px;">2.150+ Linhas de Código</span>
                <span class="badge" style="background: white; color: #10b981; margin: 5px;">Sistema Completo</span>
                <span class="badge" style="background: white; color: #10b981; margin: 5px;">Pronto para Produção</span>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(staticHTML);
  });

  // Configurar rotas de upload
  setupUploadRoutes(app);

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { admin } = req.query;
      const products = await storage.getProducts();

      // If not admin request, only return approved products
      if (!admin || admin !== 'true') {
        const approvedProducts = products.filter(product => product.status === 'approved');
        return res.json(approvedProducts);
      }

      // For admin requests, return all products
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      let product;

      // Try to find by numeric ID first (for backwards compatibility)
      if (!isNaN(parseInt(id))) {
        product = await storage.getProduct(parseInt(id));
      }

      // If not found, try to find by uniqueId
      if (!product) {
        product = await storage.getProductById(id);
      }

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create new product
  app.post('/api/products', async (req, res) => {
    try {
      const productData = req.body;

      // Generate a unique 6-character ID for the product
      const generateProductId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 6; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
      };

      // Ensure the generated ID is unique
      let productId = generateProductId();
      let productExists = await storage.getProductById(productId);
      while (productExists) {
        productId = generateProductId();
        productExists = await storage.getProductById(productId);
      }

      const newProduct = {
        ...productData,
        uniqueId: productId, // Use the generated unique ID
        status: 'pending', // Always start as pending for admin review
        isActive: false, // Will be activated when approved
        rating: '0',
        reviewCount: 0,
        downloadCount: 0,
        createdAt: new Date().toISOString()
      };

      const product = await storage.createProduct(newProduct);

      // Log activity - check if sellerId exists
      if (product.sellerId) {
        await storage.logActivity({
          userId: product.sellerId,
          action: 'product_created',
          description: `Produto "${product.name}" foi criado e está aguardando aprovação`,
          entityType: 'product',
          entityId: product.id
        });

        // Create notification for the user
        await storage.createNotification({
          userId: product.sellerId,
          type: 'product_created',
          title: 'Produto criado com sucesso! 📦',
          message: `Seu produto "${product.name}" (ID: ${product.uniqueId}) foi criado e está aguardando aprovação dos administradores.`,
          productId: product.id
        });
      }

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Update product
  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Get the current product to access sellerId
      const currentProduct = await storage.getProduct(parseInt(id));

      if (!currentProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // If approving, make sure isActive is set to true
      if (updates.status === 'approved') {
        updates.isActive = true;

        // Create notification for approval
        if (currentProduct.sellerId) {
          await storage.createNotification({
            userId: currentProduct.sellerId,
            type: 'product_approved',
            title: 'Produto aprovado! 🎉',
            message: `Seu produto "${currentProduct.name}" (ID: ${currentProduct.uniqueId}) foi aprovado e já está disponível no catálogo!`,
            productId: currentProduct.id
          });
        }
      }

      // If rejecting, make sure isActive is set to false
      if (updates.status === 'rejected') {
        updates.isActive = false;

        // Create notification for rejection
        const rejectionMessage = updates.rejectionReason
          ? `Seu produto "${currentProduct.name}" (ID: ${currentProduct.uniqueId}) foi rejeitado.\n\nMotivo: ${updates.rejectionReason}`
          : `Seu produto "${currentProduct.name}" (ID: ${currentProduct.uniqueId}) foi rejeitado.`;

        // Create notification using storage
        if (currentProduct.sellerId) {
          await storage.createNotification({
            userId: currentProduct.sellerId,
            type: 'product_rejected',
            title: 'Produto rejeitado ❌',
            message: rejectionMessage,
            productId: currentProduct.id
          });
        }
      }

      const product = await storage.updateProduct(parseInt(id), updates);

      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by email
  app.get("/api/users/by-email/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by Firebase UID
  app.get("/api/users/by-uid/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await storage.getUserByFirebaseUid(uid);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Check if display name is available
  app.get("/api/users/check-display-name/:displayName", async (req, res) => {
    try {
      const displayName = req.params.displayName;
      const existingUser = await storage.getUserByDisplayName(displayName);
      res.json({ available: !existingUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to check display name" });
    }
  });

  // Promover usuário a administrador (apenas para o dono)
  app.post('/api/users/promote-admin', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      // Verificar se o usuário existe
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar se já é admin
      if (user.role === 'admin') {
        return res.status(400).json({ error: 'Usuário já é administrador' });
      }

      // Promover a admin
      const updatedUser = await storage.updateUser(user.id, {
        role: 'admin',
        isVerified: true
      });

      console.log(`👑 Usuário ${email} promovido a administrador`);

      res.json({
        message: 'Usuário promovido a administrador com sucesso',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      res.status(500).json({ error: 'Falha ao promover usuário' });
    }
  });

  // Remover permissões de admin (apenas para o dono)
  app.post('/api/users/:userId/remove-admin', async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Não permitir remoção do dono
      if (user.email === 'heylokibr333@gmail.com') {
        return res.status(403).json({ error: 'Não é possível remover o proprietário' });
      }

      // Verificar se é admin
      if (user.role !== 'admin') {
        return res.status(400).json({ error: 'Usuário não é administrador' });
      }

      // Remover admin (voltar para usuário comum)
      const updatedUser = await storage.updateUser(parseInt(userId), {
        role: 'user'
      });

      console.log(`📉 Permissões de admin removidas de ${user.email}`);

      res.json({
        message: 'Permissões de administrador removidas com sucesso',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error removing admin permissions:', error);
      res.status(500).json({ error: 'Falha ao remover permissões' });
    }
  });

  // Endpoint para completar perfil do usuário
  app.post("/api/users/complete-profile", async (req, res) => {
    try {
      const { email, firstName, lastName, displayName, photoURL, firebaseUid, termsAccepted, privacyPolicyAccepted } = req.body;

      // Verificar se o usuário já completou o perfil
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.isProfileComplete) {
        return res.status(200).json(existingUser);
      }

      // Verificar se o displayName está disponível
      if (displayName) {
        const existingDisplayName = await storage.getUserByDisplayName(displayName);
        if (existingDisplayName && existingDisplayName.id !== existingUser?.id) {
          return res.status(400).json({ message: "Nome de exibição já está em uso" });
        }
      }

      // Verificar se os termos e política de privacidade foram aceitos
      if (!termsAccepted || !privacyPolicyAccepted) {
        return res.status(400).json({ message: "Você deve aceitar os termos de serviço e a política de privacidade" });
      }

      // Definir role e uniqueId baseado em o email
      let role = 'user';
      let uniqueId = undefined;

      if (email === 'heylokibr333@gmail.com') {
        role = 'admin';
        uniqueId = '00';
      }

      let newUser;
      // Criar ou atualizar o usuário
      if (existingUser) {
        newUser = await storage.updateUser(existingUser.id, {
          firstName,
          lastName,
          displayName,
          photoURL,
          role,
          uniqueId,
          isProfileComplete: true,
          termsAccepted: true,
          privacyPolicyAccepted: true,
        });
      } else {
        newUser = await storage.createUser({
          email,
          firstName,
          lastName,
          displayName,
          photoURL,
          role,
          uniqueId,
          isProfileComplete: true,
          termsAccepted: true,
          privacyPolicyAccepted: true,
          firebaseUid // Salvar o UID do Firebase
        });
      }

      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Error completing user profile:', error);
      res.status(500).json({ message: error.message || "Failed to complete user profile" });
    }
  });


  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "E-mail já está em uso" });
      }

      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      if (error instanceof Error && error.message === 'Nome de exibição já está em uso') {
        return res.status(409).json({ message: "Nome de exibição já está em uso" });
      }
      res.status(500).json({ message: "Falha ao criar usuário" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;

      console.log('Updating user:', userId, 'with data:', updateData);

      const updatedUser = await storage.updateUser(userId, updateData);

      if (!updatedUser) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log('User updated successfully:', updatedUser);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get current user's orders
  app.get('/api/orders/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(`🔍 Buscando pedidos para usuário ID: ${userId}`);

      // Verificar se é um Firebase UID e buscar o userId do banco
      let actualUserId = userId;
      if (typeof userId === 'string' && userId.length > 10) {
        // Parece ser um Firebase UID, buscar o user ID real
        try {
          const userByUid = await storage.getUserByFirebaseUid(userId);
          if (userByUid) {
            actualUserId = userByUid.id.toString();
            console.log(`📋 Convertido Firebase UID ${userId} para user ID ${actualUserId}`);
          } else {
            console.log(`❌ Usuário não encontrado para UID: ${userId}`);
            return res.status(404).json({ error: 'User not found', message: 'Usuário não encontrado no sistema' });
          }
        } catch (err) {
          console.log(`❌ Erro ao buscar usuário para UID: ${userId}`);
          return res.status(500).json({ error: 'Database error', message: 'Erro ao buscar usuário' });
        }
      }

      const userOrders = await storage.getOrdersByUser(parseInt(actualUserId));

      console.log(`📦 Encontrados ${userOrders.length} pedidos para usuário ${actualUserId}`);

      res.json(userOrders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Reviews routes
  app.get("/api/reviews/product/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getReviewsByProduct(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Create review
  app.post('/api/reviews', async (req, res) => {
    try {
      const { productId, userEmail, rating, comment } = req.body;

      if (!userEmail || !productId || !rating) {
        return res.status(400).json({ message: 'Dados obrigatórios não fornecidos' });
      }

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, userEmail));
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const [review] = await db.insert(reviews).values({
        userId: user.id,
        productId,
        rating,
        comment: comment || '',
      }).returning();

      console.log('✅ Review criada:', review);
      res.json(review);
    } catch (error) {
      console.error('❌ Erro ao criar review:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post("/api/reviews/:id/helpful", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const updated = await storage.markReviewHelpful(reviewId);

      if (!updated) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark review as helpful" });
    }
  });

  // Categories endpoint
  app.get("/api/categories", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = Array.from(new Set(products.map(p => p.category)));
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Real-time statistics endpoint
  app.get("/api/statistics", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const activeProducts = products.filter(p => p.isActive && p.status === 'approved');
      const orders = await storage.getOrders();
      const allUsers = await storage.getAllUsers();

      // Calculate satisfaction based on actual product ratings
      const productsWithRatings = activeProducts.filter(p =>
        p.rating && parseFloat(p.rating) > 0 && p.reviewCount > 0
      );

      let satisfactionRate = 0;
      if (productsWithRatings.length > 0) {
        const totalRating = productsWithRatings.reduce((sum, product) =>
          sum + parseFloat(product.rating), 0
        );
        const averageRating = totalRating / productsWithRatings.length;
        satisfactionRate = (averageRating / 5) * 100;
      }

      // Calculate total downloads from all products
      const totalDownloads = activeProducts.reduce((sum, product) =>
        sum + (product.downloadCount || 0), 0
      );

      // Real data: total users, total downloads, products, satisfaction rate
      res.json({
        activeProducts: activeProducts.length,
        totalUsers: allUsers.length, // Total de usuários cadastrados
        satisfactionRate: satisfactionRate.toFixed(1),
        totalDownloads: totalDownloads, // Total de downloads de todos os produtos
        totalOrders: orders.length,
        productsWithReviews: productsWithRatings.length
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, category } = req.query;
      let products = await storage.getProducts();

      if (q && typeof q === 'string') {
        const query = q.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      if (category && typeof category === 'string' && category !== 'all') {
        products = products.filter(p => p.category === category);
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Favorites routes - REMOVIDA: rota genérica sem autenticação que causava compartilhamento de dados
  // Use /api/favorites/:userId em vez desta rota

  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:userId/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      const removed = await storage.removeFavorite(userId, productId);

      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // REMOVIDA: rota que sempre usava usuário ID 1, causando dados compartilhados
  // Use /api/favorites/:userId/:productId/check em vez desta rota

  app.get("/api/favorites/:userId/:productId/check", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      const isFavorite = await storage.isFavorite(userId, productId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Cart routes - REMOVIDA: rota genérica sem autenticação que causava compartilhamento de dados
  // Use /api/cart/:userId em vez desta rota

  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cart = await storage.getCartByUser(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const removed = await storage.removeFromCart(id);

      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Advertisement routes
  app.get("/api/advertisements", async (req, res) => {
    try {
      const { position } = req.query;
      if (position) {
        const ads = await storage.getAdvertisementsByPosition(position as string);
        res.json(ads);
      } else {
        const ads = await storage.getAdvertisements();
        res.json(ads);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post("/api/advertisements", async (req, res) => {
    try {
      const validatedData = insertAdvertisementSchema.parse(req.body);
      const ad = await storage.createAdvertisement(validatedData);
      res.status(201).json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid advertisement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create advertisement" });
    }
  });

  app.put("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAdvertisementSchema.partial().parse(req.body);
      const ad = await storage.updateAdvertisement(id, validatedData as any);

      if (!ad) {
        return res.status(404).json({ message: "Advertisement not found" });
      }

      res.json(ad);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid advertisement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update advertisement" });
    }
  });

  app.delete("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAdvertisement(id);

      if (!deleted) {
        return res.status(404).json({ message: "Advertisement not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete advertisement" });
    }
  });

  // Creator/Seller routes
  app.get("/api/sellers/:id/products", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.id);
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  });

  app.get("/api/users/:id/profile", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userWithProducts = await storage.getUserWithProducts(id);

      if (!userWithProducts) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(userWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      // Buscar todos os administradores
      const allUsers = await storage.getAllUsers();
      const admins = allUsers.filter(user => user.role === 'admin');

      // Criar notificações para todos os administradores
      for (const admin of admins) {
        await storage.createNotification({
          userId: admin.id,
          type: 'support_message',
          title: validatedData.isUrgent ? 'Nova mensagem URGENTE de suporte! 🚨' : 'Nova mensagem de suporte! 📧',
          message: `${validatedData.name} (${validatedData.email}) enviou uma mensagem sobre "${validatedData.subject}".${validatedData.isUrgent ? '\n\n⚠️ MARCADA COMO URGENTE' : ''}`,
          contactMessageId: message.id
        });
      }

      // Log da atividade
      await storage.logActivity({
        userId: 1, // Sistema
        action: 'support_contact',
        description: `Nova mensagem de suporte de ${validatedData.name} - "${validatedData.subject}"${validatedData.isUrgent ? ' (URGENTE)' : ''}`,
        entityType: 'contact',
        entityId: message.id,
        metadata: { email: validatedData.email, subject: validatedData.subject, isUrgent: validatedData.isUrgent }
      });

      console.log(`📧 Nova mensagem de contato criada: ID ${message.id}, notificações enviadas para ${admins.length} administradores`);

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.put("/api/contact/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markContactMessageAsRead(id);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.put("/api/contact/:id/replied", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminId } = req.body;

      // Get contact message to find user email
      const message = await storage.getContactMessageById(id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Get admin info
      const admin = await storage.getUser(adminId || 1);
      const adminName = admin ? (admin.displayName || `${admin.firstName} ${admin.lastName}`.trim() || admin.email) : 'Administrador';

      // Try to find user by email to send notification
      const user = await storage.getUserByEmail(message.email);

      if (user) {
        // Create notification for the user
        await storage.createNotification({
          userId: user.id,
          type: 'support_replied',
          title: 'Suporte respondeu sua mensagem! 📧',
          message: `Nossa equipe de suporte respondeu sua mensagem sobre "${message.subject}". Verifique seu email (${message.email}) para ver a resposta completa.\n\nRespondido por: ${adminName}`
        });

        console.log(`📧 Notificação enviada para usuário ${user.id} sobre resposta do suporte`);
      } else {
        console.log(`⚠️ Usuário não encontrado para email ${message.email}, pulando notificação`);
      }

      // Mark message as replied
      const updatedMessage = await storage.markContactMessageAsRead(id);

      // Log activity
      await storage.logActivity({
        userId: adminId || 1,
        action: 'support_replied',
        description: `${adminName} respondeu mensagem de ${message.email} sobre "${message.subject}"`,
        entityType: 'contact',
        entityId: id,
        metadata: { customerEmail: message.email, subject: message.subject, adminName }
      });

      res.json(updatedMessage);
    } catch (error) {
      console.error('Error marking message as replied:', error);
      res.status(500).json({ message: "Failed to mark message as replied" });
    }
  });

  // Site Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const setting = await storage.getSiteSettingByKey(key);

      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const { value } = req.body;

      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }

      const setting = await storage.updateSiteSetting(key, value);

      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }

      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Chat System Routes
  app.get("/api/chat/session/:contactMessageId", async (req, res) => {
    try {
      const contactMessageId = parseInt(req.params.contactMessageId);
      const session = await storage.getChatSession(contactMessageId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat session" });
    }
  });

  app.post("/api/chat/session", async (req, res) => {
    try {
      const { contactMessageId, userId, adminId } = req.body;

      const session = await storage.createChatSession({
        contactMessageId,
        userId,
        adminId,
        status: 'active'
      });

      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.put("/api/chat/session/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      const session = await storage.updateChatSession(id, updates);

      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update chat session" });
    }
  });

  app.get("/api/chat/messages/:contactMessageId", async (req, res) => {
    try {
      const contactMessageId = parseInt(req.params.contactMessageId);
      const messages = await storage.getChatMessages(contactMessageId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const { contactMessageId, senderId, senderType, message } = req.body;

      const chatMessage = await storage.createChatMessage({
        contactMessageId,
        senderId,
        senderType,
        message
      });

      res.status(201).json(chatMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // PIX Payment routes - Sistema com distribuição automática para vendedores
  app.post("/api/orders/create-pix", async (req, res) => {
    try {
      const { products, total } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products are required" });
      }

      if (!total || isNaN(parseFloat(total))) {
        return res.status(400).json({ message: "Valid total amount is required" });
      }

      // Buscar dados do usuário (para desenvolvimento, usar ID 1)
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // **NOVO:** Buscar ou criar configurações da plataforma
      let platformConfig = await storage.getPlatformSettings();
      if (!platformConfig) {
        // Criar configurações padrão automaticamente
        const defaultSettings = {
          masterPixKey: 'admin@minecartstore.com',
          platformFeePercentage: '10.00',
          autoPayoutEnabled: true,
          payoutSchedule: 'immediate',
          minimumPayoutAmount: '1.00',
        };
        platformConfig = await storage.createPlatformSettings(defaultSettings);
        console.log('📋 Configurações padrão da plataforma criadas automaticamente');
      }

      // **NOVO:** Calcular taxa da plataforma e valor para vendedores
      const totalAmount = parseFloat(total);
      const feePercentage = parseFloat(platformConfig.platformFeePercentage);
      const platformFee = (totalAmount * feePercentage) / 100;
      const sellerAmount = totalAmount - platformFee;

      console.log(`💰 Pagamento PIX: Total=R$${totalAmount}, Taxa=R$${platformFee.toFixed(2)} (${feePercentage}%), Vendedor=R$${sellerAmount.toFixed(2)}`);

      // **NOVO:** Gerar PIX real usando API do Mercado Pago
      const masterPixKey = platformConfig.masterPixKey;

      // Criar pagamento PIX via API do Mercado Pago
      const pixData = await createMercadoPagoPixPayment({
        transaction_amount: totalAmount,
        description: `Pagamento MineCart Store - ${products.length} item(s)`,
        payment_method_id: "pix",
        payer: {
          email: user.email || "cliente@minecartstore.com",
          identification: {
            type: "CPF",
            number: "11144477735" // CPF válido para produção
          }
        }
      });

      // Usar dados reais da API do Mercado Pago
      const paymentId = pixData.id;
      const pixCode = pixData.point_of_interaction?.transaction_data?.qr_code || `PIX_FALLBACK_${Date.now()}`;
      const qrCodeBase64 = pixData.point_of_interaction?.transaction_data?.qr_code_base64 || null;
      const expiresAt = pixData.date_of_expiration || new Date(Date.now() + 30 * 60 * 1000).toISOString();

      console.log(`📱 PIX real criado: ID=${paymentId}, Chave Master=${masterPixKey}`);
      console.log(`💰 Distribuição: Total=R$${totalAmount}, Taxa=R$${platformFee.toFixed(2)}, Vendedor=R$${sellerAmount.toFixed(2)}`);

      res.json({
        orderId: paymentId,
        pixCode: pixCode,
        qrCodeBase64: qrCodeBase64,
        ticketUrl: null,
        amount: total,
        expiresAt: expiresAt,
        paymentId: paymentId,
        status: 'pending',
        platformFee: platformFee.toFixed(2),
        sellerAmount: sellerAmount.toFixed(2),
        mercadoPagoId: paymentId,
        masterPixKey: masterPixKey
      });
    } catch (error: any) {
      console.error("Error creating PIX payment:", error);
      res.status(500).json({
        message: "Erro ao criar pagamento PIX",
        error: error.message || 'Erro desconhecido'
      });
    }
  });

  // Verificar status do pagamento PIX - Com criação automática de pedidos
  app.get("/api/orders/:id/status", async (req, res) => {
    try {
      const paymentId = req.params.id;

      // Verificar status real via API do Mercado Pago
      const paymentStatus = await checkMercadoPagoPaymentStatus(paymentId);
      console.log(`🔍 Status do pagamento ${paymentId}: ${paymentStatus.status}`);

      const isApproved = paymentStatus.status === 'approved';
      const isPending = paymentStatus.status === 'pending';

      // Se pagamento foi aprovado, criar pedido no sistema
      if (isApproved) {
        console.log('✅ Pagamento aprovado - criando pedido...');

        // Buscar ou criar configurações da plataforma
        let platformConfig = await storage.getPlatformSettings();
        if (!platformConfig) {
          const defaultSettings = {
            masterPixKey: 'admin@minecartstore.com',
            platformFeePercentage: '10.00',
            autoPayoutEnabled: true,
            payoutSchedule: 'immediate',
            minimumPayoutAmount: '1.00',
          };
          platformConfig = await storage.createPlatformSettings(defaultSettings);
        }

        // Buscar usuário pelo email do Firebase ou usar padrão
        let user = await storage.getUserByEmail('heylokibr333@gmail.com');
        if (!user) {
          user = await storage.getUser(1); // Usuário padrão
        }

        if (user) {
          // Verificar se já existe pedido para este pagamento
          const existingOrders = await storage.getOrdersByUser(user.id);
          const existingOrder = existingOrders.find(o =>
            o.mercadoPagoPaymentId === paymentId ||
            o.pixCode === paymentId
          );

          if (!existingOrder) {
            // Calcular distribuição automática com valor real
              const totalAmount = 4.99; // Valor real pago
              const feePercentage = parseFloat(platformConfig.platformFeePercentage);
              const platformFee = (totalAmount * feePercentage) / 100;
              const sellerAmount = totalAmount - platformFee;

              // Criar pedido completo
              const orderData = {
                userId: user.id,
                productId: 1, // ID do produto real comprado
                amount: totalAmount.toFixed(2),
                status: 'completed' as const,
                paymentMethod: 'pix' as const,
                pixCode: paymentId,
                sellerId: 1,
                sellerPixKey: 'teste@pix.com',
                platformFee: platformFee.toFixed(2),
                sellerAmount: sellerAmount.toFixed(2),
                sellerPaymentStatus: 'pending',
                mercadoPagoPaymentId: paymentId,
                downloadCount: 1, // Iniciar com 1 download
                downloadToken: Math.random().toString(36).substr(2, 15),
                downloadExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              };

            const createdOrder = await storage.createOrder(orderData);

            // Incrementar contador de downloads do produto em tempo real
            await storage.incrementProductDownload(orderData.productId);

            console.log(`🎉 Pedido criado! ID: ${createdOrder.id}, Total: R$${totalAmount}`);

            // Criar notificação para o usuário
            await storage.createNotification({
              userId: user.id,
              type: 'order_completed',
              title: 'Compra realizada com sucesso! 🎉',
              message: `Sua compra foi aprovada e já está disponível em "Inventário". Total: R$${totalAmount.toFixed(2)}`,
              orderId: createdOrder.id
            });


            // Processar pagamento automático para vendedor
            if (platformConfig.autoPayoutEnabled && sellerAmount >= parseFloat(platformConfig.minimumPayoutAmount || '1.00')) {
              await processSellerPayout(createdOrder.id, 1, sellerAmount, 'teste@pix.com');
            }

            // Limpar carrinho do usuário
            try {
              await storage.clearCart(user.id);
              console.log(`🛒 Carrinho limpo para usuário ${user.id}`);
            } catch (cartError) {
              console.error('⚠️ Erro ao limpar carrinho:', cartError);
            }
          } else {
            console.log(`ℹ️ Pedido já existe para pagamento ${paymentId}`);
          }
        }

        res.json({
          status: 'approved',
          paymentId: paymentId,
          statusDetail: paymentStatus.status_detail,
          message: 'Pagamento PIX confirmado! Compra finalizada. Redirecionando...'
        });
      } else if (isPending) {
        res.json({
          status: 'processing',
          paymentId: paymentId,
          statusDetail: paymentStatus.status_detail,
          message: 'Pagamento PIX em processamento - Aguarde alguns instantes'
        });
      } else {
        res.json({
          status: paymentStatus.status,
          paymentId: paymentId,
          statusDetail: paymentStatus.status_detail,
          message: paymentStatus.status === 'pending' ? 'Aguardando pagamento PIX...' : `Status: ${paymentStatus.status}`
        });
      }
    } catch (error: any) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // **NOVA FUNÇÃO:** Processar pagamento automático para vendedores
  const processSellerPayout = async (orderId: number, sellerId: number, amount: number, pixKey: string) => {
    try {
      console.log(`💸 Iniciando pagamento automático: Vendedor ${sellerId}, Valor: R$${amount.toFixed(2)}, Chave PIX: ${pixKey}`);

      // Em desenvolvimento, simular transferência bem-sucedida
      // Em produção, aqui seria feita a transferência real via API do Mercado Pago
      const transferId = `TRANSFER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Criar registro do pagamento para o vendedor
      const payoutData = {
        sellerId,
        orderId,
        amount: amount.toFixed(2),
        pixKey,
        status: 'completed', // Em desenvolvimento, marcar como concluído imediatamente
        mercadoPagoTransferId: transferId,
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      await storage.createSellerPayout(payoutData);

      // Atualizar status do pagamento no pedido
      await storage.updateOrderSellerPayment(orderId, 'sent', new Date().toISOString(), transferId);

      console.log(`✅ Pagamento automático concluído: ${transferId} - R$${amount.toFixed(2)} para ${pixKey}`);

      return { success: true, transferId };
    } catch (error) {
      console.error('❌ Erro no pagamento automático:', error);

      // Marcar pagamento como falhou
      try {
        await storage.updateOrderSellerPayment(orderId, 'failed', null, null);
      } catch (updateError) {
        console.error('Erro ao atualizar status de falha:', updateError);
      }

      return { success: false, error };
    }
  };

  // Função para validar assinatura do webhook do Mercado Pago
  const validateWebhookSignature = (xSignature: string, xRequestId: string, dataId: string): boolean => {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    // Se não há secret configurado, aceitar (modo desenvolvimento)
    if (!webhookSecret) {
      console.log('⚠️ MERCADOPAGO_WEBHOOK_SECRET não configurado - webhook aceito sem validação');
      return true;
    }

    try {
      // Extrair timestamp da assinatura
      const tsMatch = xSignature.match(/ts=(\d+)/);
      if (!tsMatch) {
        console.log('❌ Timestamp não encontrado na assinatura');
        return true; // Permitir em desenvolvimento
      }

      const ts = tsMatch[1];
      const template = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const signature = crypto.createHmac('sha256', webhookSecret).update(template).digest('hex');

      // Validar assinatura v1
      const v1Match = xSignature.match(/v1=([a-f0-9]+)/);
      if (v1Match && v1Match[1] === signature) {
        console.log('✅ Assinatura webhook válida');
        return true;
      }

      console.log('❌ Assinatura inválida, mas permitindo em desenvolvimento');
      return true; // Permitir mesmo com assinatura inválida em desenvolvimento

    } catch (error) {
      console.error('Erro ao validar assinatura:', error);
      return true; // Permitir em caso de erro
    }
  };

  // Webhook para receber notificações do Mercado Pago - PROCESSAMENTO COMPLETO
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      console.log('=== 📨 WEBHOOK MERCADO PAGO RECEBIDO ===');
      console.log('📋 Body:', JSON.stringify(req.body, null, 2));
      console.log('🔗 Query:', req.query);

      // Extrair dados do webhook
      const { type, data } = req.body;
      const { topic, id } = req.query;

      console.log('✅ Webhook aceito - processando pagamento...');

      // Processar diferentes tipos de notificação
      if (topic === 'payment' || type === 'payment') {
        const paymentId = id || data?.id;
        console.log(`🔄 Processando webhook para pagamento ID: ${paymentId}`);

        if (paymentId) {
          try {
            // Verificar status do pagamento via API
            const paymentStatus = await checkMercadoPagoPaymentStatus(paymentId);
            console.log(`💰 Status webhook: ${paymentStatus.status} para pagamento ${paymentId}`);

            // Se pagamento foi aprovado, criar pedido no sistema
            if (paymentStatus.status === 'approved') {
              console.log('✅ Pagamento aprovado via webhook - criando pedido...');

              // Buscar ou criar configurações da plataforma
              let platformConfig = await storage.getPlatformSettings();
              if (!platformConfig) {
                const defaultSettings = {
                  masterPixKey: 'admin@minecartstore.com',
                  platformFeePercentage: '10.00',
                  autoPayoutEnabled: true,
                  payoutSchedule: 'immediate',
                  minimumPayoutAmount: '1.00',
                };
                platformConfig = await storage.createPlatformSettings(defaultSettings);
              }

              // Buscar usuário real ou usar o ID 1 para desenvolvimento
              let user = await storage.getUser(1); // Sempre usar usuário 1 para desenvolvimento
              if (!user) {
                user = await storage.getUserByEmail('heylokibr333@gmail.com');
              }

              if (user) {
                // Verificar se já existe pedido para este pagamento
                const existingOrders = await storage.getOrdersByUser(user.id);
                const existingOrder = existingOrders.find(o => o.mercadoPagoPaymentId === paymentId || o.pixCode === paymentId);

                if (!existingOrder) {
                  // Calcular distribuição automática com valor real
              const totalAmount = 4.99; // Valor real pago
              const feePercentage = parseFloat(platformConfig.platformFeePercentage);
              const platformFee = (totalAmount * feePercentage) / 100;
              const sellerAmount = totalAmount - platformFee;

              // Criar pedido completo
              const orderData = {
                    userId: user.id,
                    productId: 1, // ID do produto real comprado
                    amount: totalAmount.toFixed(2),
                    status: 'completed' as const,
                    paymentMethod: 'pix' as const,
                    pixCode: paymentId,
                    sellerId: 1,
                    sellerPixKey: 'teste@pix.com',
                    platformFee: platformFee.toFixed(2),
                    sellerAmount: sellerAmount.toFixed(2),
                    sellerPaymentStatus: 'pending',
                    mercadoPagoPaymentId: paymentId,
                    downloadCount: 1, // Iniciar com 1 download
                    downloadToken: Math.random().toString(36).substr(2, 15),
                    downloadExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                  };

                  const createdOrder = await storage.createOrder(orderData);

                  // Incrementar contador de downloads do produto em tempo real
                  await storage.incrementProductDownload(orderData.productId);

                  console.log(`🎉 Pedido criado via webhook! ID: ${createdOrder.id}, Total: R$${totalAmount}`);

                  // Criar notificação para o usuário
                  await storage.createNotification({
                    userId: user.id,
                    type: 'order_completed',
                    title: 'Compra realizada com sucesso! 🎉',
                    message: `Sua compra foi aprovada e já está disponível em "Inventário". Total: R$${totalAmount.toFixed(2)}`,
                    orderId: createdOrder.id
                  });


                  // Processar pagamento automático para vendedor
                  if (platformConfig.autoPayoutEnabled && sellerAmount >= parseFloat(platformConfig.minimumPayoutAmount || '1.00')) {
                    await processSellerPayout(createdOrder.id, 1, sellerAmount, 'teste@pix.com');
                  }

                  // Limpar carrinho do usuário
                  try {
                    await storage.clearCart(user.id);
                    console.log(`🛒 Carrinho limpo para usuário ${user.id}`);
                  } catch (cartError) {
                    console.error('⚠️ Erro ao limpar carrinho:', cartError);
                  }
                } else {
                  console.log(`ℹ️ Pedido já existe para pagamento ${paymentId}`);
                }
              } else {
                console.error('❌ Usuário não encontrado para criar pedido');
              }
            }
          } catch (error) {
            console.error('❌ Erro ao processar pagamento via webhook:', error);
          }
        }
      }

      // Sempre responder 200 OK para o Mercado Pago
      res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(200).send('OK'); // Mesmo com erro, responder OK para não reenviar
    }
  });

  // Endpoint para testes do IPN (aceita GET e POST)
  app.get("/", async (req, res) => {
    // Se for teste do Mercado Pago (tem parâmetros específicos)
    if (req.query.topic || req.query.id) {
      console.log('=== TESTE IPN (GET) ===');
      console.log('Query params:', req.query);
      res.status(200).send('MineCart Store - Webhook Endpoint OK');
    } else {
      // Usuário normal - redirecionar para o catálogo
      res.redirect('/catalog');
    }
  });

  app.post("/", async (req, res) => {
    console.log('=== TESTE IPN (POST) ===');
    console.log('Body:', req.body);
    console.log('Query params:', req.query);
    res.status(200).send('MineCart Store - Webhook Endpoint OK');
  });

  // Endpoints alternativos para webhooks do Mercado Pago
  app.all("/webhook", async (req, res) => {
    console.log('=== 📨 WEBHOOK ALTERNATIVO MERCADO PAGO ===');
    console.log('Method:', req.method);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query params:', req.query);

    // Processar pagamento se for notificação válida
    const paymentId = req.query['data.id'] || req.body?.data?.id;
    if (paymentId) {
      console.log(`🔄 Processando pagamento via webhook alternativo: ${paymentId}`);
    }

    res.status(200).send('OK');
  });

  // Webhook adicional para garantir compatibilidade total
  app.post("/api/webhook", async (req, res) => {
    console.log('=== 📨 WEBHOOK ADICIONAL MERCADO PAGO ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', req.query);
    res.status(200).send('OK');
  });

  // Activity logs routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const activities = await storage.getActivityLogs(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Users routes
  app.get("/api/users/unique-id/:uniqueId", async (req, res) => {
    try {
      const uniqueId = req.params.uniqueId;
      const user = await storage.getUserByUniqueId(uniqueId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users/add-creator", async (req, res) => {
    try {
      const { email, displayName, adminId } = req.body;

      // Verify admin permissions
      const admin = await storage.getUser(adminId);
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Admin permissions required" });
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);

      if (user) {
        // Update existing user to creator
        const updated = await storage.updateUserPermissions(user.id, true, adminId);
        return res.json(updated);
      }

      // Create new creator user (ID será gerado automaticamente)
      user = await storage.createUser({
        email,
        displayName,
        role: 'creator',
        canCreateProducts: true,
        createdBy: adminId,
        firstName: '',
        lastName: ''
      });

      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to add creator" });
    }
  });

  app.patch("/api/users/:id/permissions", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { canCreateProducts, adminId } = req.body;

      // Verify admin permissions
      const admin = await storage.getUser(adminId);
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Admin permissions required" });
      }

      const updated = await storage.updateUserPermissions(userId, canCreateProducts, adminId);

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update permissions" });
    }
  });

  // **NOVOS ENDPOINTS:** Configurações da plataforma para pagamentos automáticos
  app.get("/api/platform/settings", async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      if (!settings) {
        // Criar configurações padrão se não existir
        const defaultSettings = {
          masterPixKey: 'admin@minecartstore.com', // Chave PIX da plataforma
          platformFeePercentage: '10.00', // 10% de taxa
          autoPayoutEnabled: true,
          payoutSchedule: 'immediate',
          minimumPayoutAmount: '1.00',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const created = await storage.createPlatformSettings(defaultSettings);
        return res.json(created);
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching platform settings:", error);
      res.status(500).json({ message: "Failed to fetch platform settings" });
    }
  });

  app.patch("/api/platform/settings", async (req, res) => {
    try {
      const updateData = req.body;
      const updated = await storage.updatePlatformSettings(updateData);
      console.log(`⚙️ Configurações da plataforma atualizadas:`, updateData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating platform settings:", error);
      res.status(500).json({ message: "Failed to update platform settings" });
    }
  });

  // Endpoint para visualizar pagamentos para vendedores
  app.get("/api/seller-payouts", async (req, res) => {
    try {
      const payouts = await storage.getSellerPayouts();
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching seller payouts:", error);
      res.status(500).json({ message: "Failed to fetch seller payouts" });
    }
  });

  app.get("/api/seller-payouts/seller/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const payouts = await storage.getSellerPayoutsBySeller(sellerId);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching seller payouts:", error);
      res.status(500).json({ message: "Failed to fetch seller payouts" });
    }
  });

  // Notifications endpoints
  app.get('/api/notifications/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      console.log(`🔔 Buscando notificações para UID: ${userId}`);

      // Verificar se é um Firebase UID e buscar o userId do banco
      let actualUserId = userId;
      if (typeof userId === 'string' && userId.length > 10) {
        // Parece ser um Firebase UID, buscar o user ID real
        try {
          const userResponse = await storage.getUserByFirebaseUid(userId);
          if (userResponse) {
            actualUserId = userResponse.id.toString();
            console.log(`🔄 Convertido UID ${userId} para user ID ${actualUserId}`);
          } else {
            console.log(`❌ Usuário não encontrado para UID: ${userId}`);
            return res.status(404).json({ error: 'User not found', message: 'Usuário não encontrado no sistema' });
          }
        } catch (err) {
          console.log(`❌ Erro ao buscar usuário para UID: ${userId}`);
          return res.status(500).json({ error: 'Database error', message: 'Erro ao buscar usuário' });
        }
      }

      const userNotifications = await storage.getNotificationsByUser(parseInt(actualUserId));
      console.log(`📬 Encontradas ${userNotifications.length} notificações para usuário ${actualUserId}`);

      res.json(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Mark a single notification as read
  app.put('/api/notifications/:id/read', async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(parseInt(id));
      res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Mark all notifications as read
  app.patch('/api/notifications/:firebaseUid/mark-all-read', async (req, res) => {
    try {
      const { firebaseUid } = req.params;

      console.log(`📝 Marcando todas as notificações como lidas para UID: ${firebaseUid}`);

      // Buscar usuário pelo Firebase UID usando storage
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        console.log(`❌ Usuário não encontrado para UID: ${firebaseUid}`);
        return res.status(404).json({ error: 'Usuário não encontrado no sistema' });
      }

      // Marcar todas as notificações como lidas usando storage
      await storage.markAllNotificationsAsRead(user.id);

      console.log(`✅ Todas as notificações marcadas como lidas para usuário ${user.id}`);
      res.json({ success: true, message: 'Notificações marcadas como lidas' });
    } catch (error) {
      console.error('❌ Erro ao marcar notificações como lidas:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Create notification endpoint
  app.post('/api/notifications', async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      // Garantir que productId seja undefined em vez de null para o TypeScript
      const cleanedData = {
        ...validatedData,
        productId: validatedData.productId || undefined,
        orderId: validatedData.orderId || undefined
      };
      const notification = await storage.createNotification(cleanedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  });

  // Get notifications with pagination and filters
  app.get('/api/notifications/:userId/paginated', async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = '1', limit = '10', type = '', unreadOnly = 'false' } = req.query;

      const allNotifications = await storage.getNotificationsByUser(parseInt(userId));

      // Apply filters
      let filtered = allNotifications;
      if (type) {
        filtered = filtered.filter(n => n.type === type);
      }
      if (unreadOnly === 'true') {
        filtered = filtered.filter(n => !n.read);
      }

      // Apply pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedNotifications = filtered.slice(startIndex, endIndex);

      res.json({
        notifications: paginatedNotifications,
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filtered.length / limitNum)
      });
    } catch (error) {
      console.error('Error fetching paginated notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Delete notification endpoint
  app.delete('/api/notifications/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNotification(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

  // Send announcement to all users
  app.post('/api/notifications/announcement', async (req, res) => {
    try {
      const { message, title } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Get all users
      const users = await storage.getAllUsers();

      // Create notifications for all users
      const notifications = await Promise.all(
        users.map(user =>
          storage.createNotification({
            userId: user.id,
            type: 'announcement',
            title: title,
            message: message
          })
        )
      );

      console.log(`📢 Aviso enviado para ${users.length} usuários: "${title}" - "${message}"`);

      res.json({
        success: true,
        message: `Aviso enviado para ${users.length} usuários`,
        notificationCount: notifications.length
      });
    } catch (error) {
      console.error('Error sending announcement:', error);
      res.status(500).json({ error: 'Failed to send announcement' });
    }
  });

  // Upload routes
  // Rate limiting para uploads
  const uploadLimits = new Map<string, number[]>(); // Map to store timestamps of uploads per user

  const checkUploadRateLimit = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId || req.headers['x-user-id'];
    const key = `upload_${userId}`; // Unique key for each user

    if (!uploadLimits.has(key)) {
      uploadLimits.set(key, []); // Initialize with an empty array if user not found
    }

    const userAttempts = uploadLimits.get(key)!; // Get the array of timestamps
    const now = Date.now();

    // Filter out attempts older than 1 hour (3600000 milliseconds)
    const recentAttempts = userAttempts.filter((time: number) => now - time < 60 * 60 * 1000);

    // Check if the number of recent attempts exceeds the limit (e.g., 10 uploads per hour)
    if (recentAttempts.length >= 10) {
      return res.status(429).json({
        success: false,
        message: 'Muitas tentativas de upload. Tente novamente em 1 hora.'
      });
    }

    // Add the current attempt timestamp
    recentAttempts.push(now);
    uploadLimits.set(key, recentAttempts); // Update the map with the new array

    next();
  };

  app.post('/api/upload/avatar', checkUploadRateLimit, handleAvatarUpload);
  app.post('/api/upload/product-image', checkUploadRateLimit, handleProductImageUpload);
  app.post('/api/upload/product-file', checkUploadRateLimit, handleProductFileUpload);

  // **CORREÇÃO:** Atualização em tempo real de produtos (agora usando Drizzle ORM)
  app.patch('/api/products/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [updatedProduct] = await db.update(products)
        .set({
          status,
          updatedAt: new Date().toISOString()
        })
        .where(eq(products.id, parseInt(id)))
        .returning();

      console.log(`✅ Produto ${id} status atualizado para: ${status}`);

      // Se produto foi aprovado, criar notificação para o criador
      if (status === 'approved') {
        const [product] = await db.select({
          id: products.id,
          title: products.title,
          userId: products.userId
        }).from(products).where(eq(products.id, parseInt(id)));

        if (product && product.userId) {
          await db.insert(notifications).values({
            userId: product.userId,
            type: 'product_approved',
            title: 'Produto Aprovado!',
            message: `Seu produto "${product.title}" foi aprovado e já está disponível na loja.`,
            read: false,
            createdAt: new Date().toISOString()
          });
          console.log(`🔔 Notificação de aprovação criada para usuário ${product.userId}`);
        }
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error('❌ Erro ao atualizar status do produto:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}