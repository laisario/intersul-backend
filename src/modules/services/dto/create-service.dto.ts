import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Client ID',
  })
  @IsNumber()
  client_id: number;

  @ApiProperty({
    example: 1,
    description: 'Category ID',
  })
  @IsNumber()
  category_id: number;

  @ApiProperty({
    example: 1,
    description: 'Client Copy Machine ID (optional)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  client_copy_machine_id?: number;

  @ApiProperty({
    example: 'Service description',
    description: 'Service description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
