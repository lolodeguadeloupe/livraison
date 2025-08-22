# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel-based food delivery platform with React frontend using Inertia.js. The application manages restaurants, drivers, customers, orders, payments, and delivery requests with role-based access control.

## Development Commands

### Backend (Laravel)
- **Start development server with all services**: `composer run dev` (runs PHP server, queue worker, logs, and Vite concurrently)
- **Manual server start**: `php artisan serve`
- **Queue worker**: `php artisan queue:listen --tries=1`
- **Logs monitoring**: `php artisan pail --timeout=0`
- **Run migrations**: `php artisan migrate`
- **Seed database**: `php artisan db:seed`
- **Create admin user**: `php artisan make:admin-user`
- **Code formatting**: `php artisan pint` (Laravel Pint)

### Frontend (React/Vite)
- **Development**: `npm run dev`
- **Build for production**: `npm run build`

### Testing
- **Run all tests**: `./vendor/bin/pest` or `php artisan test`
- **Run specific test**: `./vendor/bin/pest tests/Feature/YourTest.php`
- **Test with coverage**: `./vendor/bin/pest --coverage`

## Architecture & Key Components

### Role-Based System
The application uses a sophisticated role system with these main roles:
- **admin**: System administrators with full access
- **restaurant**: Restaurant owners/managers
- **driver**: Delivery drivers
- **customer**: Regular customers

User roles are managed through:
- `App\Models\Role` model with slug-based identification
- `App\Models\User` with helper methods: `hasRole()`, `isAdmin()`, `isRestaurant()`, `isDriver()`, `isCustomer()`
- Middleware: `RoleMiddleware` and `IsRestaurantAdmin`

### Core Models & Relationships
- **User**: Central model with relationships to Restaurant, Driver, Orders, Reviews
- **Restaurant**: Belongs to User, has many Orders and Reviews
- **Driver**: Belongs to User, handles delivery requests
- **Order**: Belongs to User and Restaurant, has Payment and Reviews
- **Payment**: Belongs to Order, tracks payment status
- **Review**: Belongs to User and Restaurant, with response capability
- **DeliveryRequest**: Links Orders to Drivers

### Route Structure
Routes are organized by role with appropriate middleware:
- `/admin/*`: Admin-only routes with `role:admin` middleware
- `/restaurant/*`: Restaurant owner routes with `role:restaurant` middleware  
- `/driver/*`: Driver routes with `role:driver` middleware
- Public routes for customer access to restaurants and orders

### Frontend Architecture
- **React + Inertia.js**: Server-side rendering with client-side navigation
- **Tailwind CSS**: Utility-first styling with @tailwindcss/forms
- **Headless UI**: Accessible React components
- **Component structure**: 
  - `resources/js/Components/`: Reusable UI components
  - `resources/js/Layouts/`: Page layouts (AuthenticatedLayout, GuestLayout, MainLayout)
  - `resources/js/Pages/`: Page components organized by feature

### Key Features
- Multi-role dashboard system with role-specific views
- Restaurant management with admin oversight
- Order lifecycle management with status updates
- Payment processing and tracking
- Review system with restaurant responses
- Delivery request system connecting orders to drivers
- Geographic data support (latitude/longitude for users)

## Database & Migrations

The application uses Laravel migrations with a comprehensive schema including:
- Role-based user system with geographic coordinates
- Restaurant management with admin relationships
- Order workflow with payment integration
- Review system with response capability
- Delivery request management

Run `php artisan migrate:fresh --seed` to reset database with sample data.

## Testing Strategy

Uses Pest PHP testing framework with:
- Feature tests for HTTP endpoints and user flows
- Unit tests for model logic and helper methods
- Authentication and authorization testing
- Role middleware testing
- Controller testing for all major features

Test database is configured separately in `phpunit.xml` with SQLite for speed.