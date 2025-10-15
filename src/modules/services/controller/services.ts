import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from '../service/services';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services with optional filters' })
  @ApiResponse({ status: 200, description: 'List of services', type: [Service] })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by service category' })
  @ApiQuery({ name: 'client_id', required: false, description: 'Filter by client ID' })
  @ApiQuery({ name: 'client_copy_machine_id', required: false, description: 'Filter by client copy machine ID' })
  async findAll(
    @Query('category_id') category_id?: number,
    @Query('client_id') client_id?: number,
    @Query('client_copy_machine_id') client_copy_machine_id?: number,
  ): Promise<Service[]> {
    const filters: any = {};
    if (category_id) filters.category_id = category_id;
    if (client_id) filters.client_id = client_id;
    if (client_copy_machine_id) filters.client_copy_machine_id = client_copy_machine_id;

    return this.servicesService.findAll(filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: Service })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service found', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicesService.remove(id);
  }
}
