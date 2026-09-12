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
    const [day, month, year] = trimmed.split('/');
    const parsedDay = Number(day);
    const parsedMonth = Number(month) - 1;
    const parsedYear = Number(year);

    return new Date(Date.UTC(parsedYear, parsedMonth, parsedDay));
  }

  protected parseDecimalToCents(value: string): number {
    const trimmed = (value ?? '0').trim();
    if (!trimmed) {
      return 0;
    }

    let normalized = trimmed.replace(/\s+/g, '');
    if (normalized.includes('.') && normalized.includes(',')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else if (normalized.includes(',')) {
      normalized = normalized.replace(',', '.');
    }

    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) {
      return 0;
    }

    return Math.round(numeric * 100);
  }

  protected parsePlainDecimalToCents(value: string): number {
    const trimmed = (value ?? '0').trim();
    if (!trimmed) {
      return 0;
    }

    let normalized = trimmed.replace(/[^0-9,.-]/g, '');
    if (!normalized) {
      return 0;
    }

    if (normalized.includes('.') && normalized.includes(',')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else if (normalized.includes(',')) {
      normalized = normalized.replace(',', '.');
    }

    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) {
      return 0;
    }

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
        .on('data', (row) => {
          rows.push(row as Record<string, string>);
        })
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
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
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return [];
    }

    const rows = await this.parseCsvRows(content);

    return rows.slice(1).map((row) => {
      const dateValue = Object.values(row)[0] ?? new Date().toISOString();
      const originalDescription = Object.values(row)[1]?.trim() || 'Unknown';
      const amountValue = Object.values(row)[2] ?? '0';
      const amountCents = this.parsePlainDecimalToCents(amountValue);

      return {
        date: this.parseDate(dateValue),
        originalDescription,
        amountCents,
        type: this.typeFromAmount(amountCents),
        metadata: {
          source: 'generic-csv',
          rowNumber: rows.indexOf(row) + 2,
        },
      };
    });
  }
}

export class NubankCsvParser extends BaseCsvParser {
  protected readonly delimiter = ',';

  canParse(fileName: string, sample: string): boolean {
    return (
      fileName.toLowerCase().includes('nubank') ||
      sample.includes('Data,Valor,Identificador,Descrição') ||
      sample.includes('Data,Valor')
    );
  }

  async parse(content: string): Promise<NormalizedTransaction[]> {
    const rows = await this.parseCsvRows(content);

    return rows
      .filter((row) => row['Data'] || row['Valor'])
      .map((row) => {
        const date = this.parseDate(row['Data'] ?? '');
        const amountCents = this.parsePlainDecimalToCents(row['Valor'] ?? '0');
        const originalDescription = (row['Descrição'] ?? '').trim();
        const bankTransactionId = row['Identificador']?.trim();

        return {
          date,
          originalDescription,
          amountCents,
          type: this.typeFromAmount(amountCents),
          metadata: {
            bankTransactionId,
          },
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
    if (new NubankCsvParser().canParse(fileName, sample)) {
      return new NubankCsvParser();
    }

    if (new InterCsvParser().canParse(fileName, sample)) {
      return new InterCsvParser();
    }

    return new GenericCsvParser();
  }
}
