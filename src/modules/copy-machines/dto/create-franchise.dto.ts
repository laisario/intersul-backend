import { IsString, IsBoolean, IsNumber, IsDecimal, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFranchiseDto {
  @ApiProperty({
    example: '12 months',
    description: 'Rental period',
  })
  @IsString()
  @MinLength(1)
  periodo: string;

  @ApiProperty({
    example: 'A4',
    description: 'Paper size/type',
  })
  @IsString()
  @MinLength(1)
  folha: string;

  @ApiProperty({
    example: true,
    description: 'Color printing capability',
  })
  @IsBoolean()
  colorida: boolean;

  @ApiProperty({
    example: 1000,
    description: 'Quantity of pages/copies included',
  })
  @IsNumber()
  quantidade: number;

  @ApiProperty({
    example: 0.05,
    description: 'Price per unit (page/copy)',
  })
  @IsNumber()
  preco_unidade: number;

  @ApiProperty({
    example: 150.00,
    description: 'Total franchise value',
  })
  @IsNumber()
  valor: number;
}
