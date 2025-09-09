
# 📦 DEPENDÊNCIAS NPM MAPEADAS - MINECART STORE

## 🎯 RESUMO EXECUTIVO
- **Total de Dependências:** 87 pacotes NPM
- **Dependências de Produção:** 52 pacotes
- **Dependências de Desenvolvimento:** 21 pacotes
- **Dependências Opcionais:** 1 pacote
- **Tamanho Estimado:** ~500MB (node_modules)

---

## 🚀 DEPENDÊNCIAS DE PRODUÇÃO (52 pacotes)

### **REACT ECOSYSTEM (5 pacotes)**
```json
{
  "react": "^18.3.1",                    // Core React library
  "react-dom": "^18.3.1",               // React DOM renderer
  "react-hook-form": "^7.55.0",         // Forms com validação
  "react-icons": "^5.4.0",              // Biblioteca de ícones
  "react-resizable-panels": "^2.1.7"    // Painéis redimensionáveis
}
```

### **ROUTING & NAVIGATION (1 pacote)**
```json
{
  "wouter": "^3.3.5"                    // Router lightweight (3KB)
}
```

### **UI COMPONENTS - RADIX UI (20 pacotes)**
```json
{
  "@radix-ui/react-accordion": "^1.2.4",
  "@radix-ui/react-alert-dialog": "^1.1.7",
  "@radix-ui/react-aspect-ratio": "^1.1.3",
  "@radix-ui/react-avatar": "^1.1.4",
  "@radix-ui/react-checkbox": "^1.1.5",
  "@radix-ui/react-collapsible": "^1.1.4",
  "@radix-ui/react-context-menu": "^2.2.7",
  "@radix-ui/react-dialog": "^1.1.7",
  "@radix-ui/react-dropdown-menu": "^2.1.7",
  "@radix-ui/react-hover-card": "^1.1.7",
  "@radix-ui/react-label": "^2.1.3",
  "@radix-ui/react-menubar": "^1.1.7",
  "@radix-ui/react-navigation-menu": "^1.2.6",
  "@radix-ui/react-popover": "^1.1.7",
  "@radix-ui/react-progress": "^1.1.3",
  "@radix-ui/react-radio-group": "^1.2.4",
  "@radix-ui/react-scroll-area": "^1.2.4",
  "@radix-ui/react-select": "^2.1.7",
  "@radix-ui/react-separator": "^1.1.3",
  "@radix-ui/react-slider": "^1.2.4",
  "@radix-ui/react-slot": "^1.2.0",
  "@radix-ui/react-switch": "^1.1.4",
  "@radix-ui/react-tabs": "^1.1.4",
  "@radix-ui/react-toast": "^1.2.7",
  "@radix-ui/react-toggle": "^1.1.3",
  "@radix-ui/react-toggle-group": "^1.1.3",
  "@radix-ui/react-tooltip": "^1.2.0"
}
```

### **STYLING & CSS (7 pacotes)**
```json
{
  "class-variance-authority": "^0.7.1",  // Variantes de CSS
  "clsx": "^2.1.1",                     // Conditional classes
  "tailwind-merge": "^2.6.0",          // Merge Tailwind classes
  "tailwindcss-animate": "^1.0.7",     // Animações Tailwind
  "tw-animate-css": "^1.2.5",          // Animações CSS extras
  "next-themes": "^0.4.6",             // Theme switching
  "cmdk": "^1.1.1"                     // Command palette
}
```

### **3D GRAPHICS & ANIMATIONS (4 pacotes)**
```json
{
  "@react-three/drei": "^9.93.0",      // Three.js helpers
  "@react-three/fiber": "^8.15.19",    // React Three.js renderer
  "three": "^0.158.0",                 // 3D graphics library
  "framer-motion": "^11.13.1"          // Animações React
}
```

### **BACKEND & DATABASE (6 pacotes)**
```json
{
  "express": "^4.21.2",                // Web framework
  "drizzle-orm": "^0.39.1",           // ORM TypeScript
  "@neondatabase/serverless": "^0.10.4", // Neon DB client
  "connect-pg-simple": "^10.0.0",      // PostgreSQL session store
  "express-session": "^1.18.1",        // Session middleware
  "memorystore": "^1.6.7"             // Memory session store
}
```

### **AUTHENTICATION & SECURITY (3 pacotes)**
```json
{
  "firebase": "^9.23.0",              // Firebase SDK
  "passport": "^0.7.0",               // Authentication middleware
  "passport-local": "^1.0.0"          // Local auth strategy
}
```

### **PAYMENTS (3 pacotes)**
```json
{
  "mercadopago": "^2.8.0",            // Mercado Pago API
  "@stripe/react-stripe-js": "^3.7.0", // Stripe React components
  "@stripe/stripe-js": "^7.5.0",      // Stripe JavaScript SDK
  "stripe": "^18.3.0"                 // Stripe Node.js SDK
}
```

### **FILE HANDLING & UPLOAD (3 pacotes)**
```json
{
  "multer": "^2.0.1",                 // File upload middleware
  "sharp": "^0.34.3",                 // Image processing
  "@types/multer": "^2.0.0"           // Multer types
}
```

### **STATE MANAGEMENT & QUERIES (2 pacotes)**
```json
{
  "@tanstack/react-query": "^5.60.5", // Server state management
  "@hookform/resolvers": "^3.10.0"    // Form validation resolvers
}
```

