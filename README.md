# Intersul Backend - Service Management System

A NestJS backend application for managing copy machine services including maintenance, rentals, sales, and supplies.

## Features

- **Authentication**: JWT-based authentication for employees
- **Service Management**: Create and track different types of services (maintenance, rent, sell, supplies)
- **Step Tracking**: Automated workflow steps with employee assignment
- **Inventory Management**: Track supplies and copy machine inventory
- **Client Management**: Manage client information and relationships
- **Docker Support**: Full containerization with MySQL, Redis, and Celery

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Background Jobs**: Redis + Bull Queue
- **Validation**: Class-validator

## Quick Start with Docker

1. **Clone and setup environment**:
   ```bash
   git clone <repository-url>
   cd backend
   cp env.example .env
   # Edit .env with your preferred settings
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## Manual Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database**:
   - Install MySQL 8.0+
   - Create database `intersul`
   - Update `.env` with your database credentials

3. **Run the application**:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## Docker Commands

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Restart services
npm run docker:restart
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

### Clients
- `GET /clients` - List all clients
- `POST /clients` - Create new client
- `GET /clients/:id` - Get client by ID
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Copy Machines
- `GET /copy-machines` - List all copy machines
- `POST /copy-machines` - Create new copy machine
- `GET /copy-machines/:id` - Get copy machine by ID
- `PATCH /copy-machines/:id` - Update copy machine
- `DELETE /copy-machines/:id` - Delete copy machine

### Supplies
- `GET /supplies` - List all supplies
- `POST /supplies` - Create new supply
- `GET /supplies/:id` - Get supply by ID
- `PATCH /supplies/:id` - Update supply
- `PATCH /supplies/:id/stock` - Update stock quantity
- `DELETE /supplies/:id` - Delete supply

### Services (MVP - Maintenance Only)
- `POST /services/maintenance` - Create maintenance service
- `GET /services` - List all services (with filters)
- `GET /services/:id` - Get service by ID
- `DELETE /services/:id` - Delete service

### Service Steps
- `GET /steps/service/:serviceId` - Get steps for a service
- `GET /steps/:id` - Get step by ID
- `PATCH /steps/:id/status` - Update step status
- `PATCH /steps/:id/assign` - Assign employee to step
- `PATCH /steps/:id/notes` - Update step notes

## Service Types and Workflows

### Maintenance Services

**Internal Maintenance**:
1. On the Way
2. Maintenance
3. Completion/Testing

**External Maintenance**:
1. Technical Evaluation
2. Budget
3. Budget Approval
4. On the Way
5. Maintenance
6. Billing

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=intersul_user
DB_PASSWORD=intersul_password
DB_DATABASE=intersul
DB_ROOT_PASSWORD=rootpassword

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

# Application Configuration
NODE_ENV=development
PORT=3000

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Celery Configuration
CELERY_BROKER_URL=redis://redis:6379
CELERY_RESULT_BACKEND=redis://redis:6379
```

## Database Schema

The application uses the following main entities:

- **User**: Employee authentication and roles
- **Client**: Customer information
- **CopyMachine**: Copy machine inventory with features
- **Service**: Base service entity (polymorphic)
- **Maintenance**: Maintenance-specific service data
- **ServiceStep**: Workflow steps with status tracking
- **Supply**: Inventory items (toner, paper, parts, etc.)

## Development

### Project Structure
```
src/
├── modules/
│   ├── auth/           # Authentication module
│   ├── clients/        # Client management
│   ├── copy-machines/  # Copy machine inventory
│   ├── supplies/       # Supply inventory
│   └── services/       # Service management
├── common/             # Shared utilities
├── config/             # Configuration files
└── main.ts            # Application entry point
```

### Adding New Service Types

To add new service types (Rent, Sell, Supplies), follow the pattern established for Maintenance:

1. Create entity in `src/modules/services/[service-type]/entities/`
2. Create DTOs in `src/modules/services/[service-type]/dto/`
3. Create factory in `src/modules/services/factories/`
4. Update ServicesService and ServicesController
5. Define default workflow steps in the factory

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the UNLICENSED license.# intersul-backend
