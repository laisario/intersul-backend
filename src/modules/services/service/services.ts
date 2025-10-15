import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { Category } from '../entities/category.entity';
import { Step } from '../entities/step.entity';
import { Client } from '../../clients/entities/client.entity';
import { ClientCopyMachine } from '../../copy-machines/entities/client-copy-machine.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Step)
    private stepsRepository: Repository<Step>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(ClientCopyMachine)
    private copyMachinesRepository: Repository<ClientCopyMachine>,
  ) {}

  async findAll(filters?: {
    category_id?: number;
    client_id?: number;
    client_copy_machine_id?: number;
  }) {
    const query = this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.client', 'client')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.clientCopyMachine', 'clientCopyMachine')
      .leftJoinAndSelect('service.steps', 'steps')

    if (filters?.category_id) {
      query.andWhere('service.category_id = :category_id', { category_id: filters.category_id });
    }
    if (filters?.client_id) {
      query.andWhere('service.client_id = :client_id', { client_id: filters.client_id });
    }
    if (filters?.client_copy_machine_id) {
      query.andWhere('service.client_copy_machine_id = :client_copy_machine_id', { client_copy_machine_id: filters.client_copy_machine_id });
    }

    return query.orderBy('service.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['client', 'category', 'clientCopyMachine', 'steps', 'steps.responsable', 'steps.approval', 'steps.images'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Validate that client exists
    const client = await this.clientsRepository.findOne({
      where: { id: createServiceDto.client_id },
    });
    if (!client) {
      throw new BadRequestException(`Client with ID ${createServiceDto.client_id} not found`);
    }

    // Validate that category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: createServiceDto.category_id },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${createServiceDto.category_id} not found`);
    }

    // Validate that client copy machine exists (if provided)
    if (createServiceDto.client_copy_machine_id) {
      const clientCopyMachine = await this.copyMachinesRepository.findOne({
        where: { id: createServiceDto.client_copy_machine_id },
      });
      if (!clientCopyMachine) {
        throw new BadRequestException(`Client copy machine with ID ${createServiceDto.client_copy_machine_id} not found`);
      }
    }

    const service = this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(service);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }
}
