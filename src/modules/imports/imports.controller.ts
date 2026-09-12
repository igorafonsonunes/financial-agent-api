import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateImportDto } from './dto/create-import.dto';
import { ImportsService } from './imports.service';

@ApiTags('imports')
@Controller('imports')
export class ImportsController {
  constructor(private readonly service: ImportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create import record and parse a CSV' })
  create(@Body() dto: CreateImportDto) {
    return this.service.createImport(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List imports' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get import by id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
