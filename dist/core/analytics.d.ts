export interface TransactionLike {
    amountCents: number;
    type?: string;
    category?: string;
    profile?: string;
    merchant?: string;
    transactionDate?: Date | string;
}
export declare class BalanceCalculator {
    static calculate(rows: TransactionLike[]): number;
}
export declare class IncomeCalculator {
    static calculate(rows: TransactionLike[]): number;
}
export declare class ExpenseCalculator {
    static calculate(rows: TransactionLike[]): number;
}
export declare class CategoryCalculator {
    static aggregate(rows: TransactionLike[]): Record<string, number>;
}
export declare class ProfileCalculator {
    static aggregate(rows: TransactionLike[]): Record<string, number>;
}
export declare class MerchantCalculator {
    static aggregate(rows: TransactionLike[]): Record<string, number>;
}
export declare class RecurringCalculator {
    static detect(rows: TransactionLike[]): string[];
}
export declare class InstallmentCalculator {
    static activeInstallments(rows: Array<{
        amountCents: number;
        installmentCurrent?: number;
        installmentTotal?: number;
    }>): number;
}
export declare class ComparisonCalculator {
    static diff(current: number, previous: number): number;
    static percentageChange(current: number, previous: number): number;
}
export declare class TrendCalculator {
    static trend(values: number[]): number[];
}
export declare class FinancialHealthCalculator {
    static savingsRate(income: number, expenses: number): number;
}
