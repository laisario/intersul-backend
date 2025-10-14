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
import { CreateCopyMachineDto } from './dto/create-copy-machine.dto';
import { UpdateCopyMachineDto } from './dto/update-copy-machine.dto';
import { CopyMachine } from './entities/copy-machine.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Copy Machines')
@Controller('copy-machines')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CopyMachinesController {
  constructor(private readonly copyMachinesService: CopyMachinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new copy machine' })
  @ApiResponse({ status: 201, description: 'Copy machine created successfully', type: CopyMachine })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createCopyMachineDto: CreateCopyMachineDto): Promise<CopyMachine> {
    return this.copyMachinesService.create(createCopyMachineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all copy machines' })
  @ApiResponse({ status: 200, description: 'List of all copy machines', type: [CopyMachine] })
  async findAll(): Promise<CopyMachine[]> {
    return this.copyMachinesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get copy machine by ID' })
  @ApiResponse({ status: 200, description: 'Copy machine found', type: CopyMachine })
  @ApiResponse({ status: 404, description: 'Copy machine not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CopyMachine> {
    return this.copyMachinesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update copy machine' })
  @ApiResponse({ status: 200, description: 'Copy machine updated successfully', type: CopyMachine })
  @ApiResponse({ status: 404, description: 'Copy machine not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCopyMachineDto: UpdateCopyMachineDto,
  ): Promise<CopyMachine> {
    return this.copyMachinesService.update(id, updateCopyMachineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete copy machine' })
  @ApiResponse({ status: 200, description: 'Copy machine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Copy machine not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.copyMachinesService.remove(id);
  }
}
