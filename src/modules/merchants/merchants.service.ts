import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMerchantDto) {
    return this.prisma.merchant.create({
      data: {
        name: dto.name,
        normalizedName: dto.normalizedName ?? dto.name,
        active: dto.active ?? true,
        notes: dto.notes,
      },
    });
  }

  findAll() {
    return this.prisma.merchant.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id } });
    if (!merchant) {
      throw new NotFoundException(`Merchant ${id} not found`);
    }
    return merchant;
  }

  async update(id: string, dto: UpdateMerchantDto) {
    await this.findOne(id);
    return this.prisma.merchant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.merchant.delete({ where: { id } });
  }
}
