export interface TransactionLike {
  amountCents: number;
  type?: string;
  category?: string;
  profile?: string;
  merchant?: string;
  transactionDate?: Date | string;
}

export class BalanceCalculator {
  static calculate(rows: TransactionLike[]): number {
    return rows.reduce((sum, row) => sum + row.amountCents, 0);
  }
}

export class IncomeCalculator {
  static calculate(rows: TransactionLike[]): number {
    return rows
      .filter((row) => row.type === 'INCOME' || row.amountCents > 0)
      .reduce((sum, row) => sum + row.amountCents, 0);
  }
}

export class ExpenseCalculator {
  static calculate(rows: TransactionLike[]): number {
    return rows
      .filter((row) => row.type === 'EXPENSE' || row.amountCents < 0)
      .reduce((sum, row) => sum + Math.abs(row.amountCents), 0);
  }
}

export class CategoryCalculator {
  static aggregate(rows: TransactionLike[]): Record<string, number> {
    return rows.reduce<Record<string, number>>((acc, row) => {
      const key = row.category ?? 'Uncategorized';
      acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
      return acc;
    }, {});
  }
}

export class ProfileCalculator {
  static aggregate(rows: TransactionLike[]): Record<string, number> {
    return rows.reduce<Record<string, number>>((acc, row) => {
      const key = row.profile ?? 'Unassigned';
      acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
      return acc;
    }, {});
  }
}

export class MerchantCalculator {
  static aggregate(rows: TransactionLike[]): Record<string, number> {
    return rows.reduce<Record<string, number>>((acc, row) => {
      const key = row.merchant ?? 'Unknown';
      acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
      return acc;
    }, {});
  }
}

export class RecurringCalculator {
  static detect(rows: TransactionLike[]): string[] {
    return [...new Set(rows.map((row) => row.merchant ?? 'Unknown'))];
  }
}

export class InstallmentCalculator {
  static activeInstallments(rows: Array<{ amountCents: number; installmentCurrent?: number; installmentTotal?: number }>): number {
    return rows.filter((row) => row.installmentCurrent && row.installmentTotal).length;
  }
}

export class ComparisonCalculator {
  static diff(current: number, previous: number): number {
    return current - previous;
  }

  static percentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(2));
  }
}

export class TrendCalculator {
  static trend(values: number[]): number[] {
    return values;
  }
}

export class FinancialHealthCalculator {
  static savingsRate(income: number, expenses: number): number {
    if (income === 0) {
      return 0;
    }

    return Number((((income - expenses) / income) * 100).toFixed(2));
  }
}
