import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supply } from './entities/supply.entity';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supply)
    private suppliesRepository: Repository<Supply>,
  ) {}

  async create(createSupplyDto: CreateSupplyDto): Promise<Supply> {
    const supply = this.suppliesRepository.create(createSupplyDto);
    return this.suppliesRepository.save(supply);
  }

  async findAll(): Promise<Supply[]> {
    return this.suppliesRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Supply> {
    const supply = await this.suppliesRepository.findOne({
      where: { id },
      relations: ['supplyItems'],
    });

    if (!supply) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }

    return supply;
  }

  async update(id: number, updateSupplyDto: UpdateSupplyDto): Promise<Supply> {
    const supply = await this.findOne(id);
    Object.assign(supply, updateSupplyDto);
    return this.suppliesRepository.save(supply);
  }

  async remove(id: number): Promise<void> {
    const supply = await this.findOne(id);
    await this.suppliesRepository.remove(supply);
  }

  async updateStock(id: number, quantity: number): Promise<Supply> {
    const supply = await this.findOne(id);
    supply.quantity_in_stock = quantity;
    return this.suppliesRepository.save(supply);
  }
}
