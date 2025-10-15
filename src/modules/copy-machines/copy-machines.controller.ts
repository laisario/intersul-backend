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
import { CopyMachinesService } from './copy-machines.service';
import { CreateCopyMachineCatalogDto } from './dto/create-copy-machine-catalog.dto';
import { UpdateCopyMachineCatalogDto } from './dto/update-copy-machine-catalog.dto';
import { CreateClientCopyMachineDto } from './dto/create-client-copy-machine.dto';
import { UpdateClientCopyMachineDto } from './dto/update-client-copy-machine.dto';
import { CopyMachineCatalog } from './entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from './entities/client-copy-machine.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Copy Machines')
@Controller('copy-machines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CopyMachinesController {
  constructor(private readonly copyMachinesService: CopyMachinesService) {}

  // Catalog Copy Machine endpoints
  @Post('catalog')
  @ApiOperation({ summary: 'Create a new catalog copy machine' })
  @ApiResponse({ status: 201, description: 'Catalog copy machine created successfully', type: CopyMachineCatalog })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createCatalog(@Body() createCopyMachineCatalogDto: CreateCopyMachineCatalogDto): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.createCatalog(createCopyMachineCatalogDto);
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Get all catalog copy machines' })
  @ApiResponse({ status: 200, description: 'List of all catalog copy machines', type: [CopyMachineCatalog] })
  async findAllCatalog(): Promise<CopyMachineCatalog[]> {
    return this.copyMachinesService.findAllCatalog();
  }

  @Get('catalog/:id')
  @ApiOperation({ summary: 'Get catalog copy machine by ID' })
  @ApiResponse({ status: 200, description: 'Catalog copy machine found', type: CopyMachineCatalog })
  @ApiResponse({ status: 404, description: 'Catalog copy machine not found' })
  async findOneCatalog(@Param('id', ParseIntPipe) id: number): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.findOneCatalog(id);
  }

  @Patch('catalog/:id')
  @ApiOperation({ summary: 'Update catalog copy machine' })
  @ApiResponse({ status: 200, description: 'Catalog copy machine updated successfully', type: CopyMachineCatalog })
  @ApiResponse({ status: 404, description: 'Catalog copy machine not found' })
  async updateCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCopyMachineCatalogDto: UpdateCopyMachineCatalogDto,
  ): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.updateCatalog(id, updateCopyMachineCatalogDto);
  }

  @Delete('catalog/:id')
  @ApiOperation({ summary: 'Delete catalog copy machine' })
  @ApiResponse({ status: 200, description: 'Catalog copy machine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Catalog copy machine not found' })
  async removeCatalog(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.removeCatalog(id);
  }

  // Client Copy Machine endpoints
  @Post('client')
  @ApiOperation({ summary: 'Create a new client copy machine' })
  @ApiResponse({ status: 201, description: 'Client copy machine created successfully', type: ClientCopyMachine })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createClientCopyMachine(@Body() createClientCopyMachineDto: CreateClientCopyMachineDto): Promise<ClientCopyMachine> {
    return this.copyMachinesService.createClientCopyMachine(createClientCopyMachineDto);
  }

  @Get('client')
  @ApiOperation({ summary: 'Get all client copy machines' })
  @ApiResponse({ status: 200, description: 'List of all client copy machines', type: [ClientCopyMachine] })
  async findAllClientCopyMachines(): Promise<ClientCopyMachine[]> {
    return this.copyMachinesService.findAllClientCopyMachines();
  }

  @Get('client/:id')
  @ApiOperation({ summary: 'Get client copy machine by ID' })
  @ApiResponse({ status: 200, description: 'Client copy machine found', type: ClientCopyMachine })
  @ApiResponse({ status: 404, description: 'Client copy machine not found' })
  async findOneClientCopyMachine(@Param('id', ParseIntPipe) id: number): Promise<ClientCopyMachine> {
    return this.copyMachinesService.findOneClientCopyMachine(id);
  }

  @Patch('client/:id')
  @ApiOperation({ summary: 'Update client copy machine' })
  @ApiResponse({ status: 200, description: 'Client copy machine updated successfully', type: ClientCopyMachine })
  @ApiResponse({ status: 404, description: 'Client copy machine not found' })
  async updateClientCopyMachine(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientCopyMachineDto: UpdateClientCopyMachineDto,
  ): Promise<ClientCopyMachine> {
    return this.copyMachinesService.updateClientCopyMachine(id, updateClientCopyMachineDto);
  }

  @Delete('client/:id')
  @ApiOperation({ summary: 'Delete client copy machine' })
  @ApiResponse({ status: 200, description: 'Client copy machine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client copy machine not found' })
  async removeClientCopyMachine(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.removeClientCopyMachine(id);
  }

  @Get('client/by-client/:clientId')
  @ApiOperation({ summary: 'Get all copy machines for a specific client' })
  @ApiResponse({ status: 200, description: 'List of client copy machines', type: [ClientCopyMachine] })
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number): Promise<ClientCopyMachine[]> {
    return this.copyMachinesService.findByClient(clientId);
  }
}
