import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let clientsService: ClientsService;

  const mockClient: Client = {
    id: 1,
    name: 'Test Client',
    email: 'client@example.com',
    phone: '+1234567890',
    address: '123 Test St',
    created_at: new Date(),
    updated_at: new Date(),
  } as Client;

  const mockClients: Client[] = [mockClient];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
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

    clientsController = module.get<ClientsController>(ClientsController);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      jest.spyOn(clientsService, 'findAll').mockResolvedValue(mockClients);

      const result = await clientsController.findAll();

      expect(result).toBe(mockClients);
      expect(clientsService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no clients exist', async () => {
      jest.spyOn(clientsService, 'findAll').mockResolvedValue([]);

      const result = await clientsController.findAll();

      expect(result).toEqual([]);
      expect(clientsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const clientId = 1;
      jest.spyOn(clientsService, 'findOne').mockResolvedValue(mockClient);

      const result = await clientsController.findOne(clientId);

      expect(result).toBe(mockClient);
      expect(clientsService.findOne).toHaveBeenCalledWith(clientId);
    });

    it('should throw error when client not found', async () => {
      const clientId = 999;
      jest.spyOn(clientsService, 'findOne').mockRejectedValue(new Error('Client not found'));

      await expect(clientsController.findOne(clientId)).rejects.toThrow('Client not found');
      expect(clientsService.findOne).toHaveBeenCalledWith(clientId);
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '+1234567890',
        address: '456 New St',
      };

      jest.spyOn(clientsService, 'create').mockResolvedValue(mockClient);

      const result = await clientsController.create(createClientDto);

      expect(result).toBe(mockClient);
      expect(clientsService.create).toHaveBeenCalledWith(createClientDto);
    });

    it('should throw error when client creation fails', async () => {
      const createClientDto: CreateClientDto = {
        name: 'New Client',
        email: 'client@example.com', // Already exists
        phone: '+1234567890',
        address: '456 New St',
      };

      jest.spyOn(clientsService, 'create').mockRejectedValue(new Error('Client already exists'));

      await expect(clientsController.create(createClientDto)).rejects.toThrow('Client already exists');
      expect(clientsService.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = 1;
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        email: 'updated@example.com',
      };

      const updatedClient = { ...mockClient, ...updateClientDto };
      jest.spyOn(clientsService, 'update').mockResolvedValue(updatedClient);

      const result = await clientsController.update(clientId, updateClientDto);

      expect(result).toBe(updatedClient);
      expect(clientsService.update).toHaveBeenCalledWith(clientId, updateClientDto);
    });

    it('should throw error when client update fails', async () => {
      const clientId = 999;
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
      };

      jest.spyOn(clientsService, 'update').mockRejectedValue(new Error('Client not found'));

      await expect(clientsController.update(clientId, updateClientDto)).rejects.toThrow('Client not found');
      expect(clientsService.update).toHaveBeenCalledWith(clientId, updateClientDto);
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      const clientId = 1;
      jest.spyOn(clientsService, 'remove').mockResolvedValue(undefined);

      await clientsController.remove(clientId);

      expect(clientsService.remove).toHaveBeenCalledWith(clientId);
    });

    it('should throw error when client removal fails', async () => {
      const clientId = 999;
      jest.spyOn(clientsService, 'remove').mockRejectedValue(new Error('Client not found'));

      await expect(clientsController.remove(clientId)).rejects.toThrow('Client not found');
      expect(clientsService.remove).toHaveBeenCalledWith(clientId);
    });
  });
});
