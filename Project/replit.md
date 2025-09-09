# MineCart Store - Marketplace de Conteúdo Digital Minecraft

## Overview

MineCart Store is a premium marketplace for Minecraft content creators and players, featuring digital assets like skins, maps, mods, textures, and addons. The platform combines a modern e-commerce experience with Minecraft-specific features including 3D model visualization, creator tools, and integrated payment processing. Built as a full-stack TypeScript application, it provides both marketplace functionality for users and comprehensive administrative tools for content management.

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

### File Management
- **Upload System**: Multer-based file handling for product assets and user avatars
- **Storage Strategy**: Local file system with organized directory structure
- **File Validation**: Type checking, size limits, and security measures

### Key Features
- **Product Management**: Full CRUD operations with approval workflow, categorization, and 3D model support
- **3D Viewer**: Interactive model display using Three.js for immersive product previews
- **Shopping Cart**: Persistent cart management with local storage synchronization
- **Admin Dashboard**: Comprehensive management interface for products, users, orders, and system settings
- **Notification System**: Real-time alerts for users and administrators with read/unread tracking
- **Responsive Design**: Mobile-first approach with consistent dark theme across all devices

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, React Query
- **UI Components**: Radix UI primitives (20+ components), Shadcn/ui component library
- **Styling**: Tailwind CSS, Class Variance Authority, clsx for conditional styling
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei for 3D utilities

### Backend Dependencies
- **Server Framework**: Express.js for REST API
- **Database**: Drizzle ORM, @neondatabase/serverless for PostgreSQL connection
- **File Handling**: Multer for multipart form data processing
- **Authentication**: Firebase SDK for authentication services

### Payment & External Services
- **Payment Processing**: Stripe React components for payment UI (configured for PIX)
- **Cloud Services**: Neon Database for PostgreSQL hosting
- **Authentication Provider**: Firebase Authentication for user management

### Development Tools
- **Build Tools**: Vite, esbuild for fast compilation and bundling
- **TypeScript**: Full TypeScript setup with strict type checking
- **Code Quality**: ESLint, Prettier (implied from project structure)
- **Development Environment**: Replit-specific plugins for error handling and cartographer

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Form Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with custom hooks for API communication
- **Icons**: Lucide React for consistent iconography