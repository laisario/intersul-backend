import { IsString, IsArray, IsOptional, MinLength, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    return Array.isArray(value) ? value : [value];
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
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 5,
    description: 'Available quantity in stock',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    example: 'https://example.com/images/machine.jpg',
    description: 'Image URL for the copy machine',
    required: false,
  })
  @IsString()
  @IsOptional()
  file?: any;

}
