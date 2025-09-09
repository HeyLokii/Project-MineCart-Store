# 🚀 INSTRUÇÕES COMPLETAS: REPLICAR 100% DO MINECART STORE NO PAYHIP

## 🎯 **TODAS AS FUNCIONALIDADES DO NOSSO SITE**

---

## 🏛️ **ESTRUTURA COMPLETA DE PÁGINAS**

### **TODAS AS 20 PÁGINAS EXATAS DO SEU SITE**
1. **🏠 Home.tsx** - Hero + Stats + Filtros + Grid produtos (página principal)
2. **📦 ProductDetail.tsx** - Tabs + Reviews + 3D Viewer + Checkout PIX
3. **🔐 Auth.tsx** - Login/Registro Firebase + Google OAuth
4. **⚙️ Admin.tsx** - Dashboard administrativo com verificação de permissão
5. **💬 AdminSupport.tsx** - Sistema de chat e tickets de suporte
6. **🔧 AdminSettings.tsx** - Configurações do sistema e redes sociais
7. **📋 Orders.tsx** - Histórico completo de pedidos/downloads
8. **👤 Profile.tsx** - Perfil público do usuário
9. **👤 ProfileSafe.tsx** - Área segura de edição de perfil
10. **🛒 Cart.tsx** - Carrinho com cálculos e checkout
11. **🎨 Creator.tsx** - Perfil público de criador/vendedor
12. **❤️ Favorites.tsx** - Lista de produtos favoritos
13. **📞 Contact.tsx** - Formulário de contato com chat ao vivo
14. **ℹ️ About.tsx** - Página sobre a empresa/história
15. **✏️ CompleteProfile.tsx** - Setup obrigatório pós-registro
16. **📄 Privacy.tsx** - Modal de política de privacidade
17. **📄 PrivacyPolicy.tsx** - Página completa LGPD
18. **📄 Terms.tsx** - Modal de termos de serviço  
19. **📄 TermsOfService.tsx** - Página completa de termos
20. **❌ not-found.tsx** - Página 404 personalizada

---

## 🛍️ **SISTEMA COMPLETO DE PRODUTOS**

### **CATEGORIAS EXATAS DO SEU SITE ATUAL**
```javascript
// Categories array EXATO do seu Home.tsx
const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'skins', name: 'Skins' },
  { id: 'maps', name: 'Mapas' },
  { id: 'mods', name: 'Mods' },
  { id: 'textures', name: 'Texturas' },
  { id: 'worlds', name: 'Mundos' },
];
```

### **FUNCIONALIDADES DE PRODUTO**
- **Upload múltiplo** - Até 5GB por arquivo
- **Visualizador 3D** - Three.js para modelos
- **YouTube integration** - Vídeos de demonstração
- **Sistema de aprovação** - Admin aprova produtos
- **Múltiplas imagens** - Galeria completa
- **Compatibility tags** - Versões Minecraft
- **Features list** - Lista de características
- **Download tracking** - Contagem de downloads
- **Rating system** - Avaliações com estrelas
- **Related products** - Produtos relacionados

### **ESTRUTURA DE PRODUTO NO PAYHIP**
```
TÍTULO: [CATEGORIA] Nome - Versão MC
EXEMPLO: [SKIN] Steve Guerreiro - 1.20+

DESCRIÇÃO PADRÃO:
🎮 DESCRIÇÃO DETALHADA
[Descrição completa do produto]

⭐ CARACTERÍSTICAS
✅ Compatível com Minecraft [versões]
✅ Instalação em 1 clique
✅ Suporte técnico incluso
✅ Arquivos em ultra qualidade
✅ Tutorial de instalação
✅ Updates gratuitos

📦 ARQUIVOS INCLUSOS
• Arquivo principal (.mcaddon/.zip)
• Imagens de preview HD
• Tutorial de instalação (PDF)
• Guia de compatibilidade
• Suporte por email/chat

🔧 INSTALAÇÃO RÁPIDA
1. Baixe todos os arquivos
2. Execute no Minecraft
3. Ative nas configurações
4. Aproveite o conteúdo!

💬 SUPORTE PREMIUM
• Chat ao vivo
• Email: suporte@seudominio.com
• Discord: Sua Loja Store
• Response time: <2h

🏆 GARANTIA TOTAL
• 30 dias de garantia
• Reembolso total se não funcionar
• Suporte vitalício incluso
```

---

## 👥 **SISTEMA COMPLETO DE USUÁRIOS**

### **TIPOS DE USUÁRIO**
1. **👤 Usuário Regular**
   - Comprar produtos
   - Avaliar e favoritar
   - Chat com suporte
   - Histórico completo

2. **🎨 Criador/Vendedor**
   - Todas funções de usuário +
   - Vender produtos
   - Dashboard de vendas
   - Receber pagamentos PIX
   - Analytics detalhado

3. **⚡ Administrador**
   - Controle total
   - Aprovar/rejeitar produtos
   - Gerenciar usuários
   - Chat de suporte
   - Analytics completo
   - Configurações sistema

### **PROCESSO DE REGISTRO COMPLETO**
```
1. GOOGLE OAUTH LOGIN
   - Popup ou redirect
   - Validação automática
   - Fallback para CORS

2. PERFIL OBRIGATÓRIO
   - Nome real (primeiro nome)
   - Sobrenome  
   - Username único (validação real-time)
   - Avatar opcional (upload)
   - ACEITE OBRIGATÓRIO de Termos + Privacidade

3. VALIDAÇÕES
   - Username único verificado
   - Tipos arquivo avatar
   - Tamanho máximo imagem
   - Email único

4. PERFIL PÚBLICO
   - Username exibido
   - Avatar personalizado
   - Links sociais (YouTube, Twitter, Instagram)
   - Bio personalizada
   - Produtos vendidos
   - Avaliações recebidas
```

---

## 🛒 **SISTEMA COMPLETO DE CARRINHO E CHECKOUT**

### **CARRINHO AVANÇADO**
- **Persistência** - Salvo por usuário
- **Cálculos dinâmicos** - Preços, descontos, total
- **Cupons** - Sistema completo de desconto
- **Cross-selling** - Produtos relacionados
- **Save for later** - Mover para favoritos
- **Validation** - Verificar disponibilidade

