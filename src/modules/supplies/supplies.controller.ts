import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Supplies')
@Controller('supplies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supply item' })
  @ApiResponse({ status: 201, description: 'Supply created successfully', type: Supply })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply> {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supplies' })
  @ApiResponse({ status: 200, description: 'List of all supplies', type: [Supply] })
  async findAll(): Promise<Supply[]> {
    return this.suppliesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supply by ID' })
  @ApiResponse({ status: 200, description: 'Supply found', type: Supply })
  @ApiResponse({ status: 404, description: 'Supply not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Supply> {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supply' })
  @ApiResponse({ status: 200, description: 'Supply updated successfully', type: Supply })
  @ApiResponse({ status: 404, description: 'Supply not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ): Promise<Supply> {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update supply stock quantity' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully', type: Supply })
  @ApiResponse({ status: 404, description: 'Supply not found' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ): Promise<Supply> {
    return this.suppliesService.updateStock(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supply' })
  @ApiResponse({ status: 200, description: 'Supply deleted successfully' })
  @ApiResponse({ status: 404, description: 'Supply not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.suppliesService.remove(id);
  }
}
