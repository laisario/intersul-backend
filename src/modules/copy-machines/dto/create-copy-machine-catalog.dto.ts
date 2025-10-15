import { IsString, IsArray, IsOptional, MinLength, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCopyMachineCatalogDto {
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
    example: 1500.00,
    description: 'Selling price',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 150.00,
    description: 'Monthly rental price',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  monthly_rent_price?: number;

  @ApiProperty({
    example: true,
    description: 'Copy machine availability status',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
