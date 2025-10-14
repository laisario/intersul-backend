import { PartialType } from '@nestjs/swagger';
import { CreateCopyMachineDto } from './create-copy-machine.dto';

export class UpdateCopyMachineDto extends PartialType(CreateCopyMachineDto) {}
