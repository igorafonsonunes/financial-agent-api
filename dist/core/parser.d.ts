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
declare abstract class BaseCsvParser implements CsvParser {
    protected abstract readonly delimiter: string;
    abstract canParse(fileName: string, sample: string): boolean;
    abstract parse(content: string): Promise<NormalizedTransaction[]>;
    protected parseDate(value: string): Date;
    protected parseDecimalToCents(value: string): number;
    protected typeFromAmount(amountCents: number): TransactionType;
    protected parseCsvRows(content: string): Promise<Record<string, string>[]>;
}
export declare class GenericCsvParser extends BaseCsvParser {
    protected readonly delimiter = ",";
    canParse(fileName: string, sample: string): boolean;
    parse(content: string): Promise<NormalizedTransaction[]>;
}
export declare class NubankCsvParser extends BaseCsvParser {
    protected readonly delimiter = ",";
    canParse(fileName: string, sample: string): boolean;
    parse(content: string): Promise<NormalizedTransaction[]>;
}
export declare class InterCsvParser extends BaseCsvParser {
    protected readonly delimiter = ";";
    canParse(fileName: string, sample: string): boolean;
    parse(content: string): Promise<NormalizedTransaction[]>;
}
export declare class CsvParserFactory {
    static create(fileName?: string, sample?: string): CsvParser;
}
export {};
