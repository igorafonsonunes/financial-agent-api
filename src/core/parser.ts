import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import csv from 'csv-parser';

export type TransactionType = 'CREDIT' | 'DEBIT';

export interface InstallmentInfo {
  current: number;
  total: number;
}

export interface NormalizedTransaction {
  date: Date;
  originalDescription: string;
  amountCents: number;
  type: TransactionType;
  installment?: InstallmentInfo;
  metadata: Record<string, unknown>;
}

export interface CsvParser {
  canParse(fileName: string, sample: string): boolean;
  parse(content: string): Promise<NormalizedTransaction[]>;
}

abstract class BaseCsvParser implements CsvParser {
  protected abstract readonly delimiter: string;

  abstract canParse(fileName: string, sample: string): boolean;
  abstract parse(content: string): Promise<NormalizedTransaction[]>;

  protected parseDate(value: string): Date {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Transaction date is required');
    }

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (!Number.isNaN(date.getTime())) return date;
    }

    const brMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
    if (brMatch) {
      const [, day, month, year] = brMatch;
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (!Number.isNaN(date.getTime())) return date;
    }

    throw new Error(`Unsupported date format: ${trimmed}`);
  }

  protected parseDecimalToCents(value: string): number {
    const trimmed = (value ?? '0').trim();
    if (!trimmed) return 0;

    let normalized = trimmed.replace(/[^0-9,.-]/g, '');
    if (!normalized) return 0;

    if (normalized.includes('.') && normalized.includes(',')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else if (normalized.includes(',')) {
      normalized = normalized.replace(',', '.');
    }

    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) return 0;
    return Math.round(numeric * 100);
  }

  protected typeFromAmount(amountCents: number): TransactionType {
    return amountCents >= 0 ? 'CREDIT' : 'DEBIT';
  }

  protected async parseCsvRows(content: string): Promise<Record<string, string>[]> {
    const rows: Record<string, string>[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from([content])
        .pipe(
          csv({
            separator: this.delimiter,
            mapHeaders: ({ header }) => (header ? header.trim() : ''),
            mapValues: ({ value }) => (typeof value === 'string' ? value.trim() : value),
          }),
        )
        .on('data', (row) => rows.push(row as Record<string, string>))
        .on('end', resolve)
        .on('error', reject);
    });

    return rows;
  }
}

export class GenericCsvParser extends BaseCsvParser {
  protected readonly delimiter = ',';

  canParse(fileName: string, sample: string): boolean {
    return fileName.toLowerCase().endsWith('.csv') || sample.includes(',');
  }

  async parse(content: string): Promise<NormalizedTransaction[]> {
    const rows = await this.parseCsvRows(content);

    return rows.map((row, index) => {
      const values = Object.values(row);
      const date = this.parseDate(values[0] ?? '');
      const originalDescription = values[1]?.trim() || 'Unknown';
      const amountCents = this.parseDecimalToCents(values[2] ?? '0');

      return {
        date,
        originalDescription,
        amountCents,
        type: this.typeFromAmount(amountCents),
        metadata: { source: 'generic-csv', rowNumber: index + 2 },
      };
    });
  }
}

export class NubankCsvParser extends BaseCsvParser {
  protected readonly delimiter = ',';

  canParse(fileName: string, sample: string): boolean {
    return (
      fileName.toLowerCase().includes('nubank') ||
      sample.includes('Data,Valor,Identificador,Descrição')
    );
  }

  async parse(content: string): Promise<NormalizedTransaction[]> {
    const rows = await this.parseCsvRows(content);

    return rows
      .filter((row) => row['Data'] || row['Valor'])
      .map((row) => {
        const date = this.parseDate(row['Data'] ?? '');
        const amountCents = this.parseDecimalToCents(row['Valor'] ?? '0');
        const originalDescription = (row['Descrição'] ?? '').trim();
        const bankTransactionId = row['Identificador']?.trim();

        return {
          date,
          originalDescription,
          amountCents,
          type: this.typeFromAmount(amountCents),
          metadata: { bankTransactionId },
        };
      });
  }
}

export class InterCsvParser extends BaseCsvParser {
  protected readonly delimiter = ';';

  canParse(fileName: string, sample: string): boolean {
    return (
      fileName.toLowerCase().includes('inter') ||
      sample.includes('Data Lançamento') ||
      sample.includes('Data Lançamento;Histórico;Descrição;Valor;Saldo')
    );
  }

  async parse(content: string): Promise<NormalizedTransaction[]> {
    const lines = content.split(/\r?\n/);
    const startIndex = lines.findIndex((line) => line.trim().startsWith('Data Lançamento'));
    const csvSlice = startIndex >= 0 ? lines.slice(startIndex).join('\n') : content;
    const rows = await this.parseCsvRows(csvSlice);

    return rows
      .filter((row) => !!(row['Data Lançamento'] ?? row['Data']))
      .map((row) => {
        const dateValue = row['Data Lançamento'] ?? row['Data'] ?? '';
        const historicalValue = row['Histórico'] ?? '';
        const descriptionValue = row['Descrição'] ?? '';
        const originalDescription = [historicalValue, descriptionValue].filter(Boolean).join(' - ');
        const amountCents = this.parseDecimalToCents(row['Valor'] ?? '0');
        const rawBalanceCents = this.parseDecimalToCents(row['Saldo'] ?? '0');
        const date = this.parseDate(dateValue);
        const bankTransactionId = createHash('sha256')
          .update(`${dateValue}|${amountCents}|${originalDescription}|${rawBalanceCents}`)
          .digest('hex');

        return {
          date,
          originalDescription,
          amountCents,
          type: this.typeFromAmount(amountCents),
          metadata: {
            bankTransactionId,
            rawBalanceCents,
            historico: historicalValue,
            descricao: descriptionValue,
          },
        };
      });
  }
}

export class CsvParserFactory {
  static create(fileName = 'export.csv', sample = ''): CsvParser {
    if (new NubankCsvParser().canParse(fileName, sample)) return new NubankCsvParser();
    if (new InterCsvParser().canParse(fileName, sample)) return new InterCsvParser();
    return new GenericCsvParser();
  }
}
