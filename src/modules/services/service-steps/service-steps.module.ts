import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceStepsService } from './service-steps.service';
import { ServiceStepsController } from './service-steps.controller';
import { ServiceStep } from '../entities/service-step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceStep])],
  controllers: [ServiceStepsController],
  providers: [ServiceStepsService],
  exports: [ServiceStepsService],
})
export class ServiceStepsModule {}
