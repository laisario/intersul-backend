import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { CopyMachinesModule } from '../src/modules/copy-machines/copy-machines.module';
import { CopyMachineCatalog } from '../src/modules/copy-machines/entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from '../src/modules/copy-machines/entities/client-copy-machine.entity';
import { Franchise } from '../src/modules/copy-machines/entities/franchise.entity';
import { AuthModule } from '../src/modules/auth/auth.module';
import { User } from '../src/modules/auth/entities/user.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import { testDatabaseConfig, createTestJwtToken, testData } from './test-setup';

describe('Copy Machines E2E', () => {
  let app: INestApplication;
  let copyMachineRepository: Repository<CopyMachineCatalog>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [CopyMachineCatalog, ClientCopyMachine, Franchise, User],
        }),
        CopyMachinesModule,
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    
    await app.init();

    copyMachineRepository = moduleFixture.get<Repository<CopyMachineCatalog>>(
      getRepositoryToken(CopyMachineCatalog),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create test user and get auth token
    const testUser = userRepository.create({
      ...testData.user,
      role: UserRole.ADMIN,
    });
    await userRepository.save(testUser);
    authToken = createTestJwtToken(jwtService, testUser);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up copy machines before each test
    await copyMachineRepository.clear();
  });

  describe('POST /copy-machines/catalog', () => {
    it('should create a new copy machine catalog', async () => {
      const createDto = {
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        description: 'High-performance monochrome laser printer',
        features: ['Print', 'Copy', 'Scan', 'Network printing'],
        price: 1500.00,
        quantity: 5,
      };

      const response = await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        model: createDto.model,
        manufacturer: createDto.manufacturer,
        description: createDto.description,
        features: createDto.features,
        price: createDto.price.toString(),
        quantity: createDto.quantity,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();
    });

    it('should create a copy machine with minimal required fields', async () => {
      const createDto = {
        model: 'Canon imageCLASS LBP6230dn',
        manufacturer: 'Canon',
      };

      const response = await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        model: createDto.model,
        manufacturer: createDto.manufacturer,
      });
      expect(response.body.id).toBeDefined();
    });

    it('should fail with invalid data', async () => {
      const invalidDto = {
        model: '', // Empty model should fail
        manufacturer: 'HP',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should fail without authentication', async () => {
      const createDto = {
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .send(createDto)
        .expect(401);
    });
  });

  describe('GET /copy-machines/catalog', () => {
    beforeEach(async () => {
      // Create test data
      const machines = [
        {
          model: 'HP LaserJet Pro M404dn',
          manufacturer: 'HP',
          description: 'High-performance monochrome laser printer',
          features: ['Print', 'Copy', 'Scan'],
          price: 1500.00,
          quantity: 5,
        },
        {
          model: 'Canon imageCLASS LBP6230dn',
          manufacturer: 'Canon',
          description: 'Compact monochrome laser printer',
          features: ['Print', 'Network printing'],
          price: 800.00,
          quantity: 3,
        },
        {
          model: 'Xerox WorkCentre 6515',
          manufacturer: 'Xerox',
          description: 'Multifunctional color printer',
          features: ['Print', 'Copy', 'Scan', 'Fax'],
          price: 2300.00,
          quantity: 2,
        },
      ];

      for (const machine of machines) {
        const entity = copyMachineRepository.create(machine);
        await copyMachineRepository.save(entity);
      }
    });

    it('should get all copy machines', async () => {
      const response = await request(app.getHttpServer())
        .get('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('model');
      expect(response.body[0]).toHaveProperty('manufacturer');
    });

    it('should search copy machines by model', async () => {
      const response = await request(app.getHttpServer())
        .get('/copy-machines/catalog?search=HP')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].model).toContain('HP');
    });

    it('should search copy machines by manufacturer', async () => {
      const response = await request(app.getHttpServer())
        .get('/copy-machines/catalog?search=Canon')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].manufacturer).toBe('Canon');
    });

    it('should search copy machines by description', async () => {
      const response = await request(app.getHttpServer())
        .get('/copy-machines/catalog?search=color')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].description).toContain('color');
    });

    it('should return empty array for non-matching search', async () => {
      const response = await request(app.getHttpServer())
        .get('/copy-machines/catalog?search=nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/copy-machines/catalog')
        .expect(401);
    });
  });

  describe('GET /copy-machines/catalog/:id', () => {
    let machineId: number;

    beforeEach(async () => {
      const machine = copyMachineRepository.create({
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        description: 'High-performance monochrome laser printer',
        features: ['Print', 'Copy', 'Scan'],
        price: 1500.00,
        quantity: 5,
      });
      const saved = await copyMachineRepository.save(machine);
      machineId = saved.id;
    });

    it('should get a copy machine by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/copy-machines/catalog/${machineId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: machineId,
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        description: 'High-performance monochrome laser printer',
        features: ['Print', 'Copy', 'Scan'],
        price: '1500.00',
        quantity: 5,
      });
    });

    it('should return 404 for non-existent machine', async () => {
      await request(app.getHttpServer())
        .get('/copy-machines/catalog/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/copy-machines/catalog/${machineId}`)
        .expect(401);
    });
  });

  describe('PATCH /copy-machines/catalog/:id', () => {
    let machineId: number;

    beforeEach(async () => {
      const machine = copyMachineRepository.create({
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        description: 'High-performance monochrome laser printer',
        features: ['Print', 'Copy', 'Scan'],
        price: 1500.00,
        quantity: 5,
      });
      const saved = await copyMachineRepository.save(machine);
      machineId = saved.id;
    });

    it('should update a copy machine', async () => {
      const updateDto = {
        model: 'HP LaserJet Pro M404dn Updated',
        manufacturer: 'HP',
        description: 'Updated description',
        features: ['Print', 'Copy', 'Scan', 'Network printing'],
        price: 1800.00,
        quantity: 10,
      };

      const response = await request(app.getHttpServer())
        .patch(`/copy-machines/catalog/${machineId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: machineId,
        model: updateDto.model,
        manufacturer: updateDto.manufacturer,
        description: updateDto.description,
        features: updateDto.features,
        price: updateDto.price.toString(),
        quantity: updateDto.quantity,
      });
    });

    it('should update only provided fields', async () => {
      const updateDto = {
        model: 'Updated Model Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/copy-machines/catalog/${machineId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.model).toBe(updateDto.model);
      expect(response.body.manufacturer).toBe('HP'); // Should remain unchanged
    });

    it('should return 404 for non-existent machine', async () => {
      const updateDto = {
        model: 'Updated Model',
      };

      await request(app.getHttpServer())
        .patch('/copy-machines/catalog/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      const updateDto = {
        model: 'Updated Model',
      };

      await request(app.getHttpServer())
        .patch(`/copy-machines/catalog/${machineId}`)
        .send(updateDto)
        .expect(401);
    });
  });

  describe('DELETE /copy-machines/catalog/:id', () => {
    let machineId: number;

    beforeEach(async () => {
      const machine = copyMachineRepository.create({
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        description: 'High-performance monochrome laser printer',
        features: ['Print', 'Copy', 'Scan'],
        price: 1500.00,
        quantity: 5,
      });
      const saved = await copyMachineRepository.save(machine);
      machineId = saved.id;
    });

    it('should delete a copy machine', async () => {
      await request(app.getHttpServer())
        .delete(`/copy-machines/catalog/${machineId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify machine is deleted
      const machine = await copyMachineRepository.findOne({
        where: { id: machineId },
      });
      expect(machine).toBeNull();
    });

    it('should return 404 for non-existent machine', async () => {
      await request(app.getHttpServer())
        .delete('/copy-machines/catalog/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/copy-machines/catalog/${machineId}`)
        .expect(401);
    });
  });

  describe('Validation Tests', () => {
    it('should validate required fields', async () => {
      const invalidDto = {
        // Missing required model and manufacturer
        description: 'Test description',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should validate minimum length for model', async () => {
      const invalidDto = {
        model: 'A', // Too short
        manufacturer: 'HP',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should validate minimum length for manufacturer', async () => {
      const invalidDto = {
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'H', // Too short
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should validate price is a number', async () => {
      const invalidDto = {
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        price: 'not-a-number',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should validate quantity is a number', async () => {
      const invalidDto = {
        model: 'HP LaserJet Pro M404dn',
        manufacturer: 'HP',
        quantity: 'not-a-number',
      };

      await request(app.getHttpServer())
        .post('/copy-machines/catalog')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);
    });
  });
});