### **CHECKOUT PIX COMPLETO**
```
INTEGRAÇÃO MERCADO PAGO:
1. Gerar QR Code PIX
2. Mostrar código para copy/paste
3. Verificação automática de pagamento
4. Webhook de confirmação
5. Download imediato
6. Email de confirmação
7. Notificações push
```

### **SISTEMA DE CUPONS**
```
TIPOS DE CUPONS:
- PRIMEIRA15 (15% primeira compra)
- MINECRAFT10 (10% geral)
- PREMIUM20 (20% packs premium)
- CREATOR5 (5% indicação criador)
- FIDELIDADE25 (25% clientes VIP)
- SAZONAL30 (30% promoções especiais)

CONFIGURAÇÕES:
- Valor fixo ou percentual
- Limite de uso
- Data validade
- Produtos específicos
- Usuários específicos
- Stacking (acumular cupons)
```

---

## ⭐ **SISTEMA COMPLETO DE REVIEWS**

### **FUNCIONALIDADES REVIEWS**
- **Só quem comprou** - Verificação de compra
- **5 estrelas** - Sistema rating
- **Comentários** - Texto livre
- **Helpful votes** - Útil/não útil
- **Moderation** - Admin pode remover
- **Response system** - Vendedor responder
- **Photos/videos** - Media nas reviews
- **Verification badge** - "Compra verificada"

### **CONFIGURAÇÃO PAYHIP**
```javascript
// JavaScript para sistema de reviews
function createReviewSystem() {
    // HTML do sistema de reviews
    const reviewHTML = `
    <div class="reviews-section">
        <h3>Avaliações dos Clientes</h3>
        <div class="review-stats">
            <div class="average-rating">
                <span class="rating-number">4.8</span>
                <div class="stars">★★★★★</div>
                <span class="total-reviews">(247 avaliações)</span>
            </div>
        </div>
        <div class="reviews-list">
            <!-- Reviews dinamicamente carregadas -->
        </div>
        <div class="write-review">
            <button class="btn-review">Escrever Avaliação</button>
        </div>
    </div>`;
    
    // Adicionar ao produto
    document.querySelector('.product-content').insertAdjacentHTML('beforeend', reviewHTML);
}
```

---

## 🔧 **SISTEMA ADMINISTRATIVO COMPLETO**

### **DASHBOARD ADMIN**
```
📊 ANALYTICS PRINCIPAIS:
- Vendas hoje/semana/mês/ano
- Produtos mais vendidos
- Usuários mais ativos
- Revenue por categoria
- Conversion rates
- Traffic sources

👥 GERENCIAMENTO USUÁRIOS:
- Lista completa usuários
- Busca e filtros
- Suspender/banir usuários
- Alterar roles (user/creator/admin)
- Ver histórico compras
- Reset senhas

📦 GERENCIAMENTO PRODUTOS:
- Aprovar/rejeitar produtos
- Lista pendentes aprovação
- Edit product details
- Feature/unfeature products
- Analytics por produto
- Bulk operations

💰 GERENCIAMENTO FINANCEIRO:
- Dashboard vendas
- Payouts para sellers
- Configurar taxas
- Relatórios financeiros
- Disputas/reembolsos
- Payment analytics

⚙️ CONFIGURAÇÕES SISTEMA:
- Site settings (nome, logo, cores)
- Payment settings (PIX, fees)
- Email templates
- Social media links
- SEO configurations
- Maintenance mode
```

### **SISTEMA DE CHAT/SUPORTE**
```
💬 FUNCIONALIDADES CHAT:
- Chat em tempo real
- Múltiplas conversas
- File sharing
- Admin notifications
- Auto-assignment
- Conversation history
- Satisfaction ratings
- Canned responses

📞 CONTACT FORMS:
- Formulário contato
- Categorização tickets
- Priority levels (normal/urgent)
- Auto-responses
- Email notifications
- Tracking conversations
```

---

## 🎨 **DESIGN SYSTEM COMPLETO**

### **CORES MINECART EXATAS (DO SEU SITE ATUAL)**
```css
:root {
    /* Cores principais EXATAS do seu site */
    --laranja-principal: #FF7A00;    /* Laranja principal */
    --laranja-alternativo: #F97316;  /* Laranja alternativo */
    --amarelo-detalhes: #FFD166;     /* Amarelo detalhes */
    
    /* Backgrounds EXATOS */
    --cinza-escuro: #111827;         /* Fundo principal muito escuro */
    --cinza-medio: #1F2937;          /* Cards e elementos */
    --cinza-claro: #374151;          /* Elementos destacados */
    
    /* Text colors EXATOS */
    --branco: #F9FAFB;               /* Texto claro */
    --preto-suave: #030712;          /* Muito escuro */
    
    /* Cores adicionais do seu tema */
    --verde-petroleo: #006D77;
    --azul-marinho: #1D4ED8;
    
    /* CSS Variables do sistema atual */
    --background: 220 26% 7%;
    --foreground: 210 20% 98%;
    --primary: 22 100% 50%;          /* Laranja */
    --accent: 45 100% 70%;           /* Amarelo */
    --muted: 220 13% 18%;
    --border: 220 13% 18%;
}
```

### **TYPOGRAPHY EXATA DO SEU SITE**
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Fonte principal do body */
body {
    font-family: 'Inter', sans-serif;
    background-color: var(--cinza-escuro) !important;
    color: var(--branco) !important;
    margin: 0 auto !important;
    max-width: 1400px !important;
    width: 100% !important;
}

/* Classe minecraftia para logo e títulos especiais */
.minecraftia {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.8em;
    line-height: 1.6;
}

/* Logo do header */
.logo-text {
    font-weight: 700;
    font-size: 1.25rem;
    background: linear-gradient(135deg, var(--laranja-principal), var(--amarelo-detalhes));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
```

### **COMPONENTS CSS**
```css
/* Botões estilo Minecraft */
.btn-minecraft {
    background: linear-gradient(45deg, var(--primary), var(--primary-alt));
    border: 2px solid var(--primary);
    color: white;
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    padding: 12px 24px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 4px 0 var(--primary-alt);
}

.btn-minecraft:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 122, 0, 0.4);
}

.btn-minecraft:active {
    transform: translateY(0);
    box-shadow: 0 2px 0 var(--primary-alt);
}

/* Cards de produto */
.product-card {
    background: var(--bg-card);
    border: 1px solid #374151;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
}

.product-card:hover {
    border-color: var(--primary);
    box-shadow: 0 10px 30px rgba(255, 122, 0, 0.2);
    transform: translateY(-5px);
}

