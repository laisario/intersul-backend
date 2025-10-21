import { IsString, IsOptional, MinLength, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AcquisitionType } from '../../../common/enums/acquisition-type.enum';

export class CreateClientCopyMachineDto {
  @ApiProperty({
    example: 'CN12345678',
    description: 'Copy machine serial number',
  })
  @IsString()
  @MinLength(5)
  serial_number: string;

  @ApiProperty({
    example: 1,
    description: 'Client ID',
  })
  @IsNumber()
  client_id: number;

  @ApiProperty({
    example: 1,
    description: 'Catalog copy machine ID (if from company catalog)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  catalog_copy_machine_id?: number;

  @ApiProperty({
    example: 'HP LaserJet Pro M404dn',
    description: 'External model (if not from company catalog)',
    required: false,
  })
  @IsString()
  @IsOptional()
  external_model?: string;

  @ApiProperty({
    example: 'HP',
    description: 'External manufacturer (if not from company catalog)',
    required: false,
  })
  @IsString()
  @IsOptional()
  external_manufacturer?: string;

  @ApiProperty({
    example: 'High-performance monochrome laser printer',
    description: 'External description (if not from company catalog)',
    required: false,
  })
  @IsString()
  @IsOptional()
  external_description?: string;

  @ApiProperty({
    example: 'RENT',
    enum: AcquisitionType,
    description: 'How the client acquired this machine',
  })
  @IsEnum(AcquisitionType)
  acquisition_type: AcquisitionType;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Acquisition date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  acquisition_date?: string;

  @ApiProperty({
    example: '2025-01-15T00:00:00.000Z',
    description: 'Contract end date (for rentals)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  contract_end_date?: string;

  @ApiProperty({
    example: 2500.00,
    description: 'Machine value in currency',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: 1,
    description: 'Franchise ID (rental plan)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  franchise_id?: number;
}
