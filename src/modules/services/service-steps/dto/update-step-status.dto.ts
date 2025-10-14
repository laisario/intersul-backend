import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StepStatus } from '../../../../common/enums/step-status.enum';

export class UpdateStepStatusDto {
  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: StepStatus,
    description: 'New step status',
  })
  @IsEnum(StepStatus)
  status: StepStatus;

  @ApiProperty({
    example: 'Started working on technical evaluation',
    description: 'Step notes',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
