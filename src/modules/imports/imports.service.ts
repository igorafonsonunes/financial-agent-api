import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CsvParserFactory } from '../../core/parser';
import { DeduplicationStrategy } from '../../core/deduplication';
import { CreateImportDto } from './dto/create-import.dto';
import { parseCaixaPdf } from '../../core/caixa-pdf';

@Injectable()
export class ImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createImport(dto: CreateImportDto) {
    const content = dto.content ?? '';
    const isPdf = dto.filename.toLowerCase().endsWith('.pdf');
    const parser = isPdf ? null : CsvParserFactory.create(dto.filename, content);
    const normalizedRows = isPdf ? await parseCaixaPdf(content) : await parser!.parse(content);
    const fileHash = createHash('sha256').update(content).digest('hex');

    const importRecord = await this.prisma.import.create({
      data: {
        accountId: dto.accountId,
        filename: dto.filename,
        parserType: isPdf ? 'CaixaPdfOcrParser' : parser!.constructor.name,
        fileHash,
        status: 'PROCESSING',
        totalRows: normalizedRows.length,
      },
    });

    let importedRows = 0;
    let duplicateRows = 0;
    let invalidRows = 0;

    for (const [index, row] of normalizedRows.entries()) {
      const description = row.originalDescription?.trim() || 'Sem descrição';
      const bankTransactionId = typeof row.metadata?.bankTransactionId === 'string'
        ? row.metadata.bankTransactionId
        : null;

      if (!row.date || !Number.isInteger(row.amountCents)) {
        invalidRows += 1;
        await this.prisma.rawImportRow.create({
          data: {
            importId: importRecord.id,
            rowNumber: index + 1,
            rawData: JSON.stringify(row),
            parsed: false,
            error: 'Invalid normalized transaction data',
          },
        });
        continue;
      }

      const signature = DeduplicationStrategy.signature({
        accountId: dto.accountId,
        date: row.date.toISOString().slice(0, 10),
        description,
        amountCents: row.amountCents,
        installmentCurrent: row.installment?.current,
        installmentTotal: row.installment?.total,
        bankTransactionId,
      });

      const existing = await this.prisma.transactionEntry.findFirst({
        where: { originalHash: signature },
        select: { id: true },
      });

      if (existing) {
        duplicateRows += 1;
        await this.prisma.rawImportRow.create({
          data: {
            importId: importRecord.id,
            rowNumber: index + 1,
            rawData: JSON.stringify(row),
            parsed: true,
            error: 'Duplicate transaction',
          },
        });
        continue;
      }

      const dbTransactionType = row.type === 'CREDIT' ? 'INCOME' : 'EXPENSE';
      const transaction = await this.prisma.financialTransaction.create({
        data: {
          type: dbTransactionType,
          description,
          normalizedDescription: description,
          displayName: description,
          totalAmountCents: row.amountCents,
          installmentTotal: row.installment?.total,
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
          rawData: JSON.stringify(row),
          parsed: true,
        },
      });

      importedRows += 1;
    }

    return this.prisma.import.update({
      where: { id: importRecord.id },
      data: {
        status: invalidRows > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
        importedRows,
        duplicateRows,
        invalidRows,
        completedAt: new Date(),
      },
    });
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
