import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { StepStatus } from '../../../common/enums/step-status.enum';

export class CreateStepDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  observation?: string;

  @IsDateString()
  @IsOptional()
  datetime_start?: string;

  @IsDateString()
  @IsOptional()
  datetime_conclusion?: string;

  @IsDateString()
  @IsOptional()
  datetime_expiration?: string;

  @IsEnum(StepStatus)
  @IsOptional()
  status?: StepStatus;

  @IsNumber()
  @IsOptional()
  responsable_id?: number;

  @IsString()
  @IsOptional()
  responsable_client?: string;

  @IsNumber()
  @IsOptional()
  service_id?: number;
}
