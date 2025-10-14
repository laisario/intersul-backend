import { IsString, IsNumber, IsEnum, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyCategory } from '../../../common/enums/supply-category.enum';

export class CreateSupplyDto {
  @ApiProperty({
    example: 'HP 26A Black Toner Cartridge',
    description: 'Supply name',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'High-quality black toner cartridge for HP LaserJet printers',
    description: 'Supply description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 50,
    description: 'Quantity in stock',
    required: false,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity_in_stock?: number;

  @ApiProperty({
    example: 89.99,
    description: 'Supply price',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'TONER',
    enum: SupplyCategory,
    description: 'Supply category',
    required: false,
    default: SupplyCategory.PARTS,
  })
  @IsEnum(SupplyCategory)
  @IsOptional()
  category?: SupplyCategory;
}
