import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateImportDto } from './dto/create-import.dto';
import { ImportsService } from './imports.service';

@ApiTags('imports')
@Controller('imports')
export class ImportsController {
  constructor(private readonly service: ImportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 8 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Create import record and parse a CSV' })
  create(@Body() dto: CreateImportDto, @UploadedFile() file?: { buffer: Buffer; originalname: string }) {
    return this.service.createImport({
      ...dto,
      filename: file?.originalname ?? dto.filename,
      content: file ? file.buffer.toString('base64') : dto.content ?? '',
    });
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
