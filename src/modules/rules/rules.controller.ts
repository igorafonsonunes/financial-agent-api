import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly service: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create categorization rule' })
  create(@Body() dto: CreateRuleDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List categorization rules' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get categorization rule' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update categorization rule' })
  update(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete categorization rule' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
