import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './service/services';
import { ServicesController } from './controller/services';
import { Service } from './entities/service.entity';
import { Step } from './entities/step.entity';
import { Category } from './entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { ClientCopyMachine } from '../copy-machines/entities/client-copy-machine.entity';
import { ClientsModule } from '../clients/clients.module';
import { CopyMachinesModule } from '../copy-machines/copy-machines.module';
import { CategoryService } from './service/category';
import { CategoryController } from './controller/category';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Category, Step, Client, ClientCopyMachine]),
    ClientsModule,
    CopyMachinesModule,
  ],
  controllers: [ServicesController, CategoryController],
  providers: [ServicesService, CategoryService],
  exports: [ServicesService, CategoryService],
})
export class ServicesModule {}
