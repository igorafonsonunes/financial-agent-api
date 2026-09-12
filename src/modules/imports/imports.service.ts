import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CsvParserFactory } from '../../core/parser';
import { DeduplicationStrategy } from '../../core/deduplication';
import { CreateImportDto } from './dto/create-import.dto';

@Injectable()
export class ImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createImport(dto: CreateImportDto) {
    const parser = CsvParserFactory.create(dto.filename, dto.content || '');
    const normalizedRows = await parser.parse(dto.content || '');

    const fileHash = createHash('sha256').update(dto.content || '').digest('hex');

    const importRecord = await this.prisma.import.create({
      data: {
        accountId: dto.accountId,
        filename: dto.filename,
        parserType: parser.constructor.name,
        fileHash,
        status: 'COMPLETED',
        totalRows: normalizedRows.length,
        importedRows: normalizedRows.length,
      },
    });

    for (const [index, row] of normalizedRows.entries()) {
      const description = row.originalDescription || 'Sem descrição';
      const dbTransactionType = row.type === 'CREDIT' ? 'INCOME' : 'EXPENSE';
      const signature = DeduplicationStrategy.signature({
        accountId: dto.accountId,
        date: row.date.toISOString().slice(0, 10),
        description,
        amountCents: row.amountCents,
        installmentCurrent: row.installment?.current,
        installmentTotal: row.installment?.total,
      });

      const existing = await this.prisma.transactionEntry.findFirst({
        where: { originalHash: signature },
      });

      if (existing) {
        continue;
      }

      const transaction = await this.prisma.financialTransaction.create({
        data: {
          type: dbTransactionType,
          description,
          normalizedDescription: description,
          displayName: description,
          totalAmountCents: row.amountCents,
          currency: 'BRL',
        },
      });

      await this.prisma.transactionEntry.create({
        data: {
          financialTransactionId: transaction.id,
          accountId: dto.accountId,
          importId: importRecord.id,
          transactionDate: row.date,
          postingDate: row.date,
          originalDescription: description,
          normalizedDescription: description,
          displayName: description,
          amountCents: row.amountCents,
          currency: 'BRL',
          entryType: row.type,
          installmentCurrent: row.installment?.current,
          installmentTotal: row.installment?.total,
          originalHash: signature,
        },
      });

      await this.prisma.rawImportRow.create({
        data: {
          importId: importRecord.id,
          rowNumber: index + 1,
          rawData: JSON.stringify({ description, amountCents: row.amountCents }),
          parsed: true,
        },
      });
    }

    return importRecord;
  }

  findAll() {
    return this.prisma.import.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const importRecord = await this.prisma.import.findUnique({
      where: { id },
      include: { rows: true, entries: true },
    });

    if (!importRecord) {
      throw new NotFoundException(`Import ${id} not found`);
    }

    return importRecord;
  }
}
