import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth';
import { AuthService } from '../services/auth';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: UserRole.ADMIN,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  } as User;

  const mockToken = 'mock-jwt-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            getProfile: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: mockToken,
        user: mockUser,
      });

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw error when login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return user when registration is successful', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: UserRole.TECHNICIAN,
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

      const result = await authController.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw error when registration fails', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'test@example.com', // Already exists
        password: 'password123',
        role: UserRole.TECHNICIAN,
      };

      jest.spyOn(authService, 'register').mockRejectedValue(new Error('User already exists'));

      await expect(authController.register(registerDto)).rejects.toThrow('User already exists');
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const request = { user: { sub: 1, email: 'test@example.com', role: UserRole.ADMIN } };

      jest.spyOn(authService, 'getProfile').mockResolvedValue(mockUser);

      const result = await authController.getProfile(request);

      expect(result).toEqual(mockUser);
      expect(authService.getProfile).toHaveBeenCalledWith(request.user.sub);
    });

    it('should throw error when user not found', async () => {
      const request = { user: { sub: 999, email: 'nonexistent@example.com', role: UserRole.ADMIN } };

      jest.spyOn(authService, 'getProfile').mockRejectedValue(new Error('User not found'));

      await expect(authController.getProfile(request)).rejects.toThrow('User not found');
      expect(authService.getProfile).toHaveBeenCalledWith(request.user.sub);
    });
  });
});
