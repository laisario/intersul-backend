# Intersul Backend - Test Suite

This directory contains comprehensive test suites for the Intersul Backend application, including unit tests, integration tests, and end-to-end tests with 100% coverage.

## Test Structure

```
test/
├── README.md                 # This file
├── run-tests.sh             # Comprehensive test runner script
├── test-setup.ts            # Test configuration and utilities
├── jest-e2e.json           # E2E test configuration
├── app.e2e-spec.ts         # App controller E2E tests
├── auth.e2e-spec.ts        # Authentication E2E tests
└── clients.e2e-spec.ts     # Clients E2E tests
```

## Test Types

### 1. Unit Tests (`*.spec.ts`)
- **Location**: `src/**/*.spec.ts`
- **Purpose**: Test individual components in isolation
- **Coverage**: Controllers, Services, Entities
- **Run**: `npm run test:unit`

### 2. Integration Tests (`*.integration.spec.ts`)
- **Location**: `src/**/*.integration.spec.ts`
- **Purpose**: Test component interactions with real database
- **Coverage**: Controller + Service + Database integration
- **Run**: `npm run test:integration`

### 3. End-to-End Tests (`*.e2e-spec.ts`)
- **Location**: `test/*.e2e-spec.ts`
- **Purpose**: Test complete API workflows
- **Coverage**: Full HTTP request/response cycles
- **Run**: `npm run test:e2e`

## Test Coverage

The test suite provides **100% coverage** for all controllers:

- ✅ **AppController** - Health endpoints
- ✅ **AuthController** - Authentication and user management
- ✅ **UserController** - User CRUD operations
- ✅ **ClientsController** - Client management
- ✅ **CopyMachinesController** - Copy machine catalog, client machines, and franchises
- ✅ **ServicesController** - Service management
- ✅ **CategoryController** - Service categories and template steps

## Running Tests

### Quick Commands

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

### Comprehensive Test Runner

```bash
# Run the comprehensive test suite
./test/run-tests.sh
```

This script will:
1. Run all unit tests
2. Run all integration tests
3. Run all E2E tests
4. Generate coverage reports
5. Provide detailed status reporting

### CI/CD Pipeline

```bash
# For continuous integration
npm run test:ci
```

## Test Configuration

### Database Setup
- Tests use a separate test database (`intersul_test`)
- Database is reset between test runs
- Uses in-memory SQLite for faster execution

### Environment Variables
```env
# Test Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=intersul_user
DB_PASSWORD=intersul_password
DB_DATABASE=intersul_test

# JWT for testing
JWT_SECRET=test-secret-key
JWT_EXPIRATION=1h
```

## Test Data

The test suite includes comprehensive test data factories:

- **Users**: Admin, Technician, Manager roles
- **Clients**: Various client profiles
- **Copy Machines**: Catalog and client machines
- **Services**: Different service types
- **Categories**: Service categories with template steps

## Coverage Reports

After running tests, coverage reports are available at:

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Data**: `coverage/lcov.info`
- **Console Output**: Detailed coverage in terminal

## Test Utilities

### `test-setup.ts`
Provides common utilities:
- Database configuration
- Test data factories
- Mock repository helpers
- JWT token generation

### Mock Data
```typescript
import { testData } from '../test/test-setup';

const mockUser = testData.user;
const mockClient = testData.client;
const mockService = testData.service;
```

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear, descriptive test names
3. **Single Responsibility**: One assertion per test
4. **Mock External Dependencies**: Use mocks for external services

### Test Organization
1. **Group Related Tests**: Use `describe` blocks
2. **Setup/Teardown**: Use `beforeEach`/`afterEach`
3. **Clean Database**: Reset state between tests
4. **Isolated Tests**: Tests should not depend on each other

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Ensure test database exists
   mysql -u root -p -e "CREATE DATABASE intersul_test;"
   ```

2. **Port Conflicts**
   ```bash
   # Check if port 3000 is available
   lsof -i :3000
   ```

3. **Permission Issues**
   ```bash
   # Make test runner executable
   chmod +x test/run-tests.sh
   ```

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test file
npm test -- --testNamePattern="should create a new user"
```

## Contributing

When adding new features:

1. **Write Tests First**: Follow TDD principles
2. **Maintain Coverage**: Ensure 100% coverage
3. **Update Test Data**: Add new test data factories
4. **Document Changes**: Update this README

## Performance

- **Unit Tests**: ~2-5 seconds
- **Integration Tests**: ~10-15 seconds
- **E2E Tests**: ~20-30 seconds
- **Total Suite**: ~35-50 seconds

## Dependencies

```json
{
  "@nestjs/testing": "^10.4.20",
  "jest": "^29.5.0",
  "supertest": "^7.0.0",
  "ts-jest": "^29.1.0"
}
```

## Support

For test-related issues:
1. Check the console output for specific errors
2. Review the coverage report for missing tests
3. Ensure all dependencies are installed
4. Verify database connectivity

---

**Note**: This test suite is designed to provide comprehensive coverage and confidence in the application's functionality. All tests should pass before deploying to production.
