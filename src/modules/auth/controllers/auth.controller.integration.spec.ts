import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth';
import { AuthService } from '../services/auth';
import { UserService } from '../services/user';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { testDatabaseConfig } from '../../../test/test-setup';

describe('AuthController Integration', () => {
  let app: INestApplication;
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [User],
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: 'JWT_MODULE_OPTIONS',
          useValue: {
            secret: 'test-secret',
            signOptions: { expiresIn: '1h' },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    authController = moduleFixture.get<AuthController>(AuthController);
    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await userService.remove(1);
    await userService.remove(2);
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      // First create a user
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      await authController.register(registerDto);

      // Then login
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };''

      const result = await authController.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it('should fail with invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await expect(authController.login(loginDto)).rejects.toThrow();
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: UserRole.TECHNICIAN,
      };

      const result = await authController.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('New User');
      expect(result.email).toBe('newuser@example.com');
      expect(result.role).toBe(UserRole.TECHNICIAN);
      expect(result.active).toBe(true);
    });

    it('should fail with duplicate email', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      // Register first time
      await authController.register(registerDto);

      // Try to register again with same email
      await expect(authController.register(registerDto)).rejects.toThrow();
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile', async () => {
      // First register and login
      const registerDto: RegisterDto = {
        name: 'Profile User',
        email: 'profile@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
      };

      const user = await authController.register(registerDto);

      const request = { user: { sub: user.id, email: user.email, role: user.role } };
      const result = await authController.getProfile(request);

      expect(result.id).toBe(user.id);
      expect(result.email).toBe('profile@example.com');
      expect(result.name).toBe('Profile User');
    });

    it('should fail with non-existent user', async () => {
      const request = { user: { sub: 999, email: 'nonexistent@example.com', role: UserRole.ADMIN } };

      await expect(authController.getProfile(request)).rejects.toThrow();
    });
  });
});
