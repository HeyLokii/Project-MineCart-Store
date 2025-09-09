# MineCart Store - Minecraft Marketplace

## Overview

MineCart Store is a premium marketplace for Minecraft content featuring user authentication, 3D product visualization, administrative dashboard, payment integrations, and mobile-first responsive design. The platform serves creators and players of Minecraft content including skins, maps, models, and addons with an integrated 3D viewer and commission system for content creators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with Vite as the build tool and bundler. The UI is constructed using shadcn/ui components with Radix UI primitives for accessibility and consistent design patterns. TailwindCSS provides utility-first styling with CSS variables for theming support.

**Component Structure:**
- Modular component architecture with reusable UI components
- Safe wrapper components (ProfileSafe, AdminDashboardSafe) to handle error boundaries
- Custom hooks for authentication, data fetching, and state management
- React Query for server state management and caching

**3D Visualization:**
The platform integrates React Three Fiber (@react-three/fiber) and React Three Drei (@react-three/drei) for rendering 3D models directly in the browser, providing users with interactive previews of Minecraft content.

### Backend Architecture
The backend is built on Express.js with TypeScript, following RESTful API design principles. The server handles authentication, file uploads, payment processing, and data operations.

**API Structure:**
- RESTful endpoints for CRUD operations
- File upload handling with Multer for avatar and product assets
- Authentication middleware integration
- Error handling and logging middleware

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL as the primary database solution. The Neon serverless database (@neondatabase/serverless) provides scalable PostgreSQL hosting.

**Database Design:**
- User management with profile completion tracking
- Product catalog with categories and metadata
- Shopping cart and favorites functionality
- Administrative settings and configuration storage
- File path storage for uploaded assets

### Authentication and Authorization
Firebase Authentication provides the authentication layer with Google OAuth integration and email-based authentication. The system implements profile completion workflows and role-based access control.

**Authentication Flow:**
- Firebase handles user registration and login
- Profile completion modal for new users
- User role management (admin, creator, customer)
- Session management with automatic token refresh

### Payment Integration
The platform integrates with Stripe for payment processing (@stripe/stripe-js, @stripe/react-stripe-js) and includes PIX payment support for Brazilian users.

**Payment Features:**
- Credit card processing through Stripe
- PIX instant payment support
- Payment status tracking and verification
- Automated order fulfillment

## External Dependencies

### Core Framework Dependencies
- **React 18+**: Frontend framework with hooks and functional components
- **TypeScript**: Type-safe development across frontend and backend
- **Vite**: Build tool and development server with HMR support
- **Express.js**: Backend web framework for API endpoints

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI patterns
- **TailwindCSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle Kit**: Database migration and introspection tools

### Authentication Services
- **Firebase Authentication**: User authentication and management
- **Google OAuth**: Social login integration

### Payment Services
- **Stripe**: Credit card and payment processing platform
- **PIX Integration**: Brazilian instant payment system

### 3D Graphics and Visualization
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Utilities and helpers for React Three Fiber
- **Three.js**: 3D graphics library for WebGL rendering

### Development and Build Tools
- **Replit Integration**: Development environment and deployment platform
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution environment for development

### State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Validation schema integration

### File Handling
- **Multer**: File upload middleware for Express.js
- **File System Operations**: Local file storage and management