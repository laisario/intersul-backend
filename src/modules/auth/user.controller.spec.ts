import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './controllers/user';
import { UserService } from './services/user';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

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

  it('should return an array of users', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as User,
    ];
    
    jest.spyOn(userService, 'findAll').mockResolvedValue(mockUsers);

    const result = await userController.findAll();
    expect(result).toBe(mockUsers);
    expect(userService.findAll).toHaveBeenCalled();
  });
});
