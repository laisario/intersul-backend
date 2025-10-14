import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceStepsService } from './service-steps.service';
import { UpdateStepStatusDto } from './dto/update-step-status.dto';
import { AssignStepDto } from './dto/assign-step.dto';
import { ServiceStep } from '../entities/service-step.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Service Steps')
@Controller('steps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiceStepsController {
  constructor(private readonly serviceStepsService: ServiceStepsService) {}

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get all steps for a service' })
  @ApiResponse({ status: 200, description: 'List of service steps', type: [ServiceStep] })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getStepsByService(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<ServiceStep[]> {
    return this.serviceStepsService.findByServiceId(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get step by ID' })
  @ApiResponse({ status: 200, description: 'Service step found', type: ServiceStep })
  @ApiResponse({ status: 404, description: 'Step not found' })
  async getStep(@Param('id', ParseIntPipe) id: number): Promise<ServiceStep> {
    return this.serviceStepsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update step status' })
  @ApiResponse({ status: 200, description: 'Step status updated successfully', type: ServiceStep })
  @ApiResponse({ status: 404, description: 'Step not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStepStatusDto: UpdateStepStatusDto,
  ): Promise<ServiceStep> {
    return this.serviceStepsService.updateStatus(id, updateStepStatusDto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign employee to step' })
  @ApiResponse({ status: 200, description: 'Employee assigned successfully', type: ServiceStep })
  @ApiResponse({ status: 404, description: 'Step not found' })
  async assignEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignStepDto: AssignStepDto,
  ): Promise<ServiceStep> {
    return this.serviceStepsService.assignEmployee(id, assignStepDto);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update step notes' })
  @ApiResponse({ status: 200, description: 'Step notes updated successfully', type: ServiceStep })
  @ApiResponse({ status: 404, description: 'Step not found' })
  async updateNotes(
    @Param('id', ParseIntPipe) id: number,
    @Body('notes') notes: string,
  ): Promise<ServiceStep> {
    return this.serviceStepsService.updateNotes(id, notes);
  }
}
