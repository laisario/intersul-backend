import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Client name',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'Client CNPJ',
    required: false,
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'Client CPF',
    required: false,
  })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiProperty({
    example: '123 Main St, City, State',
    description: 'Client address',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Client phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'client@example.com',
    description: 'Client email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
