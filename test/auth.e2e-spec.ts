import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/auth/entities/user.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import { testDatabaseConfig } from './test-setup';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [User],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await request(app.getHttpServer())
      .delete('/auth/users/1')
      .catch(() => {}); // Ignore if user doesn't exist
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test User');
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.role).toBe(UserRole.ADMIN);
          expect(res.body.active).toBe(true);
          expect(res.body).not.toHaveProperty('password');
          userId = res.body.id;
        });
    });

    it('should fail with invalid data', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        password: '123', // Too short
        role: 'INVALID_ROLE',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400);
    });

    it('should fail with duplicate email', async () => {
      const registerData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      // First registration should succeed
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Second registration with same email should fail
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a user first
      const registerData = {
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'password123',
        role: UserRole.TECHNICIAN,
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);
    });

    it('should login with valid credentials', () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('login@example.com');
          expect(res.body.user.name).toBe('Login Test User');
          expect(res.body.user.role).toBe(UserRole.TECHNICIAN);
          accessToken = res.body.access_token;
        });
    });

    it('should fail with invalid credentials', () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });

    it('should fail with non-existent user', () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('GET /auth/profile', () => {
    beforeEach(async () => {
      // Register and login to get token
      const registerData = {
        name: 'Profile Test User',
        email: 'profile@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'password123',
        })
        .expect(200);

      accessToken = loginResponse.body.access_token;
    });

    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe('profile@example.com');
          expect(res.body.name).toBe('Profile Test User');
          expect(res.body.role).toBe(UserRole.ADMIN);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
