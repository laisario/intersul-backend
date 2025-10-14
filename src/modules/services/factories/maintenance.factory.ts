import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ServiceStep } from '../entities/service-step.entity';
import { Maintenance } from '../maintenance/entities/maintenance.entity';
import { MaintenanceType } from '../../../common/enums/maintenance-type.enum';
import { ServiceType } from '../../../common/enums/service-type.enum';

@Injectable()
export class MaintenanceFactory {
  constructor(
    @InjectRepository(ServiceStep)
    private serviceStepsRepository: Repository<ServiceStep>,
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
  ) {}

  async createMaintenanceService(
    service: Service,
    type: MaintenanceType,
    problemDescription?: string,
  ): Promise<Maintenance> {
    // Create maintenance record
    const maintenance = this.maintenanceRepository.create({
      service_id: service.id,
      type,
      problem_description: problemDescription,
    });

    const savedMaintenance = await this.maintenanceRepository.save(maintenance);

    // Create default steps based on maintenance type
    await this.createDefaultSteps(service, type);

    return savedMaintenance;
  }

  private async createDefaultSteps(service: Service, type: MaintenanceType): Promise<void> {
    const steps = this.getDefaultStepsForType(type);

    for (let i = 0; i < steps.length; i++) {
      const step = this.serviceStepsRepository.create({
        service_id: service.id,
        service_type: ServiceType.MAINTENANCE,
        order: i + 1,
        description: steps[i],
        status: 'PENDING' as any,
      });

      await this.serviceStepsRepository.save(step);
    }
  }

  private getDefaultStepsForType(type: MaintenanceType): string[] {
    if (type === MaintenanceType.INTERNAL) {
      return [
        'On the Way',
        'Maintenance',
        'Completion/Testing',
      ];
    } else {
      return [
        'Technical Evaluation',
        'Budget',
        'Budget Approval',
        'On the Way',
        'Maintenance',
        'Billing',
      ];
    }
  }
}
