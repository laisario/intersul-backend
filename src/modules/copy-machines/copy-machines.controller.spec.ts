import { Test, TestingModule } from '@nestjs/testing';
import { CopyMachinesController } from './copy-machines.controller';
import { CopyMachinesService } from './copy-machines.service';
import { CopyMachineCatalog } from './entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from './entities/client-copy-machine.entity';
import { Franchise } from './entities/franchise.entity';
import { CreateCopyMachineCatalogDto } from './dto/create-copy-machine-catalog.dto';
import { UpdateCopyMachineCatalogDto } from './dto/update-copy-machine-catalog.dto';
import { CreateClientCopyMachineDto } from './dto/create-client-copy-machine.dto';
import { UpdateClientCopyMachineDto } from './dto/update-client-copy-machine.dto';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { AcquisitionType } from '../../common/enums/acquisition-type.enum';

describe('CopyMachinesController', () => {
  let copyMachinesController: CopyMachinesController;
  let copyMachinesService: CopyMachinesService;

  const mockCatalog: CopyMachineCatalog = {
    id: 1,
    model: 'Test Model',
    manufacturer: 'Test Manufacturer',
    description: 'Test Description',
    features: ['feature1', 'feature2'],
    price: 1000.00,
    monthly_rent_price: 100.00,
    quantity: 5,
    created_at: new Date(),
    updated_at: new Date(),
  } as CopyMachineCatalog;

  const mockClientCopyMachine: ClientCopyMachine = {
    id: 1,
    serial_number: 'SN123456',
    client_id: 1,
    catalog_copy_machine_id: 1,
    external_model: 'External Model',
    external_manufacturer: 'External Manufacturer',
    external_description: 'External Description',
    acquisition_type: AcquisitionType.RENT,
    value: 1500.00,
    franchise_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  } as ClientCopyMachine;

  const mockFranchise: Franchise = {
    id: 1,
    periodo: '12 months',
    folha: 'A4',
    colorida: false,
    quantidade: 1000,
    preco_unidade: 0.05,
    valor: 50.00,
    created_at: new Date(),
    updated_at: new Date(),
  } as Franchise;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopyMachinesController],
      providers: [
        {
          provide: CopyMachinesService,
          useValue: {
            // Catalog methods
            createCatalog: jest.fn(),
            findAllCatalog: jest.fn(),
            findOneCatalog: jest.fn(),
            updateCatalog: jest.fn(),
            removeCatalog: jest.fn(),
            // Client Copy Machine methods
            createClientCopyMachine: jest.fn(),
            findAllClientCopyMachines: jest.fn(),
            findOneClientCopyMachine: jest.fn(),
            updateClientCopyMachine: jest.fn(),
            removeClientCopyMachine: jest.fn(),
            // Franchise methods
            createFranchise: jest.fn(),
            findAllFranchises: jest.fn(),
            findOneFranchise: jest.fn(),
            updateFranchise: jest.fn(),
            removeFranchise: jest.fn(),
          },
        },
      ],
    }).compile();

    copyMachinesController = module.get<CopyMachinesController>(CopyMachinesController);
    copyMachinesService = module.get<CopyMachinesService>(CopyMachinesService);
  });

  describe('Catalog Copy Machine endpoints', () => {
    describe('createCatalog', () => {
      it('should create a new catalog copy machine', async () => {
        const createDto: CreateCopyMachineCatalogDto = {
          model: 'Test Model',
          manufacturer: 'Test Manufacturer',
          description: 'Test Description',
          features: ['feature1', 'feature2'],
          price: 1000.00,
          monthly_rent_price: 100.00,
          quantity: 5,
        };

        jest.spyOn(copyMachinesService, 'createCatalog').mockResolvedValue(mockCatalog);

        const result = await copyMachinesController.createCatalog(createDto);

        expect(result).toBe(mockCatalog);
        expect(copyMachinesService.createCatalog).toHaveBeenCalledWith(createDto);
      });
    });

    describe('findAllCatalog', () => {
      it('should return all catalog copy machines', async () => {
        jest.spyOn(copyMachinesService, 'findAllCatalog').mockResolvedValue([mockCatalog]);

        const result = await copyMachinesController.findAllCatalog();

        expect(result).toEqual([mockCatalog]);
        expect(copyMachinesService.findAllCatalog).toHaveBeenCalled();
      });
    });

    describe('findOneCatalog', () => {
      it('should return a catalog copy machine by id', async () => {
        const catalogId = 1;
        jest.spyOn(copyMachinesService, 'findOneCatalog').mockResolvedValue(mockCatalog);

        const result = await copyMachinesController.findOneCatalog(catalogId);

        expect(result).toBe(mockCatalog);
        expect(copyMachinesService.findOneCatalog).toHaveBeenCalledWith(catalogId);
      });
    });

    describe('updateCatalog', () => {
      it('should update a catalog copy machine', async () => {
        const catalogId = 1;
        const updateDto: UpdateCopyMachineCatalogDto = {
          model: 'Updated Model',
          price: 1200.00,
        };

        const updatedCatalog = { ...mockCatalog, ...updateDto };
        jest.spyOn(copyMachinesService, 'updateCatalog').mockResolvedValue(updatedCatalog);

        const result = await copyMachinesController.updateCatalog(catalogId, updateDto);

        expect(result).toBe(updatedCatalog);
        expect(copyMachinesService.updateCatalog).toHaveBeenCalledWith(catalogId, updateDto);
      });
    });

    describe('removeCatalog', () => {
      it('should remove a catalog copy machine', async () => {
        const catalogId = 1;
        jest.spyOn(copyMachinesService, 'removeCatalog').mockResolvedValue(undefined);

        await copyMachinesController.removeCatalog(catalogId);

        expect(copyMachinesService.removeCatalog).toHaveBeenCalledWith(catalogId);
      });
    });
  });

  describe('Client Copy Machine endpoints', () => {
    describe('createClientCopyMachine', () => {
      it('should create a new client copy machine', async () => {
        const createDto: CreateClientCopyMachineDto = {
          serial_number: 'SN123456',
          client_id: 1,
          catalog_copy_machine_id: 1,
          external_model: 'External Model',
          external_manufacturer: 'External Manufacturer',
          external_description: 'External Description',
          acquisition_type: AcquisitionType.RENT,
          value: 1500.00,
          franchise_id: 1,
        };

        jest.spyOn(copyMachinesService, 'createClientCopyMachine').mockResolvedValue(mockClientCopyMachine);

        const result = await copyMachinesController.createClientCopyMachine(createDto);

        expect(result).toBe(mockClientCopyMachine);
        expect(copyMachinesService.createClientCopyMachine).toHaveBeenCalledWith(createDto);
      });
    });

    describe('findAllClientCopyMachines', () => {
      it('should return all client copy machines', async () => {
        jest.spyOn(copyMachinesService, 'findAllClientCopyMachines').mockResolvedValue([mockClientCopyMachine]);

        const result = await copyMachinesController.findAllClientCopyMachines();

        expect(result).toEqual([mockClientCopyMachine]);
        expect(copyMachinesService.findAllClientCopyMachines).toHaveBeenCalled();
      });
    });

    describe('findOneClientCopyMachine', () => {
      it('should return a client copy machine by id', async () => {
        const clientCopyMachineId = 1;
        jest.spyOn(copyMachinesService, 'findOneClientCopyMachine').mockResolvedValue(mockClientCopyMachine);

        const result = await copyMachinesController.findOneClientCopyMachine(clientCopyMachineId);

        expect(result).toBe(mockClientCopyMachine);
        expect(copyMachinesService.findOneClientCopyMachine).toHaveBeenCalledWith(clientCopyMachineId);
      });
    });

    describe('updateClientCopyMachine', () => {
      it('should update a client copy machine', async () => {
        const clientCopyMachineId = 1;
        const updateDto: UpdateClientCopyMachineDto = {
          external_model: 'Updated External Model',
          value: 2000.00,
        };

        const updatedClientCopyMachine = { ...mockClientCopyMachine, ...updateDto };
        jest.spyOn(copyMachinesService, 'updateClientCopyMachine').mockResolvedValue(updatedClientCopyMachine);

        const result = await copyMachinesController.updateClientCopyMachine(clientCopyMachineId, updateDto);

        expect(result).toBe(updatedClientCopyMachine);
        expect(copyMachinesService.updateClientCopyMachine).toHaveBeenCalledWith(clientCopyMachineId, updateDto);
      });
    });

    describe('removeClientCopyMachine', () => {
      it('should remove a client copy machine', async () => {
        const clientCopyMachineId = 1;
        jest.spyOn(copyMachinesService, 'removeClientCopyMachine').mockResolvedValue(undefined);

        await copyMachinesController.removeClientCopyMachine(clientCopyMachineId);

        expect(copyMachinesService.removeClientCopyMachine).toHaveBeenCalledWith(clientCopyMachineId);
      });
    });
  });

  describe('Franchise endpoints', () => {
    describe('createFranchise', () => {
      it('should create a new franchise', async () => {
        const createDto: CreateFranchiseDto = {
          periodo: '12 months',
          folha: 'A4',
          colorida: false,
          quantidade: 1000,
          preco_unidade: 0.05,
          valor: 50.00,
        };

        jest.spyOn(copyMachinesService, 'createFranchise').mockResolvedValue(mockFranchise);

        const result = await copyMachinesController.createFranchise(createDto);

        expect(result).toBe(mockFranchise);
        expect(copyMachinesService.createFranchise).toHaveBeenCalledWith(createDto);
      });
    });

    describe('findAllFranchises', () => {
      it('should return all franchises', async () => {
        jest.spyOn(copyMachinesService, 'findAllFranchises').mockResolvedValue([mockFranchise]);

        const result = await copyMachinesController.findAllFranchises();

        expect(result).toEqual([mockFranchise]);
        expect(copyMachinesService.findAllFranchises).toHaveBeenCalled();
      });
    });

    describe('findOneFranchise', () => {
      it('should return a franchise by id', async () => {
        const franchiseId = 1;
        jest.spyOn(copyMachinesService, 'findOneFranchise').mockResolvedValue(mockFranchise);

        const result = await copyMachinesController.findOneFranchise(franchiseId);

        expect(result).toBe(mockFranchise);
        expect(copyMachinesService.findOneFranchise).toHaveBeenCalledWith(franchiseId);
      });
    });

    describe('updateFranchise', () => {
      it('should update a franchise', async () => {
        const franchiseId = 1;
        const updateDto: UpdateFranchiseDto = {
          quantidade: 1500,
          preco_unidade: 0.06,
        };

        const updatedFranchise = { ...mockFranchise, ...updateDto };
        jest.spyOn(copyMachinesService, 'updateFranchise').mockResolvedValue(updatedFranchise);

        const result = await copyMachinesController.updateFranchise(franchiseId, updateDto);

        expect(result).toBe(updatedFranchise);
        expect(copyMachinesService.updateFranchise).toHaveBeenCalledWith(franchiseId, updateDto);
      });
    });

    describe('removeFranchise', () => {
      it('should remove a franchise', async () => {
        const franchiseId = 1;
        jest.spyOn(copyMachinesService, 'removeFranchise').mockResolvedValue(undefined);

        await copyMachinesController.removeFranchise(franchiseId);

        expect(copyMachinesService.removeFranchise).toHaveBeenCalledWith(franchiseId);
      });
    });
  });
});
