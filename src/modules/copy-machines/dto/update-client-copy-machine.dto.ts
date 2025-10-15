import { PartialType } from '@nestjs/mapped-types';
import { CreateClientCopyMachineDto } from './create-client-copy-machine.dto';

export class UpdateClientCopyMachineDto extends PartialType(CreateClientCopyMachineDto) {}
