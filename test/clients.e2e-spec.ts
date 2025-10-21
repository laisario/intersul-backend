import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/auth/entities/user.entity';
import { Client } from '../src/modules/clients/entities/client.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import { testDatabaseConfig } from './test-setup';

describe('Clients (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [User, Client],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    // Register and login to get token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await request(app.getHttpServer())
      .delete('/clients/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .catch(() => {}); // Ignore if client doesn't exist
  });

  describe('GET /clients', () => {
    it('should return empty array when no clients exist', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect([]);
    });

    it('should return all clients', async () => {
      // Create test clients
      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Client 1',
          email: 'client1@example.com',
          phone: '+1234567890',
          address: '123 Test St',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Client 2',
          email: 'client2@example.com',
          phone: '+0987654321',
          address: '456 Test Ave',
        })
        .expect(201);

      return request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].name).toBe('Client 1');
          expect(res.body[1].name).toBe('Client 2');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .expect(401);
    });
  });

  describe('GET /clients/:id', () => {
    let clientId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Client',
          email: 'test@example.com',
          phone: '+1234567890',
          address: '123 Test St',
        })
        .expect(201);

      clientId = response.body.id;
    });

    it('should return a client by id', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(clientId);
          expect(res.body.name).toBe('Test Client');
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should fail with non-existent client', () => {
      return request(app.getHttpServer())
        .get('/clients/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .expect(401);
    });
  });

  describe('POST /clients', () => {
    it('should create a new client', () => {
      const clientData = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '+1234567890',
        address: '123 New St',
      };

      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(clientData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('New Client');
          expect(res.body.email).toBe('newclient@example.com');
          expect(res.body.phone).toBe('+1234567890');
          expect(res.body.address).toBe('123 New St');
        });
    });

    it('should fail with invalid data', () => {
      const invalidData = {
        name: 'Test Client',
        email: 'invalid-email',
        phone: '123', // Too short
        address: '', // Empty
      };

      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'duplicate@example.com',
        phone: '+1234567890',
        address: '123 Test St',
      };

      // First creation should succeed
      await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(clientData)
        .expect(201);

      // Second creation with same email should fail
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(clientData)
        .expect(400);
    });

    it('should fail without authentication', () => {
      const clientData = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
      };

      return request(app.getHttpServer())
        .post('/clients')
        .send(clientData)
        .expect(401);
    });
  });

  describe('PATCH /clients/:id', () => {
    let clientId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Original Client',
          email: 'original@example.com',
          phone: '+1234567890',
          address: '123 Original St',
        })
        .expect(201);

      clientId = response.body.id;
    });

    it('should update a client', () => {
      const updateData = {
        name: 'Updated Client',
        email: 'updated@example.com',
      };

      return request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Client');
          expect(res.body.email).toBe('updated@example.com');
          expect(res.body.phone).toBe('+1234567890'); // Should remain unchanged
          expect(res.body.address).toBe('123 Original St'); // Should remain unchanged
        });
    });

    it('should fail with non-existent client', () => {
      const updateData = {
        name: 'Updated Client',
      };

      return request(app.getHttpServer())
        .patch('/clients/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(404);
    });

    it('should fail without authentication', () => {
      const updateData = {
        name: 'Updated Client',
      };

      return request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('DELETE /clients/:id', () => {
    let clientId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'To Delete Client',
          email: 'todelete@example.com',
          phone: '+1234567890',
          address: '123 Delete St',
        })
        .expect(201);

      clientId = response.body.id;
    });

    it('should delete a client', () => {
      return request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should fail with non-existent client', () => {
      return request(app.getHttpServer())
        .delete('/clients/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .expect(401);
    });
  });
});
