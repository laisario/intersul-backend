import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateMaintenanceDto } from './maintenance/dto/create-maintenance.dto';
import { Service } from './entities/service.entity';
import { ServiceType } from '../../common/enums/service-type.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('maintenance')
  @ApiOperation({ summary: 'Create a maintenance service' })
  @ApiResponse({ status: 201, description: 'Maintenance service created successfully', type: Service })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Client or copy machine not found' })
  async createMaintenance(@Body() createMaintenanceDto: CreateMaintenanceDto): Promise<Service> {
    return this.servicesService.createMaintenance(createMaintenanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services with optional filters' })
  @ApiResponse({ status: 200, description: 'List of services', type: [Service] })
  @ApiQuery({ name: 'type', enum: ServiceType, required: false, description: 'Filter by service type' })
  @ApiQuery({ name: 'client_id', required: false, description: 'Filter by client ID' })
  @ApiQuery({ name: 'copy_machine_id', required: false, description: 'Filter by copy machine ID' })
  async findAll(
    @Query('type') type?: ServiceType,
    @Query('client_id') client_id?: number,
    @Query('copy_machine_id') copy_machine_id?: number,
  ): Promise<Service[]> {
    const filters: any = {};
    if (type) filters.type = type;
    if (client_id) filters.client_id = client_id;
    if (copy_machine_id) filters.copy_machine_id = copy_machine_id;

    return this.servicesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service found', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicesService.remove(id);
  }
}
