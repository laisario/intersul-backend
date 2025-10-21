import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { testDatabaseConfig } from '../../test/test-setup';

describe('ClientsController Integration', () => {
  let app: INestApplication;
  let clientsController: ClientsController;
  let clientsService: ClientsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [Client],
        }),
        TypeOrmModule.forFeature([Client]),
      ],
      controllers: [ClientsController],
      providers: [ClientsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    clientsController = moduleFixture.get<ClientsController>(ClientsController);
    clientsService = moduleFixture.get<ClientsService>(ClientsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await clientsService.remove(1);
    await clientsService.remove(2);
  });

  describe('GET /clients', () => {
    it('should return empty array when no clients exist', async () => {
      const result = await clientsController.findAll();

      expect(result).toEqual([]);
    });

    it('should return all clients', async () => {
      // Create test clients
      const client1 = await clientsController.create({
        name: 'Client 1',
        email: 'client1@example.com',
        phone: '+1234567890',
        address: '123 Test St',
      });

      const client2 = await clientsController.create({
        name: 'Client 2',
        email: 'client2@example.com',
        phone: '+0987654321',
        address: '456 Test Ave',
      });

      const result = await clientsController.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Client 1');
      expect(result[1].name).toBe('Client 2');
    });
  });

  describe('GET /clients/:id', () => {
    it('should return a client by id', async () => {
      const createClientDto: CreateClientDto = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
      };

      const createdClient = await clientsController.create(createClientDto);
      const result = await clientsController.findOne(createdClient.id);

      expect(result.id).toBe(createdClient.id);
      expect(result.name).toBe('Test Client');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error when client not found', async () => {
      await expect(clientsController.findOne(999)).rejects.toThrow();
    });
  });

  describe('POST /clients', () => {
    it('should create a new client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '+1234567890',
        address: '123 New St',
      };

      const result = await clientsController.create(createClientDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('New Client');
      expect(result.email).toBe('newclient@example.com');
      expect(result.phone).toBe('+1234567890');
      expect(result.address).toBe('123 New St');
    });

    it('should fail with duplicate email', async () => {
      const createClientDto: CreateClientDto = {
        name: 'Test Client',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
      };

      // Create first client
      await clientsController.create(createClientDto);

      // Try to create second client with same email
      await expect(clientsController.create(createClientDto)).rejects.toThrow();
    });
  });

  describe('PATCH /clients/:id', () => {
    it('should update a client', async () => {
      // First create a client
      const createClientDto: CreateClientDto = {
        name: 'Original Client',
        email: 'original@example.com',
        phone: '+1234567890',
        address: '123 Original St',
      };

      const createdClient = await clientsController.create(createClientDto);

      // Then update it
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
        email: 'updated@example.com',
      };

      const result = await clientsController.update(createdClient.id, updateClientDto);

      expect(result.name).toBe('Updated Client');
      expect(result.email).toBe('updated@example.com');
      expect(result.phone).toBe('+1234567890'); // Should remain unchanged
      expect(result.address).toBe('123 Original St'); // Should remain unchanged
    });

    it('should throw error when updating non-existent client', async () => {
      const updateClientDto: UpdateClientDto = {
        name: 'Updated Client',
      };

      await expect(clientsController.update(999, updateClientDto)).rejects.toThrow();
    });
  });

  describe('DELETE /clients/:id', () => {
    it('should delete a client', async () => {
      // First create a client
      const createClientDto: CreateClientDto = {
        name: 'To Delete Client',
        email: 'todelete@example.com',
        phone: '+1234567890',
        address: '123 Delete St',
      };

      const createdClient = await clientsController.create(createClientDto);

      // Then delete it
      await clientsController.remove(createdClient.id);

      // Verify it's deleted
      await expect(clientsController.findOne(createdClient.id)).rejects.toThrow();
    });

    it('should throw error when deleting non-existent client', async () => {
      await expect(clientsController.remove(999)).rejects.toThrow();
    });
  });
});
