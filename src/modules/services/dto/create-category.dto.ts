import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateStepTemplateDto } from './create-step-template.dto';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Maintenance',
    description: 'Category name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Regular maintenance services',
    description: 'Category description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [
      {
        name: 'Initial Assessment',
        description: 'Evaluate the machine condition',
        responsable_client: 'John Doe'
      },
      {
        name: 'Diagnosis',
        description: 'Identify the problem',
        observation: 'Check all components'
      }
    ],
    description: 'Template steps for this category',
    type: [CreateStepTemplateDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepTemplateDto)
  @IsOptional()
  steps?: CreateStepTemplateDto[];
}
