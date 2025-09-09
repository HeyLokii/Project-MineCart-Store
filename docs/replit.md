# MineCart Store - Replit Configuration

## Overview
MineCart Store is a premium marketplace for Minecraft content, built as a full-stack e-commerce web application. The platform enables creators to sell digital assets like skins, maps, mods, textures, and worlds to Minecraft players. It features a comprehensive admin dashboard, user authentication, 3D product visualization, shopping cart functionality, and a complete order management system.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with a custom Minecraft-themed dark design system
- **UI Components**: Radix UI primitives (20+ components) via Shadcn/ui for accessibility
- **Routing**: Wouter lightweight router for client-side navigation
- **State Management**: TanStack Query for server state and caching
- **3D Visualization**: Three.js integration for 3D model viewing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api` prefix
- **Development**: Integrated with Vite for unified development experience

### Database Design
- **Database**: PostgreSQL via Neon serverless hosting
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Schema**: Users (authentication, roles, profiles), Products (categories, pricing, files), Orders (transactions, downloads), Reviews (ratings, comments)
- **Migrations**: Managed via Drizzle Kit

### Authentication & Security
- **Primary Auth**: Firebase Authentication with Google OAuth
- **Admin System**: Role-based access control with designated admin emails
- **Session Management**: Firebase tokens with automatic refresh
- **File Security**: Upload validation and secure file serving

### Key Features & Components
- **Product Management**: CRUD operations with 3D model support, YouTube video embedding, and categorization
- **Shopping System**: Cart management, PIX payment integration, order tracking
- **Admin Dashboard**: Product approval, user management, analytics, support system
- **User Profiles**: Complete registration flow, profile customization, favorite products
- **3D Viewer**: Interactive model display using Three.js and React Three Fiber
- **Responsive Design**: Mobile-first approach with consistent dark theme

### Data Flow Architecture
- Frontend uses TanStack Query for API communication and caching
- Express API handles all business logic and database interactions
- Drizzle ORM provides type-safe database queries
- Firebase handles authentication state across the application
- File uploads processed through dedicated upload endpoints

## External Dependencies

### Core Services
- **Firebase**: Authentication service, Google OAuth provider, potential file storage
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit**: Development and deployment platform

### Payment Integration
- **PIX Payment System**: Brazilian instant payment method integration
- **Payment Status Polling**: Real-time payment verification system

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Build tool and development server
- **Drizzle Kit**: Database migration and schema management
- **TanStack Query**: Server state management and API caching

### UI/UX Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form management and validation
- **React Icons**: Icon library for UI elements
- **Three.js**: 3D graphics rendering for product visualization