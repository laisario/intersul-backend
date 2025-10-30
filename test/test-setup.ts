import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Test database configuration
export const testDatabaseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'intersul_user',
  password: process.env.DB_PASSWORD || 'intersul_password',
  database: process.env.DB_DATABASE || 'intersul_test',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
};

// Create test application
export async function createTestApp(moduleMetadata: any): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule(moduleMetadata)
    .overrideModule(TypeOrmModule)
    .useModule(
      TypeOrmModule.forRoot({
        ...testDatabaseConfig,
        entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
      }),
    )
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  await app.init();
  return app;
}

// Create JWT token for testing
export function createTestJwtToken(jwtService: JwtService, user: any): string {
  return jwtService.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
}

// Mock repository factory
export function createMockRepository<T>(): Partial<Repository<T>> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      getCount: jest.fn(),
    }),
  };
}

// Test data factories
export const testData = {
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'ADMIN' as any,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  client: {
    id: 1,
    name: 'Test Client',
    email: 'client@example.com',
    phone: '+1234567890',
    address: '123 Test St',
    created_at: new Date(),
    updated_at: new Date(),
  },
  copyMachineCatalog: {
    id: 1,
    model: 'Test Model',
    manufacturer: 'Test Manufacturer',
    description: 'Test Description',
    features: ['feature1', 'feature2'],
    price: 1000.00,
    monthly_rent_price: 100.00,
    quantity: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  clientCopyMachine: {
    id: 1,
    serial_number: 'SN123456',
    client_id: 1,
    catalog_copy_machine_id: 1,
    external_model: 'External Model',
    external_manufacturer: 'External Manufacturer',
    external_description: 'External Description',
    acquisition_type: 'RENT',
    value: 1500.00,
    franchise_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  franchise: {
    id: 1,
    periodo: '12 months',
    folha: 'A4',
    colorida: false,
    quantidade: 1000,
    preco_unidade: 0.05,
    valor: 50.00,
    created_at: new Date(),
    updated_at: new Date(),
  },
  category: {
    id: 1,
    name: 'Test Category',
    description: 'Test Category Description',
    created_at: new Date(),
    updated_at: new Date(),
  },
  service: {
    id: 1,
    client_id: 1,
    category_id: 1,
    client_copy_machine_id: 1,
    description: 'Test Service',
    created_at: new Date(),
    updated_at: new Date(),
  },
  step: {
    id: 1,
    name: 'Test Step',
    description: 'Test Step Description',
    observation: 'Test Observation',
    responsable_client: 'Client Contact',
    datetime_start: new Date(),
    datetime_conclusion: null,
    datetime_expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'PENDING',
    responsable_id: 1,
    service_id: 1,
    category_id: 1,
    approval_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
};
