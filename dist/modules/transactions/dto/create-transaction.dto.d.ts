export declare enum TransactionTypeDto {
    EXPENSE = "EXPENSE",
    INCOME = "INCOME",
    TRANSFER = "TRANSFER",
    REFUND = "REFUND",
    ADJUSTMENT = "ADJUSTMENT",
    OTHER = "OTHER"
}
export declare class CreateTransactionDto {
    type: TransactionTypeDto;
    description: string;
    normalizedDescription?: string;
    displayName?: string;
    merchantId?: string;
    installmentTotal?: number;
    totalAmountCents: number;
    currency?: string;
    notes?: string;
}
