# MineCart Store

## Overview

MineCart Store is a premium marketplace for Minecraft content creators and players, featuring digital assets like skins, maps, mods, textures, and addons. The platform combines a modern e-commerce experience with Minecraft-specific features including 3D model visualization, creator tools, and integrated payment processing.

## Features

- 🎮 **Digital Marketplace**: Buy and sell Minecraft content
- 🎨 **3D Model Viewer**: Interactive preview of 3D assets
- 👤 **User Profiles**: Complete user management system
- 🛒 **Shopping Cart**: Persistent cart with local storage
- 💳 **Payment Integration**: PIX payment system for Brazilian users
- 📱 **Responsive Design**: Mobile-first approach
- 🎯 **Admin Dashboard**: Comprehensive management tools
- 🔔 **Notification System**: Real-time user alerts

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Components**: Radix UI + Shadcn/ui
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Firebase Auth
- **Payment**: Stripe + PIX

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Firebase project
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd minecart-store
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Setup database:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Other Platforms

The project is configured to work on any Node.js hosting platform. Build the project with:
```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build
- `npm run check` - Type check
- `npm run lint` - Lint code
- `npm run db:push` - Push database schema

## Project Structure

```
├── src/
│   ├── server/          # Backend API
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── assets/             # Project assets
├── uploads/            # File uploads
├── docs/               # Documentation
└── dist/               # Build output
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License