import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CopyMachinesService } from './copy-machines.service';
import { CopyMachinesController } from './copy-machines.controller';
import { CopyMachineCatalog } from './entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from './entities/client-copy-machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CopyMachineCatalog, ClientCopyMachine])],
  controllers: [CopyMachinesController],
  providers: [CopyMachinesService],
  exports: [CopyMachinesService],
})
export class CopyMachinesModule {}
