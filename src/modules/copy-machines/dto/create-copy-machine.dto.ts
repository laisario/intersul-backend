import { IsString, IsArray, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCopyMachineDto {
  @ApiProperty({
    example: 'HP LaserJet Pro M404dn',
    description: 'Copy machine model',
  })
  @IsString()
  @MinLength(2)
  model: string;

  @ApiProperty({
    example: 'HP',
    description: 'Copy machine manufacturer',
  })
  @IsString()
  @MinLength(2)
  manufacturer: string;

  @ApiProperty({
    example: 'CN12345678',
    description: 'Copy machine serial number',
  })
  @IsString()
  @MinLength(5)
  serial_number: string;

  @ApiProperty({
    example: 'High-performance monochrome laser printer',
    description: 'Copy machine description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['Print', 'Copy', 'Scan', 'Network printing'],
    description: 'Copy machine features list',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({
    example: true,
    description: 'Copy machine status',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
