import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionEntryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTransaction(transactionId: string) {
    return this.prisma.transactionEntry.findMany({
      where: { financialTransactionId: transactionId },
      orderBy: { transactionDate: 'asc' },
    });
  }
}
