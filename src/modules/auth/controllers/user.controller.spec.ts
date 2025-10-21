import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user';
import { UserService } from '../services/user';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

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

  const mockUsers: User[] = [mockUser];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue(mockUsers);

      const result = await userController.findAll();

      expect(result).toBe(mockUsers);
      expect(userService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([]);

      const result = await userController.findAll();

      expect(result).toEqual([]);
      expect(userService.findAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      jest.spyOn(userService, 'findAll').mockRejectedValue(new Error('Database connection failed'));

      await expect(userController.findAll()).rejects.toThrow('Database connection failed');
      expect(userService.findAll).toHaveBeenCalled();
    });
  });
});
