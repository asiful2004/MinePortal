# SkyBlock Legends Minecraft Server Website

## Overview

SkyBlock Legends is a premium Minecraft server website built with a modern full-stack architecture. The project provides a comprehensive platform for managing and showcasing a SkyBlock Minecraft server, including news management, player voting systems, seasonal content, team information, store functionality, and an admin dashboard. The website features multilingual support, real-time server status monitoring, and a responsive gaming-themed design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing modern web technologies for an optimal user experience:

- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom gaming-themed design system and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Internationalization**: React i18next with support for 7 languages (English, Bengali, Hindi, Spanish, French, Russian, Turkish)
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a feature-based organization with dedicated pages for home, news, voting, seasons, about, store, and admin functionality. Custom hooks handle language switching, mobile detection, server status polling, and toast notifications.

### Backend Architecture
The server-side is built with Express.js and follows RESTful API patterns:

- **Framework**: Express.js with TypeScript for the web server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication for admin panel access
- **Password Security**: Bcrypt for password hashing and verification
- **Database Connection**: Neon serverless PostgreSQL with connection pooling
- **Development**: Hot reloading with Vite integration in development mode

The API provides endpoints for server status, news management, team information, voting sites, gallery images, store items, and seasonal content. An admin authentication system protects sensitive operations.

### Data Storage Solutions
The application uses a relational database approach with well-defined schemas:

- **Database**: PostgreSQL via Neon serverless platform
- **ORM**: Drizzle ORM with automatic migrations and type generation
- **Schema Design**: Comprehensive tables for users, server configuration, news articles, seasons, team members, voting sites, gallery images, and store items
- **Data Validation**: Zod schemas for runtime type checking and API validation
- **Relationships**: Proper foreign key relationships between entities (e.g., news articles to authors)

### Authentication and Authorization
Security is implemented through a JWT-based system:

- **Admin Authentication**: Username/password authentication for admin users
- **Password Security**: Bcrypt hashing with salt for secure password storage
- **JWT Tokens**: Secure token-based authentication for API endpoints
- **Protected Routes**: Middleware protection for admin-only operations
- **Role-based Access**: Support for different user roles (admin, moderator)

### External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting for scalable data storage
- **Radix UI**: Headless UI components for accessibility and consistency
- **TanStack Query**: Server state management with caching and synchronization
- **Drizzle ORM**: Type-safe database operations and migrations
- **React i18next**: Internationalization framework for multi-language support
- **Vite**: Modern build tool for development and production optimization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Wouter**: Minimalist routing library for React applications
- **Zod**: TypeScript-first schema validation library
- **Date-fns**: Modern date utility library for formatting and manipulation
- **Lucide React**: Icon library with consistent SVG icons

The application integrates with external Minecraft server listing sites through the voting system and displays real-time server status information. The architecture supports easy deployment to various hosting platforms with environment-based configuration.