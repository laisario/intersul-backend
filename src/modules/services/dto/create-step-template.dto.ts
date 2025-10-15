import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStepTemplateDto {
  @ApiProperty({
    example: 'Initial Assessment',
    description: 'Step name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Evaluate the machine condition',
    description: 'Step description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Check all components thoroughly',
    description: 'Step observation/notes',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Client contact person responsible for this step',
    required: false,
  })
  @IsString()
  @IsOptional()
  responsable_client?: string;
}
