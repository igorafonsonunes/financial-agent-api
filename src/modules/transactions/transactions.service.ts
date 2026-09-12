import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTransactionDto) {
    return this.prisma.financialTransaction.create({
      data: {
        type: dto.type,
        description: dto.description,
        normalizedDescription: dto.normalizedDescription,
        displayName: dto.displayName,
        merchantId: dto.merchantId,
        installmentTotal: dto.installmentTotal,
        totalAmountCents: dto.totalAmountCents,
        currency: dto.currency ?? 'BRL',
        notes: dto.notes,
      },
    });
  }

  findAll() {
    return this.prisma.financialTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { entries: true },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: { id },
      include: { entries: true },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    await this.findOne(id);
    return this.prisma.financialTransaction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.financialTransaction.delete({ where: { id } });
  }
}
