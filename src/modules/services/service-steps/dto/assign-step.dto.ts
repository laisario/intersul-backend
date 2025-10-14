import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignStepDto {
  @ApiProperty({
    example: 1,
    description: 'Employee ID to assign the step to',
  })
  @IsNumber()
  responsible_employee_id: number;
}
