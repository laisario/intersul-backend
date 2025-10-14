import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Client } from '../clients/entities/client.entity';
import { CopyMachine } from '../copy-machines/entities/copy-machine.entity';
import { MaintenanceFactory } from './factories/maintenance.factory';
import { CreateMaintenanceDto } from './maintenance/dto/create-maintenance.dto';
import { ServiceType } from '../../common/enums/service-type.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(CopyMachine)
    private copyMachinesRepository: Repository<CopyMachine>,
    private maintenanceFactory: MaintenanceFactory,
  ) {}

  async createMaintenance(createMaintenanceDto: CreateMaintenanceDto) {
    // Validate client exists
    const client = await this.clientsRepository.findOne({
      where: { id: createMaintenanceDto.client_id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${createMaintenanceDto.client_id} not found`);
    }

    // Validate copy machine exists
    const copyMachine = await this.copyMachinesRepository.findOne({
      where: { id: createMaintenanceDto.copy_machine_id },
    });
    if (!copyMachine) {
      throw new NotFoundException(`Copy machine with ID ${createMaintenanceDto.copy_machine_id} not found`);
    }

    // Create service record
    const service = this.servicesRepository.create({
      type: ServiceType.MAINTENANCE,
      client_id: createMaintenanceDto.client_id,
      copy_machine_id: createMaintenanceDto.copy_machine_id,
    });

    const savedService = await this.servicesRepository.save(service);

    // Create maintenance record and default steps
    const maintenance = await this.maintenanceFactory.createMaintenanceService(
      savedService,
      createMaintenanceDto.type,
      createMaintenanceDto.problem_description,
    );

    // Return service with relations
    return this.findOne(savedService.id);
  }

  async findAll(filters?: {
    type?: ServiceType;
    client_id?: number;
    copy_machine_id?: number;
  }) {
    const query = this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.client', 'client')
      .leftJoinAndSelect('service.copyMachine', 'copyMachine')
      .leftJoinAndSelect('service.steps', 'steps')
      .leftJoinAndSelect('service.maintenance', 'maintenance');

    if (filters?.type) {
      query.andWhere('service.type = :type', { type: filters.type });
    }
    if (filters?.client_id) {
      query.andWhere('service.client_id = :client_id', { client_id: filters.client_id });
    }
    if (filters?.copy_machine_id) {
      query.andWhere('service.copy_machine_id = :copy_machine_id', { copy_machine_id: filters.copy_machine_id });
    }

    return query.orderBy('service.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['client', 'copyMachine', 'steps', 'maintenance', 'steps.responsibleEmployee'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }
}
