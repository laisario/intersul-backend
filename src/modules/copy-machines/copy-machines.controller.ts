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
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { CopyMachineCatalog } from './entities/copy-machine-catalog.entity';
import { ClientCopyMachine } from './entities/client-copy-machine.entity';
import { Franchise } from './entities/franchise.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Máquinas Copiadoras')
@Controller('copy-machines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CopyMachinesController {
  constructor(private readonly copyMachinesService: CopyMachinesService) {}

  // Catalog Copy Machine endpoints
  @Post('catalog')
  @ApiOperation({ summary: 'Criar uma nova máquina copiadora do catálogo' })
  @ApiResponse({ status: 201, description: 'Máquina copiadora do catálogo criada com sucesso', type: CopyMachineCatalog })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async createCatalog(@Body() createCopyMachineCatalogDto: CreateCopyMachineCatalogDto): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.createCatalog(createCopyMachineCatalogDto);
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Obter todas as máquinas copiadoras do catálogo' })
  @ApiResponse({ status: 200, description: 'Lista de todas as máquinas copiadoras do catálogo', type: [CopyMachineCatalog] })
  async findAllCatalog(): Promise<CopyMachineCatalog[]> {
    return this.copyMachinesService.findAllCatalog();
  }


  @Patch('catalog/:id')
  @ApiOperation({ summary: 'Atualizar máquina copiadora do catálogo' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do catálogo atualizada com sucesso', type: CopyMachineCatalog })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do catálogo não encontrada' })
  async updateCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCopyMachineCatalogDto: UpdateCopyMachineCatalogDto,
  ): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.updateCatalog(id, updateCopyMachineCatalogDto);
  }

  @Delete('catalog/:id')
  @ApiOperation({ summary: 'Excluir máquina copiadora do catálogo' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do catálogo excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do catálogo não encontrada' })
  async removeCatalog(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.removeCatalog(id);
  }

  // Client Copy Machine endpoints
  @Post('client')
  @ApiOperation({ summary: 'Criar uma nova máquina copiadora do cliente' })
  @ApiResponse({ status: 201, description: 'Máquina copiadora do cliente criada com sucesso', type: ClientCopyMachine })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async createClientCopyMachine(@Body() createClientCopyMachineDto: CreateClientCopyMachineDto): Promise<ClientCopyMachine> {
    return this.copyMachinesService.createClientCopyMachine(createClientCopyMachineDto);
  }

  @Patch('client/:id')
  @ApiOperation({ summary: 'Atualizar máquina copiadora do cliente' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do cliente atualizada com sucesso', type: ClientCopyMachine })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do cliente não encontrada' })
  async updateClientCopyMachine(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientCopyMachineDto: UpdateClientCopyMachineDto,
  ): Promise<ClientCopyMachine> {
    return this.copyMachinesService.updateClientCopyMachine(id, updateClientCopyMachineDto);
  }

  @Delete('client/:id')
  @ApiOperation({ summary: 'Excluir máquina copiadora do cliente' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do cliente excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do cliente não encontrada' })
  async removeClientCopyMachine(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.removeClientCopyMachine(id);
  }

  @Get('client/by-client/:clientId')
  @ApiOperation({ summary: 'Obter todas as máquinas copiadoras de um cliente específico' })
  @ApiResponse({ status: 200, description: 'Lista de máquinas copiadoras do cliente', type: [ClientCopyMachine] })
  async findByClient(@Param('clientId', ParseIntPipe) clientId: number): Promise<ClientCopyMachine[]> {
    return this.copyMachinesService.findByClient(clientId);
  }

  // Franchise endpoints
  @Post('franchise')
  @ApiOperation({ summary: 'Criar um novo plano de franquia' })
  @ApiResponse({ status: 201, description: 'Plano de franquia criado com sucesso', type: Franchise })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async createFranchise(@Body() createFranchiseDto: CreateFranchiseDto): Promise<Franchise> {
    return this.copyMachinesService.createFranchise(createFranchiseDto);
  }

  @Get('franchise')
  @ApiOperation({ summary: 'Obter todos os planos de franquia' })
  @ApiResponse({ status: 200, description: 'Lista de todos os planos de franquia', type: [Franchise] })
  async findAllFranchises(): Promise<Franchise[]> {
    return this.copyMachinesService.findAllFranchises();
  }

  @Get('franchise/:id')
  @ApiOperation({ summary: 'Obter plano de franquia por ID' })
  @ApiResponse({ status: 200, description: 'Plano de franquia encontrado', type: Franchise })
  @ApiResponse({ status: 404, description: 'Plano de franquia não encontrado' })
  async findOneFranchise(@Param('id', ParseIntPipe) id: number): Promise<Franchise> {
    return this.copyMachinesService.findOneFranchise(id);
  }

  @Patch('franchise/:id')
  @ApiOperation({ summary: 'Atualizar plano de franquia' })
  @ApiResponse({ status: 200, description: 'Plano de franquia atualizado com sucesso', type: Franchise })
  @ApiResponse({ status: 404, description: 'Plano de franquia não encontrado' })
  async updateFranchise(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFranchiseDto: UpdateFranchiseDto,
  ): Promise<Franchise> {
    return this.copyMachinesService.updateFranchise(id, updateFranchiseDto);
  }

  @Delete('franchise/:id')
  @ApiOperation({ summary: 'Excluir plano de franquia' })
  @ApiResponse({ status: 200, description: 'Plano de franquia excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano de franquia não encontrado' })
  async removeFranchise(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.removeFranchise(id);
  }
}
