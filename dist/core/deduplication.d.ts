export interface DeduplicationInput {
    accountId: string;
    date: string;
    description: string;
    amountCents: number;
    installmentCurrent?: number | null;
    installmentTotal?: number | null;
    bankTransactionId?: string | null;
}
export declare class DeduplicationStrategy {
    static signature(input: DeduplicationInput): string;
}
