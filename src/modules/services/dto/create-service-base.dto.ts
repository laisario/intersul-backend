import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceType } from '../../../common/enums/service-type.enum';

export class CreateServiceBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Client ID',
  })
  @IsNumber()
  client_id: number;

  @ApiProperty({
    example: 1,
    description: 'Copy Machine ID',
  })
  @IsNumber()
  copy_machine_id: number;

  @ApiProperty({
    example: 'MAINTENANCE',
    enum: ServiceType,
    description: 'Service type',
  })
  @IsEnum(ServiceType)
  type: ServiceType;
}
