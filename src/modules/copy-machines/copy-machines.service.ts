import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CopyMachineCatalog } from './entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from './entities/client-copy-machine.entity';
import { CreateCopyMachineCatalogDto } from './dto/create-copy-machine-catalog.dto';
import { UpdateCopyMachineCatalogDto } from './dto/update-copy-machine-catalog.dto';
import { CreateClientCopyMachineDto } from './dto/create-client-copy-machine.dto';
import { UpdateClientCopyMachineDto } from './dto/update-client-copy-machine.dto';

@Injectable()
export class CopyMachinesService {
  constructor(
    @InjectRepository(CopyMachineCatalog)
    private copyMachineCatalogRepository: Repository<CopyMachineCatalog>,
    @InjectRepository(ClientCopyMachine)
    private clientCopyMachineRepository: Repository<ClientCopyMachine>,
  ) {}

  // Catalog Copy Machine methods
  async createCatalog(createCopyMachineCatalogDto: CreateCopyMachineCatalogDto): Promise<CopyMachineCatalog> {
    const copyMachine = this.copyMachineCatalogRepository.create(createCopyMachineCatalogDto);
    return this.copyMachineCatalogRepository.save(copyMachine);
  }

  async findAllCatalog(): Promise<CopyMachineCatalog[]> {
    return this.copyMachineCatalogRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOneCatalog(id: number): Promise<CopyMachineCatalog> {
    const copyMachine = await this.copyMachineCatalogRepository.findOne({
      where: { id },
      relations: ['clientCopyMachines'],
    });

    if (!copyMachine) {
      throw new NotFoundException(`Catalog copy machine with ID ${id} not found`);
    }

    return copyMachine;
  }

  async updateCatalog(id: number, updateCopyMachineCatalogDto: UpdateCopyMachineCatalogDto): Promise<CopyMachineCatalog> {
    const copyMachine = await this.findOneCatalog(id);
    Object.assign(copyMachine, updateCopyMachineCatalogDto);
    return this.copyMachineCatalogRepository.save(copyMachine);
  }

  async removeCatalog(id: number): Promise<void> {
    const copyMachine = await this.findOneCatalog(id);
    await this.copyMachineCatalogRepository.remove(copyMachine);
  }

  // Client Copy Machine methods
  async createClientCopyMachine(createClientCopyMachineDto: CreateClientCopyMachineDto): Promise<ClientCopyMachine> {
    const clientCopyMachine = this.clientCopyMachineRepository.create(createClientCopyMachineDto);
    return this.clientCopyMachineRepository.save(clientCopyMachine);
  }

  async findAllClientCopyMachines(): Promise<ClientCopyMachine[]> {
    return this.clientCopyMachineRepository.find({
      relations: ['client', 'catalogCopyMachine', 'services'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneClientCopyMachine(id: number): Promise<ClientCopyMachine> {
    const clientCopyMachine = await this.clientCopyMachineRepository.findOne({
      where: { id },
      relations: ['client', 'catalogCopyMachine', 'services'],
    });

    if (!clientCopyMachine) {
      throw new NotFoundException(`Client copy machine with ID ${id} not found`);
    }

    return clientCopyMachine;
  }

  async updateClientCopyMachine(id: number, updateClientCopyMachineDto: UpdateClientCopyMachineDto): Promise<ClientCopyMachine> {
    const clientCopyMachine = await this.findOneClientCopyMachine(id);
    Object.assign(clientCopyMachine, updateClientCopyMachineDto);
    return this.clientCopyMachineRepository.save(clientCopyMachine);
  }

  async removeClientCopyMachine(id: number): Promise<void> {
    const clientCopyMachine = await this.findOneClientCopyMachine(id);
    await this.clientCopyMachineRepository.remove(clientCopyMachine);
  }

  async findByClient(clientId: number): Promise<ClientCopyMachine[]> {
    return this.clientCopyMachineRepository.find({
      where: { client_id: clientId },
      relations: ['catalogCopyMachine', 'services'],
      order: { created_at: 'DESC' },
    });
  }
}
