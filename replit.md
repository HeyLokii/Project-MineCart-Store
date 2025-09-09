# MineCart Store - Marketplace de Conteúdo Digital Minecraft

## Overview

MineCart Store is a premium marketplace for Minecraft content creators and players, featuring digital assets like skins, maps, mods, textures, and addons. The platform combines a modern e-commerce experience with specialized features for the Minecraft community, including 3D visualization, PIX payment integration, and a comprehensive admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build System**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Radix UI primitives with Shadcn/ui components for accessible, customizable interface
- **Styling**: Tailwind CSS with custom Minecraft-themed dark design system
- **3D Visualization**: React Three Fiber and Three.js for interactive 3D model viewing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with `/api` prefix for clear separation
- **Development Integration**: Vite proxy setup for unified development server

### Database Architecture
- **Database**: PostgreSQL hosted on Neon serverless platform
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Schema Design**: Comprehensive data model including:
  - Users (authentication, profiles, roles)
  - Products (categories, pricing, files, approval status)
  - Orders (transactions, downloads, payment tracking)
  - Reviews (ratings, comments, moderation)
  - Notifications (system alerts, user messages)
  - Settings (application configuration)
- **Migrations**: Managed through Drizzle Kit for version-controlled schema changes

### Authentication & Authorization
- **Primary Authentication**: Firebase Authentication with Google OAuth integration
- **Session Management**: Firebase tokens with automatic refresh handling
- **Role-Based Access**: Admin system with designated email-based permissions
- **Profile System**: Complete user registration flow with profile completion requirements

### Payment Integration
- **Payment Method**: PIX (Brazilian instant payment system)
- **Processing Flow**: Order creation, payment generation, status polling, automatic fulfillment
- **Order Management**: Complete transaction tracking and download delivery system

## External Dependencies

### Cloud Services
- **Firebase**: Authentication and session management
- **Neon Database**: PostgreSQL serverless hosting
- **Stripe**: Payment processing infrastructure (configured for PIX)

### UI and Component Libraries
- **Radix UI**: Accessible component primitives for dialogs, popovers, navigation
- **Shadcn/ui**: Pre-built component library with Tailwind integration
- **React Three Fiber**: 3D rendering and model visualization
- **TanStack Query**: Server state management and API caching

### Development Tools
- **Drizzle ORM**: Database schema management and migrations
- **Vite**: Build tooling and development server
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling framework

### File Processing
- **Multer**: File upload handling (configured for avatar uploads)
- **Image Processing**: Sharp or similar library for avatar optimization

### Brazilian Payment Integration
- **PIX Payment System**: Direct integration with Brazilian instant payment infrastructure
- **QR Code Generation**: For PIX payment codes
- **Payment Status Polling**: Real-time payment verification system