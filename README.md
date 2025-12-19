# Household Management System

**Project IT3180**

A comprehensive backend system for managing household registration, resident information, contributions, and population events in a residential area. Built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Household Management**: Register and manage household information
- **Resident Tracking**: Complete person/resident information system with CSV import
- **Contribution Management**: Fee tracking with VNPay payment integration
- **Population Events**: Track demographic changes (births, deaths, migrations)
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **RESTful API**: Well-structured endpoints with validation

## Tech Stack

- **NestJS 11.x** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **TypeORM** - Database ORM
- **Passport & JWT** - Authentication
- **VNPay** - Payment gateway integration

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

The server will start at `http://localhost:3000` (or your configured port).

## Available Scripts

```bash
# Development
npm run start          # Start application
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debug mode

# Building
npm run build          # Build for production
npm run start:prod     # Run production build

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run e2e tests

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint and fix code

# Database
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
```

## Project Structure

```
src/
├── auth/              # Authentication & JWT
├── users/             # User management
├── household/         # Household management
├── person/            # Resident information
├── contribution/      # Fees & payments
├── population-event/  # Demographic events
├── roles/             # RBAC system
└── config/            # App configuration
```

## Documentation

For detailed documentation including:
- Complete database schema
- API endpoints
- Authentication flow
- Module descriptions
- Development guidelines

See **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
APP_PORT=3000
APP_NAME=Household Management System
APP_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=household_db

# Authentication
JWT_SECRET=your_jwt_secret

# VNPay Payment Gateway
VNP_TMN_CODE=your_code
VNP_HASH_SECRET=your_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/contribution/vnpay-return
TIME_LIMIT=15
```

## API Overview

### Authentication
- `POST /auth/login` - Login with credentials
- `GET /auth/info` - Get current user info

### Households
- `GET /household` - List all households
- `POST /household` - Create household
- `GET /household/:id` - Get household details
- `PATCH /household/:id` - Update household
- `DELETE /household/:id` - Delete household

### Persons
- `GET /person` - List persons (paginated)
- `POST /person` - Create person
- `POST /person/upload-csv` - Bulk import from CSV
- `GET /person/:id` - Get person details
- `PATCH /person/:id` - Update person
- `DELETE /person/:id` - Delete person

### Contributions
- `GET /contribution` - List contributions
- `POST /contribution` - Create contribution
- `PATCH /contribution/:id/mark-paid` - Mark as paid
- `POST /contribution/:id/payment-url` - Generate VNPay payment URL

### Population Events
- `GET /population-event` - List events
- `POST /population-event` - Create event
- `GET /population-event/:id` - Get event details
- `PATCH /population-event/:id` - Update event

## License

UNLICENSED - Private project for IT3180

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
