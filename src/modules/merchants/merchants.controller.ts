import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly service: MerchantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create merchant' })
  create(@Body() dto: CreateMerchantDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List merchants' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update merchant' })
  update(@Param('id') id: string, @Body() dto: UpdateMerchantDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete merchant' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
