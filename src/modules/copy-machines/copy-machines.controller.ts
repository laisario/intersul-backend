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
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
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

  private slugify(value: string): string {
    return (value || '')
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
  }

  private resolveExtension(file: Express.Multer.File): string {
    const fromName = path.extname(file.originalname || '')
    if (fromName) return fromName;
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    return map[file.mimetype] || '.jpg';
  }

  // Catalog Copy Machine endpoints
  
  @Post('catalog')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiOperation({ summary: 'Criar uma nova máquina copiadora do catálogo' })
  @ApiResponse({ status: 201, description: 'Máquina copiadora do catálogo criada com sucesso', type: CopyMachineCatalog })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async createCatalog(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createCopyMachineCatalogDto: CreateCopyMachineCatalogDto,
  ): Promise<CopyMachineCatalog> {
    console.log('[CREATE] Received file:', file ? { name: file.originalname, size: file.size, mime: file.mimetype } : 'NO FILE');
    console.log('[CREATE] Received DTO:', JSON.stringify(createCopyMachineCatalogDto, null, 2));
  
    if (file) {
      const uploadsDir = './uploads/copy-machines';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileExtension = this.resolveExtension(file);
      const manufacturer = this.slugify(createCopyMachineCatalogDto.manufacturer || '');
      const model = this.slugify(createCopyMachineCatalogDto.model || '');
      const base = [manufacturer, model].filter(Boolean).join('-') || 'machine';
      const fileName = `${base}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      createCopyMachineCatalogDto.file = `http://localhost:3000/uploads/copy-machines/${fileName}`;
    }
    return this.copyMachinesService.createCatalog(createCopyMachineCatalogDto);
  }

  @Get('catalog')
  @ApiOperation({ summary: 'Obter todas as máquinas copiadoras do catálogo' })
  @ApiResponse({ status: 200, description: 'Lista paginada de máquinas copiadoras do catálogo' })
  async findAllCatalog(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: CopyMachineCatalog[]; total: number; page: number; limit: number; totalPages: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.copyMachinesService.findAllCatalog(search, pageNum, limitNum);
  }

  @Get('catalog/:id')
  @ApiOperation({ summary: 'Obter máquina copiadora do catálogo por ID' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do catálogo encontrada', type: CopyMachineCatalog })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do catálogo não encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CopyMachineCatalog> {
    return this.copyMachinesService.findOneCatalog(id);
  }


  @Patch('catalog/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  @ApiOperation({ summary: 'Atualizar máquina copiadora do catálogo' })
  @ApiResponse({ status: 200, description: 'Máquina copiadora do catálogo atualizada com sucesso', type: CopyMachineCatalog })
  @ApiResponse({ status: 404, description: 'Máquina copiadora do catálogo não encontrada' })
  async updateCatalog(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() updateCopyMachineCatalogDto: UpdateCopyMachineCatalogDto,
  ): Promise<CopyMachineCatalog> {
 
    if (file) {
      const uploadsDir = './uploads/copy-machines';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileExtension = this.resolveExtension(file);
      const manufacturer = this.slugify(updateCopyMachineCatalogDto.manufacturer || '');
      const model = this.slugify(updateCopyMachineCatalogDto.model || '');
      const base = [manufacturer, model].filter(Boolean).join('-') || 'machine';
      const fileName = `${base}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      updateCopyMachineCatalogDto.file = `http://localhost:3000/uploads/copy-machines/${fileName}`;
    }
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

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload de imagem para máquina' })
  @ApiResponse({ status: 201, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  async uploadImage(@UploadedFile() file: any): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = './uploads/copy-machines';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Return the full URL path
    const imageUrl = `http://localhost:3000/uploads/copy-machines/${fileName}`;
    return { imageUrl };
  }
}