.product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
}

/* Header style */
.header {
    background: var(--bg-dark);
    border-bottom: 3px solid var(--primary);
    backdrop-filter: blur(10px);
}

/* Footer style */
.footer {
    background: var(--bg-dark);
    border-top: 1px solid #374151;
}

/* Preços destacados */
.price {
    color: var(--primary);
    font-weight: 700;
    font-size: 18px;
}

.original-price {
    color: var(--text-muted);
    text-decoration: line-through;
    font-size: 14px;
}

/* Badges e tags */
.badge {
    background: var(--primary);
    color: white;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
}

/* Ratings */
.star-rating {
    color: var(--accent);
    font-size: 16px;
}

/* Background pattern */
body {
    background-color: var(--bg-dark);
    background-image: 
        radial-gradient(circle at 1px 1px, #374151 1px, transparent 0);
    background-size: 20px 20px;
}
```

---

## 📱 **ESTRUTURA EXATA DO SEU SITE ATUAL**

### **HEADER COMPONENT EXATO**
```html
<!-- Header sticky com fundo escuro -->
<header class="sticky top-0 z-50 border-b header-dark w-full">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
    
    <!-- Logo EXATO -->
    <div class="flex items-center space-x-2 cursor-pointer">
      <img 
        src="https://i.imgur.com/5OKEMhN.png" 
        alt="MineCart Store Logo"
        class="w-10 h-10 rounded-lg"
      />
      <h1 class="minecraftia text-primary text-xl">MineCart Store</h1>
    </div>

    <!-- Navigation EXATA -->
    <nav class="hidden md:flex space-x-6">
      <button class="text-muted-foreground hover:text-foreground">Catálogo</button>
      <button class="text-muted-foreground hover:text-foreground">Sobre</button>
      <button class="text-muted-foreground hover:text-foreground">Contato</button>
    </nav>

    <!-- User Menu EXATO -->
    <div class="flex items-center space-x-4">
      <!-- Cart Button with Badge -->
      <button class="relative">
        <svg class="h-5 w-5"><!-- Shopping Cart Icon --></svg>
        <span class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary rounded-full">2</span>
      </button>
      
      <!-- Notifications -->
      <button class="relative">
        <svg class="h-5 w-5"><!-- Bell Icon --></svg>
      </button>
      
      <!-- Avatar Menu -->
      <img class="h-8 w-8 rounded-full" src="avatar.jpg" alt="User" />
    </div>
  </div>
</header>
```

### **HOME PAGE STRUCTURE EXATA**
```html
<!-- Hero Section EXATA -->
<section class="relative overflow-hidden bg-dark-safe py-20 border-b border-highlight">
  <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
  <div class="container relative z-10">
    <div class="text-center space-y-6">
      <!-- Badge -->
      <div class="inline-flex items-center px-4 py-2 rounded-full border border-accent bg-medium-gray text-sm text-accent-yellow backdrop-blur-sm">
        <svg class="mr-2 h-4 w-4 text-primary-orange"><!-- Sparkles --></svg>
        Milhares de conteúdos únicos disponíveis
      </div>
      
      <!-- Title com gradient EXATO -->
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white">
        <span class="bg-gradient-to-r from-accent-yellow via-primary-orange to-accent-yellow bg-clip-text text-transparent">
          MineCart Store
        </span>
      </h1>
      
      <!-- Subtitle EXATA -->
      <p class="text-lg md:text-xl text-light-safe max-w-2xl mx-auto">
        Encontre os melhores conteúdos para Minecraft: skins exclusivas, mapas épicos,
        mods incríveis e muito mais. Criado por uma comunidade apaixonada, para uma comunidade apaixonada.
      </p>
      
      <!-- Buttons EXATOS -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-primary-orange hover:bg-laranja-alternativo text-white font-semibold border-highlight">
          <svg class="mr-2 h-5 w-5"><!-- Search --></svg>
          Explorar Catálogo
        </button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">
          <svg class="mr-2 h-5 w-5"><!-- Heart --></svg>
          Conheça Nossa História
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Stats Section EXATA -->
<section class="py-16 bg-medium-gray border-t border-b border-highlight">
  <div class="container">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
        <h3 class="text-3xl font-bold text-accent-yellow">0</h3>
        <p class="text-light-safe">Produtos Ativos</p>
      </div>
      <div class="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
        <h3 class="text-3xl font-bold text-primary-orange">3</h3>
        <p class="text-light-safe">Usuários</p>
      </div>
      <div class="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
        <h3 class="text-3xl font-bold text-accent-yellow">0.0%</h3>
        <p class="text-light-safe">Satisfação</p>
      </div>
      <div class="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
        <h3 class="text-3xl font-bold text-primary-orange">0</h3>
        <p class="text-light-safe">Downloads Total</p>
      </div>
    </div>
  </div>
</section>

<!-- Filters Section EXATA -->
<section class="bg-medium-gray py-6 border-b border-light-gray">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <!-- Search Bar EXATA -->
      <div class="relative flex-1 max-w-md">
        <input 
          type="text"
          placeholder="Buscar por nome, descrição ou ID..."
          class="pl-10 bg-light-gray border-accent text-light-safe focus:border-primary-orange"
        />
        <svg class="absolute left-3 top-3 h-4 w-4 text-accent-yellow"><!-- Search --></svg>
      </div>

      <!-- Category Filters EXATOS -->
      <div class="flex flex-wrap gap-3">
        <button class="bg-primary-orange hover:bg-laranja-alternativo text-white border-highlight">Todos</button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">Skins</button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">Mapas</button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">Mods</button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">Texturas</button>
        <button class="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe">Mundos</button>
      </div>
    </div>
  </div>
</section>
```

### **PRODUCT CARD EXATO**
```html
<!-- Product Card Structure EXATA -->
<div class="product-card overflow-hidden h-full flex flex-col cursor-pointer">
  <div class="relative">
    <!-- Product Image -->
    <img src="product.jpg" alt="Product" class="w-full h-48 object-cover" />
    
    <!-- Discount Badge -->
    <span class="absolute top-2 left-2 bg-destructive text-white px-2 py-1 rounded text-xs">-20%</span>
    
    <!-- Favorite Button -->
    <button class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-2 h-auto z-10 border-0">
      <svg class="h-4 w-4 text-gray-400 hover:text-red-500"><!-- Heart --></svg>
    </button>
    
    <!-- Featured Badge -->
    <span class="absolute top-2 right-12 bg-accent text-accent-foreground px-2 py-1 rounded text-xs">Destaque</span>
  </div>

  <div class="p-4 flex-1 flex flex-col">
    <!-- Product Title -->
    <h4 class="font-semibold text-lg mb-2 truncate text-dark-safe">Nome do Produto</h4>
    <p class="text-sm text-muted-foreground mb-3 capitalize">categoria</p>

    <!-- Description Preview -->
    <p class="text-sm text-muted-foreground mb-3 line-clamp-2">Descrição do produto...</p>

    <!-- Technical Info -->
    <div class="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
      <div class="flex items-center gap-1">
        <svg class="h-3 w-3"><!-- HardDrive --></svg>
        2.5 MB
      </div>
      <div class="flex items-center gap-1">
        <svg class="h-3 w-3"><!-- FileType --></svg>
        .mcpack
      </div>
      <div class="flex items-center gap-1">
        <svg class="h-3 w-3"><!-- Download --></svg>
        150
      </div>
    </div>

    <div class="mt-auto space-y-3">
      <!-- Rating Stars -->
      <div class="flex items-center">
        <div class="star-rating mr-2 flex">
          <svg class="h-4 w-4 star-filled"><!-- Star --></svg>
          <svg class="h-4 w-4 star-filled"><!-- Star --></svg>
          <svg class="h-4 w-4 star-filled"><!-- Star --></svg>
          <svg class="h-4 w-4 star-filled"><!-- Star --></svg>
          <svg class="h-4 w-4 star-empty"><!-- Star --></svg>
        </div>
        <span class="text-sm text-muted-foreground">4.0 (25 avaliações)</span>
      </div>

      <!-- Creator Info -->
      <div class="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <img class="h-6 w-6 rounded-full" src="creator.jpg" alt="Creator" />
        <span class="text-sm text-muted-foreground">
          Por <span class="hover:underline font-medium text-primary cursor-pointer">Criador</span>
          <span class="ml-1 text-xs bg-secondary text-secondary-foreground px-1 rounded">✓</span>
        </span>
      </div>

      <!-- Price and Add to Cart -->
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-sm text-muted-foreground line-through">R$ 15.99</span>
          <span class="text-xl font-bold text-primary-orange">R$ 12.79</span>
        </div>
        <button class="bg-primary-orange hover:bg-primary-alternative text-white btn-primary rounded-lg border border-primary-orange">
          <svg class="mr-1 h-4 w-4"><!-- ShoppingCart --></svg>
          Carrinho
        </button>
      </div>
    </div>
  </div>
</div>
```

### **ADMIN PANEL EXATO**
```html
<!-- Admin Page Structure EXATA -->
<div class="min-h-screen bg-background">
  <!-- Admin Header EXATO -->
  <div class="bg-card border-b p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button class="flex items-center">
          <svg class="mr-2 h-4 w-4"><!-- ArrowLeft --></svg>
          Voltar ao Site
        </button>
        <h1 class="minecraftia text-2xl text-primary">MineCart Admin</h1>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-muted-foreground">
          Logado como: [Nome do Admin]
        </span>
        <svg class="h-5 w-5 text-primary"><!-- Shield --></svg>
      </div>
    </div>
  </div>

  <!-- Verificação de Acesso EXATA -->
  <!-- Se não logado: -->
  <div class="container mx-auto px-4 py-8">
    <div class="text-center py-16">
      <svg class="h-16 w-16 mx-auto mb-4 text-muted-foreground"><!-- Shield --></svg>
      <h2 class="text-2xl font-bold mb-4">Acesso Restrito</h2>
      <p class="text-muted-foreground mb-6">
        Você precisa estar logado para acessar esta área.
      </p>
      <button>Voltar ao Início</button>
    </div>
  </div>

  <!-- Se não admin: -->
  <div class="container mx-auto px-4 py-8">
    <div class="text-center py-16">
      <svg class="h-16 w-16 mx-auto mb-4 text-destructive"><!-- Shield --></svg>
      <h2 class="text-2xl font-bold mb-4">Acesso Negado</h2>
      <p class="text-muted-foreground mb-6">
        Você não tem permissão para acessar o painel administrativo.
      </p>
      <button>Voltar ao Início</button>
    </div>
  </div>

  <!-- AdminDashboardSafe Component -->
  <div class="container mx-auto px-4 py-8">
    [Dashboard Content]
  </div>
</div>
```

### **FOOTER EXATO**
```html
<!-- Footer Structure EXATA -->
<footer class="border-t header-dark">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Logo Section EXATA -->
      <div class="space-y-3">
        <div class="logo-container">
          <img 
            src="https://i.imgur.com/5OKEMhN.png" 
            alt="MineCart Store" 
            class="logo-image w-8 h-8"
          />
          <span class="logo-text">MineCart Store</span>
        </div>
        <p class="text-sm text-light-safe opacity-80">
          O melhor marketplace para conteúdo de Minecraft. Encontre skins, mapas, mods e muito mais!
        </p>
      </div>

      <!-- Empresa Section EXATA -->
      <div>
        <h4 class="font-semibold text-lg mb-4 text-primary">Empresa</h4>
        <ul class="space-y-2">
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Sobre Nós</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contato</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Carreiras</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Blogue</span></li>
        </ul>
      </div>

      <!-- Legal Section EXATA -->
      <div>
        <h4 class="font-semibold text-lg mb-4 text-primary">Legal</h4>
        <ul class="space-y-2">
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Política de Privacidade</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Termos de Serviço</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Termos de Venda</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Licenças</span></li>
        </ul>
      </div>

      <!-- Suporte Section EXATA -->
      <div>
        <h4 class="font-semibold text-lg mb-4 text-primary">Suporte</h4>
        <ul class="space-y-2">
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Central de Ajuda</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Perguntas Frequentes</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contato Suporte</span></li>
          <li><span class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Status do Sistema</span></li>
        </ul>
      </div>

      <!-- Redes Sociais EXATA -->
      <div>
        <h4 class="font-semibold text-lg mb-4 text-primary">Redes Sociais</h4>
        <ul class="space-y-2">
          <li><a class="text-muted-foreground hover:text-foreground transition-colors flex items-center">
            <svg class="mr-2 h-4 w-4"><!-- MessageCircle --></svg>Discord
          </a></li>
          <li><a class="text-muted-foreground hover:text-foreground transition-colors flex items-center">
            <svg class="mr-2 h-4 w-4"><!-- Twitter --></svg>Gorjeto
          </a></li>
          <li><a class="text-muted-foreground hover:text-foreground transition-colors flex items-center">
            <svg class="mr-2 h-4 w-4"><!-- Youtube --></svg>YouTube
          </a></li>
          <li><a class="text-muted-foreground hover:text-foreground transition-colors flex items-center">
            <svg class="mr-2 h-4 w-4"><!-- Linkedin --></svg>Linkedin
          </a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section EXATA -->
    <div class="border-t border-gray-600 pt-8 mt-8">
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <p class="text-xs text-light-safe opacity-70">
          © 2024 MineCart Store. Todos os direitos reservados.
        </p>
        <p class="text-xs text-light-safe opacity-70 mt-2 sm:mt-0">
          Feito com <span class="text-accent-yellow">❤️</span> para a comunidade Minecraft
        </p>
      </div>
    </div>
  </div>
</footer>
```

### **PRODUCT DETAIL PAGE EXATA**
```html
<!-- Product Detail Structure EXATA -->
<div class="container mx-auto px-4 py-6">
  <!-- Breadcrumb -->
  <nav class="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
    <a href="/" class="hover:text-foreground">Catálogo</a>
    <span>/</span>
    <span class="text-foreground">[Nome do Produto]</span>
  </nav>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Column: Images & 3D Viewer -->
    <div class="space-y-4">
      <!-- Main Image -->
      <div class="aspect-square bg-muted rounded-lg overflow-hidden">
        <img src="product-image.jpg" alt="Product" class="w-full h-full object-cover" />
      </div>
      
      <!-- Image Thumbnails -->
      <div class="grid grid-cols-4 gap-2">
        <div class="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
          <img src="thumb1.jpg" class="w-full h-full object-cover" />
        </div>
        <!-- More thumbnails... -->
      </div>

      <!-- 3D Viewer -->
      <div class="bg-muted rounded-lg p-4">
        <h3 class="font-semibold mb-2">Visualizador 3D</h3>
        <div class="aspect-video bg-black rounded-lg">
          [ThreeViewer Component]
        </div>
      </div>
    </div>

    <!-- Right Column: Product Info -->
    <div class="space-y-6">
      <!-- Product Header -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-3xl font-bold">[Nome do Produto]</h1>
          <button class="text-red-500 hover:scale-110">
            <svg class="h-6 w-6"><!-- Heart --></svg>
          </button>
        </div>
        <p class="text-muted-foreground text-lg">[Categoria]</p>
      </div>

      <!-- Creator Info -->
      <div class="flex items-center space-x-3 p-3 bg-muted rounded-lg">
        <img class="h-10 w-10 rounded-full" src="creator.jpg" alt="Creator" />
        <div>
          <p class="font-medium">Por [Nome do Criador]</p>
          <p class="text-sm text-muted-foreground">Criador Verificado ✓</p>
        </div>
      </div>

      <!-- Rating & Stats -->
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-1">
          <div class="flex">
            <svg class="h-5 w-5 star-filled"><!-- Star --></svg>
            <svg class="h-5 w-5 star-filled"><!-- Star --></svg>
            <svg class="h-5 w-5 star-filled"><!-- Star --></svg>
            <svg class="h-5 w-5 star-filled"><!-- Star --></svg>
            <svg class="h-5 w-5 star-empty"><!-- Star --></svg>
          </div>
          <span>4.0 (25 avaliações)</span>
        </div>
        <div class="flex items-center space-x-1">
          <svg class="h-4 w-4"><!-- Download --></svg>
          <span>150 downloads</span>
        </div>
      </div>

      <!-- Technical Info -->
      <div class="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4"><!-- HardDrive --></svg>
          <span class="text-sm">Tamanho: 2.5 MB</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4"><!-- FileType --></svg>
          <span class="text-sm">Tipo: .mcpack</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4"><!-- Calendar --></svg>
          <span class="text-sm">Atualizado: [Data]</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4"><!-- Package --></svg>
          <span class="text-sm">Versão: 1.20+</span>
        </div>
      </div>

      <!-- Price & Purchase -->
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold text-primary-orange">R$ 12.79</span>
          <span class="text-lg text-muted-foreground line-through">R$ 15.99</span>
          <span class="bg-destructive text-white px-2 py-1 rounded text-sm">-20%</span>
        </div>
        
        <div class="flex space-x-3">
          <button class="flex-1 bg-primary-orange hover:bg-primary-alternative text-white">
            <svg class="mr-2 h-4 w-4"><!-- ShoppingCart --></svg>
            Adicionar ao Carrinho
          </button>
          <button class="bg-green-600 hover:bg-green-700 text-white px-6">
            Comprar Agora
          </button>
        </div>
      </div>

      <!-- YouTube Video -->
      <div class="space-y-2">
        <h3 class="font-semibold">Vídeo de Demonstração</h3>
        <div class="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe 
            src="https://www.youtube.com/embed/[VIDEO_ID]" 
            class="w-full h-full"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs Section -->
  <div class="mt-12">
    <div class="border-b">
      <nav class="flex space-x-8">
        <button class="border-b-2 border-primary py-2 px-1 text-primary font-medium">Descrição</button>
        <button class="py-2 px-1 text-muted-foreground hover:text-foreground">Especificações</button>
        <button class="py-2 px-1 text-muted-foreground hover:text-foreground">Avaliações</button>
        <button class="py-2 px-1 text-muted-foreground hover:text-foreground">Downloads</button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="py-6">
      <!-- Description Tab -->
      <div class="prose max-w-none">
        <p>[Descrição completa do produto...]</p>
      </div>

      <!-- Reviews Tab -->
      <div>
        [ReviewSystem Component]
      </div>
    </div>
  </div>
</div>

<!-- Checkout PIX Modal -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-background p-6 rounded-lg max-w-md w-full mx-4">
    [CheckoutPix Component]
  </div>
</div>
```

---

## 🚀 **FUNCIONALIDADES AVANÇADAS**

### **VISUALIZADOR 3D**
```javascript
// Three.js para visualizar modelos 3D
function initThreeViewer() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    // Configurar iluminação
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    // Carregar modelo
    const loader = new THREE.GLTFLoader();
    loader.load('/models/skin.glb', function(gltf) {
        scene.add(gltf.scene);
    });
    
    // Animação
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
```

### **SISTEMA DE NOTIFICAÇÕES**
```javascript
// Sistema de notificações push
function createNotificationSystem() {
    // Real-time notifications
    const notifications = [
        {
            type: 'purchase',
            message: 'Novo produto comprado!',
            icon: '🛒'
        },
        {
            type: 'review',
            message: 'Nova avaliação recebida!',
            icon: '⭐'
        },
        {
            type: 'product_approved',
            message: 'Produto aprovado!',
            icon: '✅'
        }
    ];
    
    // Mostrar notificação
    function showNotification(notif) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <span class="icon">${notif.icon}</span>
            <span class="message">${notif.message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}
```

### **ANALYTICS AVANÇADO**
```javascript
// Google Analytics 4 + Custom tracking
gtag('config', 'GA_MEASUREMENT_ID', {
    custom_map: {
        'custom_parameter_1': 'product_category',
        'custom_parameter_2': 'user_type'
    }
});

// Track purchases
function trackPurchase(productId, value, currency) {
    gtag('event', 'purchase', {
        transaction_id: generateTransactionId(),
        value: value,
        currency: currency,
        items: [{
            item_id: productId,
            item_name: getProductName(productId),
            category: getProductCategory(productId),
            quantity: 1,
            price: value
        }]
    });
}

// Track product views
function trackProductView(productId) {
    gtag('event', 'view_item', {
        currency: 'BRL',
        value: getProductPrice(productId),
        items: [{
            item_id: productId,
            item_name: getProductName(productId),
            category: getProductCategory(productId)
        }]
    });
}
```

---

## 📧 **EMAIL MARKETING COMPLETO**

### **TEMPLATES DE EMAIL**
```html
<!-- Template principal -->
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            background: #111827; 
            color: #F9FAFB; 
            font-family: 'Inter', sans-serif; 
            margin: 0; 
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #1F2937;
        }
        .header { 
            background: linear-gradient(45deg, #FF7A00, #F97316); 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 {
            font-family: 'Press Start 2P', monospace;
            color: white;
            margin: 0;
            font-size: 20px;
        }
        .content { 
            padding: 40px 30px; 
        }
        .button { 
            background: linear-gradient(45deg, #FF7A00, #F97316);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            display: inline-block; 
            margin: 20px 0;
            border-radius: 8px;
            font-weight: 600;
        }
        .footer {
            background: #111827;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #374151;
        }
        .social-links a {
            color: #FF7A00;
            text-decoration: none;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 MINECART STORE</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Premium Minecraft Content</p>
        </div>
        <div class="content">
            <h2 style="color: #FF7A00;">{{TITULO}}</h2>
            <p>{{CONTEUDO}}</p>
            <a href="{{LINK}}" class="button">{{BOTAO_TEXTO}}</a>
            <div style="margin-top: 30px; padding: 20px; background: #111827; border-radius: 8px;">
                <h3 style="color: #FFD166;">💡 Dicas de Instalação</h3>
                <ul style="color: #9CA3AF;">
                    <li>Sempre feche o Minecraft antes de instalar</li>
                    <li>Faça backup dos seus mundos</li>
                    <li>Verifique a compatibilidade da versão</li>
                    <li>Siga o tutorial passo a passo</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>🔗 Nos siga nas redes sociais:</p>
            <div class="social-links">
                <a href="#">YouTube</a> |
                <a href="#">Discord</a> |
                <a href="#">Instagram</a> |
                <a href="#">TikTok</a>
            </div>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">
                Sua Loja Store - Premium Minecraft Content<br>
                Não quer mais receber emails? <a href="#" style="color: #FF7A00;">Descadastre-se</a>
            </p>
        </div>
    </div>
</body>
</html>
```

### **SEQUÊNCIA DE EMAILS**
```
EMAIL 1 - IMEDIATO (Compra):
Assunto: 🎮 Seu download está pronto! [PRODUTO]
Conteúdo: Link de download + Tutorial

EMAIL 2 - +1 HORA (Tutorial):
Assunto: 📋 Como instalar seu [PRODUTO] - Passo a passo
Conteúdo: Guia detalhado de instalação

EMAIL 3 - +3 DIAS (Relacionados):
Assunto: ✨ Você pode gostar destes produtos
Conteúdo: 3-4 produtos relacionados

EMAIL 4 - +7 DIAS (Suporte):
Assunto: 💬 Precisando de ajuda com seu [PRODUTO]?
Conteúdo: Links para suporte + FAQ

EMAIL 5 - +14 DIAS (Feedback):
Assunto: ⭐ Como foi sua experiência?
Conteúdo: Request para review

EMAIL 6 - +30 DIAS (Desconto):
Assunto: 🎁 25% OFF especial para você!
Conteúdo: Cupom exclusivo
```

---

## 🔒 **SISTEMA DE SEGURANÇA COMPLETO**

### **PREVENÇÃO DE PIRATARIA**
```
🛡️ MEDIDAS ANTI-PIRATARIA:
- Watermark em PDFs com dados do comprador
- Links de download com expiração (24h)
- Limite de downloads por compra (3x)
- IP tracking para downloads
- Fingerprinting de arquivos
- DMCA takedown automation
- Report piracy system
```

### **PROTEÇÃO DE DADOS**
```
🔐 LGPD COMPLIANCE:
- Consentimento explícito coleta dados
- Opt-in para emails marketing
- Right to deletion (direito ao esquecimento)
- Data portability (exportar dados)
- Privacy by design
- DPO contact info
- Cookie consent banner
- Terms acceptance tracking
```

---

## 📱 **MOBILE OTIMIZADO**

### **RESPONSIVE CSS**
```css
/* Mobile first approach */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .btn-minecraft {
        font-size: 10px;
        padding: 10px 20px;
    }
    
    .header h1 {
        font-size: 16px;
    }
    
    .product-card {
        margin-bottom: 15px;
    }
    
    .three-viewer {
        height: 200px; /* Menor no mobile */
    }
    
    .chat-modal {
        bottom: 10px;
        right: 10px;
        left: 10px;
        width: auto;
    }
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
    
    .checkout-form {
        padding: 15px;
    }
    
    .pix-qr-code {
        max-width: 250px;
    }
}
```

---

## 💻 **DEPENDÊNCIAS E SETUP TÉCNICO COMPLETO**

### **COMANDOS TERMINAL OBRIGATÓRIOS**

#### **1. SETUP INICIAL NODE.JS**
```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

#### **2. CRIAR PROJETO DO ZERO**
```bash
# Criar diretório
mkdir sua-loja-minecraft
cd sua-loja-minecraft

# Inicializar projeto
npm init -y

# Git setup
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
```

#### **3. INSTALAR TODAS AS DEPENDÊNCIAS**
```bash
# FRONTEND DEPENDENCIES
npm install react@18 react-dom@18
npm install typescript @types/react @types/react-dom
npm install vite @vitejs/plugin-react
npm install tailwindcss postcss autoprefixer
npm install @tailwindcss/typography @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge
npm install tailwindcss-animate tw-animate-css

# UI COMPONENTS (Shadcn/ui)
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card
npm install @radix-ui/react-label
npm install @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider
npm install @radix-ui/react-slot
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip

# ROUTING E STATE
npm install wouter
npm install @tanstack/react-query

# FORMS E VALIDATION
npm install react-hook-form
npm install @hookform/resolvers
npm install zod zod-validation-error

# 3D VISUALIZATION
npm install @react-three/fiber @react-three/drei
npm install three @types/three

# ICONS E MEDIA
npm install lucide-react
npm install react-icons
npm install sharp

# CAROUSEL E UI EXTRAS
npm install embla-carousel-react
npm install react-resizable-panels
npm install react-day-picker
npm install input-otp
npm install cmdk
npm install vaul
npm install next-themes

# CHARTS E ANALYTICS
npm install recharts

# PAYMENTS (PIX/Mercado Pago)
npm install mercadopago
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install stripe

# BACKEND DEPENDENCIES
npm install express @types/express
npm install @types/node
npm install tsx esbuild
npm install @replit/vite-plugin-cartographer
npm install @replit/vite-plugin-runtime-error-modal

# DATABASE
npm install drizzle-orm drizzle-kit drizzle-zod
npm install @neondatabase/serverless

# AUTHENTICATION
npm install firebase

# FILE UPLOAD
npm install multer @types/multer

# SESSION MANAGEMENT
npm install express-session @types/express-session
npm install connect-pg-simple @types/connect-pg-simple
npm install memorystore
npm install passport passport-local @types/passport @types/passport-local

# WEBSOCKETS
npm install ws @types/ws

# DATE MANIPULATION
npm install date-fns

# ANIMATIONS
npm install framer-motion

# DEVELOPMENT TOOLS
npm install --save-dev @types/express
npm install --save-dev @types/multer
npm install --save-dev @types/connect-pg-simple
npm install --save-dev @types/express-session
npm install --save-dev @types/passport
npm install --save-dev @types/passport-local
npm install --save-dev @types/ws
npm install --save-dev typescript
```

#### **4. CONFIGURAR TAILWIND CSS**
```bash
# Gerar configs
npx tailwindcss init -p

# Editar tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
EOF
```

#### **5. ESTRUTURA DE PASTAS**
```bash
# Criar estrutura
mkdir -p src/{components,pages,hooks,lib,types}
mkdir -p src/components/ui
mkdir -p public/images
mkdir -p server
mkdir -p shared

# Estrutura final:
# ├── src/
# │   ├── components/
# │   │   ├── ui/
# │   │   ├── Header.tsx
# │   │   ├── Footer.tsx
# │   │   └── ProductCard.tsx
# │   ├── pages/
# │   │   ├── Home.tsx
# │   │   ├── ProductDetail.tsx
# │   │   └── Auth.tsx
# │   ├── hooks/
# │   │   ├── useAuth.ts
# │   │   ├── useCart.ts
# │   │   └── useFavorites.ts
# │   ├── lib/
# │   │   ├── firebase.ts
# │   │   ├── queryClient.ts
# │   │   └── utils.ts
# │   └── types/
# ├── server/
# │   ├── index.ts
# │   ├── routes.ts
# │   └── storage.ts
# ├── shared/
# │   └── schema.ts
# └── public/
```

#### **6. CONFIGURAR BANCO DE DADOS**
```bash
# Instalar PostgreSQL local (desenvolvimento)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco
sudo -u postgres createdb minecart_dev

# Configurar .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/minecart_dev"
FIREBASE_API_KEY="sua_api_key"
FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
FIREBASE_PROJECT_ID="seu_projeto_id"
FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="1:123456789:web:abcdefghijk"
MERCADOPAGO_ACCESS_TOKEN="sua_mercadopago_key"
PORT=5000
NODE_ENV=development
EOF
```

#### **7. SCRIPTS PACKAGE.JSON**
```bash
# Editar package.json
cat > package.json << 'EOF'
{
  "name": "sua-loja-minecraft",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "start": "NODE_ENV=production node dist/server/index.js"
  }
}
EOF
```

#### **8. CONFIGURAR VITE**
```bash
# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./attached_assets")
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
EOF
```

#### **9. CONFIGURAR DRIZZLE ORM**
```bash
# drizzle.config.ts
cat > drizzle.config.ts << 'EOF'
import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
EOF
```

#### **10. EXECUTAR PROJETO**
```bash
# Instalar dependências
npm install

# Gerar schema do banco
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Iniciar desenvolvimento
npm run dev

# Projeto rodará em http://localhost:5000
```

#### **11. DEPLOY CONFIGURAÇÃO**
```bash
# Para produção
npm run build

# Para deploy no Vercel
npm install -g vercel
vercel

# Para deploy no Netlify
npm install -g netlify-cli
netlify deploy --prod

# Para deploy no Railway
npm install -g @railway/cli
railway login
railway deploy
```

#### **12. FIREBASE SETUP**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init

# Configurar Storage rules
# Configurar Authentication
# Configurar Hosting (opcional)
```

#### **13. VARIÁVEIS DE AMBIENTE COMPLETAS**
```bash
# .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Firebase
FIREBASE_API_KEY=""
FIREBASE_AUTH_DOMAIN=""
FIREBASE_PROJECT_ID=""
FIREBASE_STORAGE_BUCKET=""
FIREBASE_MESSAGING_SENDER_ID=""
FIREBASE_APP_ID=""

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_PUBLIC_KEY=""

# App Settings
PORT=5000
NODE_ENV=development
SESSION_SECRET="seu_session_secret_aqui"

# Optional APIs
GOOGLE_ANALYTICS_ID=""
FACEBOOK_PIXEL_ID=""
HOTJAR_ID=""
EOF
```

#### **14. DOCKER SETUP (OPCIONAL)**
```bash
# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
EOF

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/minecart
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: minecart
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Executar com Docker
docker-compose up -d
```

---

## 🚀 **CONFIGURAÇÃO PAYHIP STEP-BY-STEP**

### **1. CONFIGURAÇÃO INICIAL**
```
CONTA PAYHIP:
1. Criar conta gratuita
2. Verificar email
3. Configure profile básico
4. Ativar métodos pagamento (PIX)

DOMÍNIO:
1. Comprar: seudominio.com.br (escolha o nome)
2. Configurar DNS no Payhip
3. SSL automático ativado
4. Redirect www para non-www
```

### **2. DESIGN E TEMA**
```
STORE BUILDER:
1. Escolher tema "Blank" para customização total
2. Upload logo MineCart
3. Aplicar CSS personalizado (código acima)
4. Configurar cores exatas
5. Setup navigation menu
6. Configure footer links

PÁGINAS CUSTOMIZADAS:
- About Us (nossa história)
- Contact (formulário + info)
- FAQ (perguntas frequentes)
- Terms & Privacy (políticas legais)
- Tutorials (como instalar produtos)
```

### **3. PRODUTOS E CATEGORIAS**
```
CRIAR CATEGORIAS:
1. Skins (Player Skins)
2. Worlds (Maps & Worlds)
3. Add-ons (Behavior Modifications)
4. Textures (Resource Packs)
5. Builds (Structures)
6. Premium Packs (Bundles)

UPLOAD PRODUTOS:
1. 10 produtos iniciais (2 por categoria)
2. Imagens HD (pelo menos 3 por produto)
3. Descrições detalhadas (template acima)
4. Preços estratégicos
5. Tags e keywords
6. YouTube videos quando possível
```

### **4. PAGAMENTOS E CUPONS**
```
MÉTODOS PAGAMENTO:
- PIX (Mercado Pago)
- Cartão Crédito/Débito
- PayPal
- Boleto Bancário

SISTEMA CUPONS:
- BEMVINDO15 (15% primeira compra)
- MINECRAFT10 (10% geral)
- PREMIUM25 (25% packs premium)
- FIDELIDADE30 (30% clientes VIP)
```

### **5. EMAIL MARKETING**
```
INTEGRAÇÃO:
1. Conectar Mailchimp/Klaviyo
2. Segmentar listas (buyers/browsers)
3. Setup welcome series
4. Configure abandoned cart emails
5. Post-purchase follow-up sequence

AUTOMAÇÕES:
- Welcome new subscribers
- Abandoned cart recovery
- Post-purchase tutorial
- Review request
- Win-back campaigns
```

### **6. ANALYTICS E TRACKING**
```
FERRAMENTAS:
1. Google Analytics 4
2. Facebook Pixel
3. Google Tag Manager
4. Hotjar (heatmaps)
5. Microsoft Clarity

EVENTS TRACKING:
- Page views
- Product views
- Add to cart
- Checkout initiated
- Purchase completed
- Newsletter signup
```

---

## 🎯 **ESTRATÉGIA DE LANÇAMENTO**

### **FASE 1 - PRÉ-LANÇAMENTO (Semana 1)**
```
PREPARAÇÃO:
✅ Site configurado 100%
✅ 20 produtos premium adicionados
✅ Emails templates prontos
✅ Analytics instalado
✅ Redes sociais criadas
✅ Influencers contactados
```

### **FASE 2 - SOFT LAUNCH (Semana 2)**
```
LANÇAMENTO LIMITADO:
🎯 100 primeiros usuários
💰 Cupom LAUNCH50 (50% OFF)
📱 Teste mobile/desktop
🐛 Bug fixes em tempo real
📊 Analytics monitoring
```

### **FASE 3 - HARD LAUNCH (Semana 3-4)**
```
LANÇAMENTO PÚBLICO:
📢 Anúncio oficial redes sociais
🎮 Parceria com YouTubers Minecraft
💰 Cupons escalonados
📈 SEO optimization
🚀 Paid ads (Google/Facebook)
```

---

## 🏆 **CHECKLIST FINAL COMPLETO**

### **TECNOLOGIA**
- [ ] Tema escuro configurado
- [ ] CSS Minecraft aplicado
- [ ] Fonts personalizadas instaladas
- [ ] Responsive mobile testado
- [ ] 3D viewer funcionando
- [ ] Chat sistema ativo
- [ ] Notifications working

### **CONTEÚDO**
- [ ] 50+ produtos adicionados
- [ ] Categorias organizadas
- [ ] Imagens HD todas produtos
- [ ] Descrições padronizadas
- [ ] YouTube videos embedded
- [ ] SEO otimizado
- [ ] Blog posts escritos

### **VENDAS**
- [ ] Preços estratégicos definidos
- [ ] Sistema cupons ativo
- [ ] Cross-selling configurado
- [ ] Email sequences prontas
- [ ] Abandoned cart recovery
- [ ] Reviews system active

### **MARKETING**
- [ ] Google Analytics instalado
- [ ] Facebook Pixel ativo
- [ ] Email marketing integrado
- [ ] Redes sociais linkadas
- [ ] Influencers contactados
- [ ] Paid ads campaigns prontas

### **LEGAL**
- [ ] Terms of Service completos
- [ ] Privacy Policy LGPD compliant
- [ ] Cookie consent banner
- [ ] DMCA takedown process
- [ ] Refund policy clara
- [ ] Support system ativo

### **OPERACIONAL**
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Backup system
- [ ] Error monitoring
- [ ] Performance optimization
- [ ] Security measures

---

## 🎮 **RESULTADO FINAL**

**Seu Payhip ficará IDÊNTICO ao MineCart Store com:**

✅ **Design Minecraft profissional**
✅ **Sistema completo de produtos**
✅ **Checkout PIX otimizado**
✅ **Email marketing automático**
✅ **Mobile responsivo perfeito**
✅ **Analytics avançado**
✅ **SEO otimizado**
✅ **Sistema de cupons**
✅ **Chat de suporte**
✅ **Reviews e ratings**
✅ **Segurança anti-pirataria**
✅ **Compliance LGPD**

**🚀 O resultado será um marketplace Minecraft profissional indistinguível do nosso MineCart Store original!**