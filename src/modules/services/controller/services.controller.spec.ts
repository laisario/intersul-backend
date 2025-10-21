import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services';
import { ServicesService } from '../service/services';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

describe('ServicesController', () => {
  let servicesController: ServicesController;
  let servicesService: ServicesService;

  const mockService: Service = {
    id: 1,
    client_id: 1,
    category_id: 1,
    client_copy_machine_id: 1,
    description: 'Test Service',
    created_at: new Date(),
    updated_at: new Date(),
  } as Service;

  const mockServices: Service[] = [mockService];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    servicesController = module.get<ServicesController>(ServicesController);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  describe('findAll', () => {
    it('should return all services without filters', async () => {
      jest.spyOn(servicesService, 'findAll').mockResolvedValue(mockServices);

      const result = await servicesController.findAll();

      expect(result).toBe(mockServices);
      expect(servicesService.findAll).toHaveBeenCalledWith({});
    });

    it('should return filtered services by category_id', async () => {
      const categoryId = 1;
      jest.spyOn(servicesService, 'findAll').mockResolvedValue(mockServices);

      const result = await servicesController.findAll(categoryId);

      expect(result).toBe(mockServices);
      expect(servicesService.findAll).toHaveBeenCalledWith({ category_id: categoryId });
    });

    it('should return filtered services by client_id', async () => {
      const clientId = 1;
      jest.spyOn(servicesService, 'findAll').mockResolvedValue(mockServices);

      const result = await servicesController.findAll(undefined, clientId);

      expect(result).toBe(mockServices);
      expect(servicesService.findAll).toHaveBeenCalledWith({ client_id: clientId });
    });

    it('should return filtered services by client_copy_machine_id', async () => {
      const clientCopyMachineId = 1;
      jest.spyOn(servicesService, 'findAll').mockResolvedValue(mockServices);

      const result = await servicesController.findAll(undefined, undefined, clientCopyMachineId);

      expect(result).toBe(mockServices);
      expect(servicesService.findAll).toHaveBeenCalledWith({ client_copy_machine_id: clientCopyMachineId });
    });

    it('should return filtered services with multiple filters', async () => {
      const categoryId = 1;
      const clientId = 1;
      const clientCopyMachineId = 1;
      jest.spyOn(servicesService, 'findAll').mockResolvedValue(mockServices);

      const result = await servicesController.findAll(categoryId, clientId, clientCopyMachineId);

      expect(result).toBe(mockServices);
      expect(servicesService.findAll).toHaveBeenCalledWith({
        category_id: categoryId,
        client_id: clientId,
        client_copy_machine_id: clientCopyMachineId,
      });
    });

    it('should return empty array when no services exist', async () => {
      jest.spyOn(servicesService, 'findAll').mockResolvedValue([]);

      const result = await servicesController.findAll();

      expect(result).toEqual([]);
      expect(servicesService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const serviceId = 1;
      jest.spyOn(servicesService, 'findOne').mockResolvedValue(mockService);

      const result = await servicesController.findOne(serviceId);

      expect(result).toBe(mockService);
      expect(servicesService.findOne).toHaveBeenCalledWith(serviceId);
    });

    it('should throw error when service not found', async () => {
      const serviceId = 999;
      jest.spyOn(servicesService, 'findOne').mockRejectedValue(new Error('Service not found'));

      await expect(servicesController.findOne(serviceId)).rejects.toThrow('Service not found');
      expect(servicesService.findOne).toHaveBeenCalledWith(serviceId);
    });
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = {
        client_id: 1,
        category_id: 1,
        client_copy_machine_id: 1,
        description: 'New Service',
      };

      jest.spyOn(servicesService, 'create').mockResolvedValue(mockService);

      const result = await servicesController.create(createServiceDto);

      expect(result).toBe(mockService);
      expect(servicesService.create).toHaveBeenCalledWith(createServiceDto);
    });

    it('should throw error when service creation fails', async () => {
      const createServiceDto: CreateServiceDto = {
        client_id: 1,
        category_id: 1,
        client_copy_machine_id: 1,
        description: 'New Service',
      };

      jest.spyOn(servicesService, 'create').mockRejectedValue(new Error('Invalid service data'));

      await expect(servicesController.create(createServiceDto)).rejects.toThrow('Invalid service data');
      expect(servicesService.create).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const serviceId = 1;
      const updateServiceDto: UpdateServiceDto = {
        description: 'Updated Service',
      };

      const updatedService = { ...mockService, ...updateServiceDto };
      jest.spyOn(servicesService, 'update').mockResolvedValue(updatedService);

      const result = await servicesController.update(serviceId, updateServiceDto);

      expect(result).toBe(updatedService);
      expect(servicesService.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
    });

    it('should throw error when service update fails', async () => {
      const serviceId = 999;
      const updateServiceDto: UpdateServiceDto = {
        description: 'Updated Service',
      };

      jest.spyOn(servicesService, 'update').mockRejectedValue(new Error('Service not found'));

      await expect(servicesController.update(serviceId, updateServiceDto)).rejects.toThrow('Service not found');
      expect(servicesService.update).toHaveBeenCalledWith(serviceId, updateServiceDto);
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      const serviceId = 1;
      jest.spyOn(servicesService, 'remove').mockResolvedValue(undefined);

      await servicesController.remove(serviceId);

      expect(servicesService.remove).toHaveBeenCalledWith(serviceId);
    });

    it('should throw error when service removal fails', async () => {
      const serviceId = 999;
      jest.spyOn(servicesService, 'remove').mockRejectedValue(new Error('Service not found'));

      await expect(servicesController.remove(serviceId)).rejects.toThrow('Service not found');
      expect(servicesService.remove).toHaveBeenCalledWith(serviceId);
    });
  });
});
