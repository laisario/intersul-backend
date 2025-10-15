import { PartialType } from '@nestjs/mapped-types';
import { CreateCopyMachineCatalogDto } from './create-copy-machine-catalog.dto';

export class UpdateCopyMachineCatalogDto extends PartialType(CreateCopyMachineCatalogDto) {}
