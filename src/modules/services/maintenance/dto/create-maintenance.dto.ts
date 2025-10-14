import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceType } from '../../../../common/enums/maintenance-type.enum';

export class CreateMaintenanceDto {
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
    example: 'EXTERNAL',
    enum: MaintenanceType,
    description: 'Maintenance type',
  })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({
    example: 'Paper jam and printing quality issues',
    description: 'Problem description',
    required: false,
  })
  @IsString()
  @IsOptional()
  problem_description?: string;
}
