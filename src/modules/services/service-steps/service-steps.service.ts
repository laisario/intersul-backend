import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceStep } from '../entities/service-step.entity';
import { UpdateStepStatusDto } from './dto/update-step-status.dto';
import { AssignStepDto } from './dto/assign-step.dto';
import { StepStatus } from '../../../common/enums/step-status.enum';

@Injectable()
export class ServiceStepsService {
  constructor(
    @InjectRepository(ServiceStep)
    private serviceStepsRepository: Repository<ServiceStep>,
  ) {}

  async findByServiceId(serviceId: number): Promise<ServiceStep[]> {
    return this.serviceStepsRepository.find({
      where: { service_id: serviceId },
      relations: ['responsibleEmployee'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ServiceStep> {
    const step = await this.serviceStepsRepository.findOne({
      where: { id },
      relations: ['responsibleEmployee', 'service'],
    });

    if (!step) {
      throw new NotFoundException(`Service step with ID ${id} not found`);
    }

    return step;
  }

  async updateStatus(id: number, updateStepStatusDto: UpdateStepStatusDto): Promise<ServiceStep> {
    const step = await this.findOne(id);

    step.status = updateStepStatusDto.status;
    if (updateStepStatusDto.notes) {
      step.notes = updateStepStatusDto.notes;
    }

    // Set completed_date if status is COMPLETED
    if (updateStepStatusDto.status === StepStatus.COMPLETED) {
      step.completed_date = new Date();
    } else {
      step.completed_date = null;
    }

    return this.serviceStepsRepository.save(step);
  }

  async assignEmployee(id: number, assignStepDto: AssignStepDto): Promise<ServiceStep> {
    const step = await this.findOne(id);
    step.responsible_employee_id = assignStepDto.responsible_employee_id;
    return this.serviceStepsRepository.save(step);
  }

  async updateNotes(id: number, notes: string): Promise<ServiceStep> {
    const step = await this.findOne(id);
    step.notes = notes;
    return this.serviceStepsRepository.save(step);
  }
}
