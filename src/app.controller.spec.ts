import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      const expectedMessage = 'Hello World!';
      jest.spyOn(appService, 'getHello').mockReturnValue(expectedMessage);

      const result = appController.getHello();

      expect(result).toBe(expectedMessage);
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = appController.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(typeof result.timestamp).toBe('string');
      expect(typeof result.uptime).toBe('number');
    });

    it('should return current timestamp', () => {
      const before = new Date();
      const result = appController.getHealth();
      const after = new Date();

      const resultTime = new Date(result.timestamp);
      expect(resultTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(resultTime.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should return valid uptime', () => {
      const result = appController.getHealth();

      expect(result.uptime).toBeGreaterThanOrEqual(0);
      expect(typeof result.uptime).toBe('number');
    });
  });
});