### **VALIDATION & SCHEMAS (3 pacotes)**
```json
{
  "zod": "^3.24.2",                   // Schema validation
  "drizzle-zod": "^0.7.0",           // Drizzle + Zod integration
  "zod-validation-error": "^3.4.0"    // Zod error formatting
}
```

### **UI EXTRAS (5 pacotes)**
```json
{
  "lucide-react": "^0.453.0",         // Ícones Lucide
  "react-day-picker": "^8.10.1",      // Date picker
  "input-otp": "^1.4.2",             // OTP input component
  "embla-carousel-react": "^8.6.0",   // Carousel component
  "vaul": "^1.1.2"                   // Drawer component
}
```

### **CHARTS & DATA VIZ (2 pacotes)**
```json
{
  "recharts": "^2.15.2",             // Charts library
  "date-fns": "^3.6.0"               // Date utilities
}
```

### **WEBSOCKETS & REAL-TIME (1 pacote)**
```json
{
  "ws": "^8.18.0"                    // WebSocket implementation
}
```

### **BUILD TOOLS & UTILITIES (1 pacote)**
```json
{
  "@jridgewell/trace-mapping": "^0.3.25" // Source map utilities
}
```

---

## 🛠️ DEPENDÊNCIAS DE DESENVOLVIMENTO (21 pacotes)

### **TYPESCRIPT & TYPES (7 pacotes)**
```json
{
  "typescript": "5.6.3",
  "@types/node": "20.16.11",
  "@types/react": "^18.3.11",
  "@types/react-dom": "^18.3.1",
  "@types/express": "4.17.21",
  "@types/express-session": "^1.18.0",
  "@types/passport": "^1.0.16",
  "@types/passport-local": "^1.0.38",
  "@types/connect-pg-simple": "^7.0.3",
  "@types/ws": "^8.5.13"
}
```

### **BUILD TOOLS & BUNDLING (4 pacotes)**
```json
{
  "vite": "^5.4.19",
  "@vitejs/plugin-react": "^4.3.2",
  "esbuild": "^0.25.0",
  "tsx": "^4.19.1"
}
```

### **CSS & STYLING (4 pacotes)**
```json
{
  "tailwindcss": "^3.4.17",
  "@tailwindcss/typography": "^0.5.15",
  "@tailwindcss/vite": "^4.1.3",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.47"
}
```

### **DATABASE TOOLS (1 pacote)**
```json
{
  "drizzle-kit": "^0.30.4"
}
```

### **REPLIT SPECIFIC (2 pacotes)**
```json
{
  "@replit/vite-plugin-cartographer": "^0.2.7",
  "@replit/vite-plugin-runtime-error-modal": "^0.0.3"
}
```

---

## 🔧 DEPENDÊNCIAS OPCIONAIS (1 pacote)

```json
{
  "bufferutil": "^4.0.8"             // WebSocket performance boost
}
```

---

## 📊 ANÁLISE POR CATEGORIA

### **TAMANHOS ESTIMADOS**
- **React Ecosystem:** ~15MB
- **Radix UI Components:** ~25MB
- **Styling Libraries:** ~30MB
- **3D Graphics (Three.js):** ~45MB
- **Backend Dependencies:** ~35MB
- **Database & ORM:** ~20MB
- **Development Tools:** ~150MB
- **TypeScript & Types:** ~80MB
- **Build Tools:** ~120MB

### **DEPENDÊNCIAS CRÍTICAS (Core)**
1. `react` + `react-dom` - Framework base
2. `express` - Servidor web
3. `drizzle-orm` - Database ORM
4. `firebase` - Authentication
5. `@tanstack/react-query` - State management
6. `zod` - Validation
7. `tailwindcss` - Styling
8. `typescript` - Type safety

### **DEPENDÊNCIAS DE PERFORMANCE**
- `wouter` (3KB) vs `react-router` (45KB)
- `clsx` (2KB) para classes condicionais
- `@tanstack/react-query` para cache inteligente
- `sharp` para processamento de imagem otimizado

### **DEPENDÊNCIAS DE SEGURANÇA**
- `zod` - Validação de schemas
- `firebase` - Authentication segura
- `express-session` - Sessões seguras
- `passport` - Estratégias de auth

---

## 🚨 COMANDOS DE INSTALAÇÃO

### **Instalar Todas de Uma Vez**
```bash
npm install react@18 react-dom@18 wouter@3 \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  express@4 drizzle-orm@0.39 firebase@9 \
  @tanstack/react-query@5 zod@3 \
  tailwindcss@3 typescript@5 vite@5
```

### **Por Categoria**
```bash
# UI Components
npm install @radix-ui/react-{accordion,alert-dialog,avatar,button,dialog}

# Styling
npm install tailwindcss class-variance-authority clsx tailwind-merge

# Backend
npm install express drizzle-orm @neondatabase/serverless

# Development
npm install -D typescript @types/react @types/node vite
```

---

## 📈 ROADMAP DE DEPENDÊNCIAS

### **PRÓXIMAS ADIÇÕES POSSÍVEIS**
- `@stripe/stripe-js` - Mais integrações de pagamento
- `react-pdf` - Geração de PDFs
- `nodemailer` - Envio de emails
- `rate-limiter-flexible` - Rate limiting
- `helmet` - Segurança headers
- `compression` - Compressão gzip

### **OTIMIZAÇÕES FUTURAS**
- Bundle splitting por rotas
- Tree shaking mais agressivo
- Code splitting por componentes
- Lazy loading de dependencies pesadas

---

**Total Mapeado:** 87 dependências NPM ✅
