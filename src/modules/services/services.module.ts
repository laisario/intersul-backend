import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { ServiceStep } from './entities/service-step.entity';
import { Maintenance } from './maintenance/entities/maintenance.entity';
import { Client } from '../clients/entities/client.entity';
import { CopyMachine } from '../copy-machines/entities/copy-machine.entity';
import { MaintenanceFactory } from './factories/maintenance.factory';
import { ServiceStepsModule } from './service-steps/service-steps.module';
import { ClientsModule } from '../clients/clients.module';
import { CopyMachinesModule } from '../copy-machines/copy-machines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceStep, Maintenance, Client, CopyMachine]),
    ServiceStepsModule,
    ClientsModule,
    CopyMachinesModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, MaintenanceFactory],
  exports: [ServicesService],
})
export class ServicesModule {}
