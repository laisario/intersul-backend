import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CopyMachine } from './entities/copy-machine.entity';
import { CreateCopyMachineDto } from './dto/create-copy-machine.dto';
import { UpdateCopyMachineDto } from './dto/update-copy-machine.dto';

@Injectable()
export class CopyMachinesService {
  constructor(
    @InjectRepository(CopyMachine)
    private copyMachinesRepository: Repository<CopyMachine>,
  ) {}

  async create(createCopyMachineDto: CreateCopyMachineDto): Promise<CopyMachine> {
    const copyMachine = this.copyMachinesRepository.create(createCopyMachineDto);
    return this.copyMachinesRepository.save(copyMachine);
  }

  async findAll(): Promise<CopyMachine[]> {
    return this.copyMachinesRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CopyMachine> {
    const copyMachine = await this.copyMachinesRepository.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!copyMachine) {
      throw new NotFoundException(`Copy machine with ID ${id} not found`);
    }

    return copyMachine;
  }

  async update(id: number, updateCopyMachineDto: UpdateCopyMachineDto): Promise<CopyMachine> {
    const copyMachine = await this.findOne(id);
    Object.assign(copyMachine, updateCopyMachineDto);
    return this.copyMachinesRepository.save(copyMachine);
  }

  async remove(id: number): Promise<void> {
    const copyMachine = await this.findOne(id);
    await this.copyMachinesRepository.remove(copyMachine);
  }
}
