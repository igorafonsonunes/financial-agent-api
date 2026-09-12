import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BalanceCalculator, ExpenseCalculator, IncomeCalculator, CategoryCalculator, ProfileCalculator, MerchantCalculator, ComparisonCalculator, FinancialHealthCalculator } from '../../core/analytics';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(period: { start: Date; end: Date }) {
    const transactions = await this.prisma.transactionEntry.findMany({
      where: {
        transactionDate: {
          gte: period.start,
          lte: period.end,
        },
      },
    });

    const summary = {
      income: IncomeCalculator.calculate(transactions.map((row: { amountCents: any; }) => ({ ...row, amountCents: row.amountCents }))),
      expenses: ExpenseCalculator.calculate(transactions.map((row: { amountCents: any; }) => ({ ...row, amountCents: row.amountCents }))),
      balance: BalanceCalculator.calculate(transactions.map((row: { amountCents: any; }) => ({ ...row, amountCents: row.amountCents }))),
      savingsRate: FinancialHealthCalculator.savingsRate(
        IncomeCalculator.calculate(transactions.map((row: { amountCents: any; }) => ({ ...row, amountCents: row.amountCents }))),
        ExpenseCalculator.calculate(transactions.map((row: { amountCents: any; }) => ({ ...row, amountCents: row.amountCents }))),
      ),
    };

    return {
      period: {
        start: period.start.toISOString().slice(0, 10),
        end: period.end.toISOString().slice(0, 10),
      },
      summary,
      expenses: {
        essential: 0,
        nonEssential: 0,
        fixed: 0,
        variable: 0,
      },
      categories: Object.entries(
        CategoryCalculator.aggregate(
          transactions.map((row: { amountCents: any; }) => ({ amountCents: row.amountCents, category: 'uncategorized' })),
        ),
      ).map(([category, amount]) => ({ category, amount })),
      profiles: ProfileCalculator.aggregate(
        transactions.map((row: { amountCents: any; }) => ({ amountCents: row.amountCents, profile: 'default' })),
      ),
      merchants: MerchantCalculator.aggregate(
        transactions.map((row: { amountCents: any; displayName: any; }) => ({ amountCents: row.amountCents, merchant: row.displayName ?? 'Unknown' })),
      ),
      recurring: [],
      installments: [],
      trends: [],
      insights: [],
    };
  }

  async getMonthly() {
    const rows = await this.prisma.transactionEntry.findMany();
    return rows.map((row: { transactionDate: { toISOString: () => string | any[]; }; amountCents: number; }) => ({
      month: row.transactionDate.toISOString().slice(0, 7),
      income: row.amountCents > 0 ? row.amountCents : 0,
      expense: row.amountCents < 0 ? Math.abs(row.amountCents) : 0,
      balance: row.amountCents,
    }));
  }

  async getCategories() {
    const rows = await this.prisma.transactionEntry.findMany();
    const grouped = CategoryCalculator.aggregate(
      rows.map((row: { amountCents: any; displayName: any; }) => ({ amountCents: row.amountCents, category: row.displayName ?? 'uncategorized' })),
    );

    return {
      data: Object.entries(grouped).map(([category, amount]) => ({
        category,
        amount,
        percentage: 0,
      })),
    };
  }

  async getComparison() {
    const rows = await this.prisma.transactionEntry.findMany();
    const current = rows.reduce((sum: any, row: { amountCents: any; }) => sum + row.amountCents, 0);
    const previous = rows.length ? rows[0].amountCents : 0;

    return {
      previous,
      current,
      difference: ComparisonCalculator.diff(current, previous),
      percentage: ComparisonCalculator.percentageChange(current, previous),
    };
  }
}
