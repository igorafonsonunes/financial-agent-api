import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRuleDto) {
    return this.prisma.categorizationRule.create({
      data: {
        name: dto.name,
        description: dto.description,
        pattern: dto.pattern,
        matchType: dto.matchType,
        merchantId: dto.merchantId,
        categoryId: dto.categoryId,
        subcategoryId: dto.subcategoryId,
        profileId: dto.profileId,
        displayNameTemplate: dto.displayNameTemplate,
        isEssential: dto.isEssential ?? false,
        priority: dto.priority ?? 0,
        active: dto.active ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.categorizationRule.findMany({ orderBy: { priority: 'desc' } });
  }

  async findOne(id: string) {
    const rule = await this.prisma.categorizationRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule ${id} not found`);
    }
    return rule;
  }

  async update(id: string, dto: UpdateRuleDto) {
    await this.findOne(id);
    return this.prisma.categorizationRule.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.categorizationRule.delete({ where: { id } });
  }
}
