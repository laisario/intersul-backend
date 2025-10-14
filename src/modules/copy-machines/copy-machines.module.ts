import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CopyMachinesService } from './copy-machines.service';
import { CopyMachinesController } from './copy-machines.controller';
import { CopyMachine } from './entities/copy-machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CopyMachine])],
  controllers: [CopyMachinesController],
  providers: [CopyMachinesService],
  exports: [CopyMachinesService],
})
export class CopyMachinesModule {}
