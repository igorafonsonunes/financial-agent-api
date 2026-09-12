"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialHealthCalculator = exports.TrendCalculator = exports.ComparisonCalculator = exports.InstallmentCalculator = exports.RecurringCalculator = exports.MerchantCalculator = exports.ProfileCalculator = exports.CategoryCalculator = exports.ExpenseCalculator = exports.IncomeCalculator = exports.BalanceCalculator = void 0;
class BalanceCalculator {
    static calculate(rows) {
        return rows.reduce((sum, row) => sum + row.amountCents, 0);
    }
}
exports.BalanceCalculator = BalanceCalculator;
class IncomeCalculator {
    static calculate(rows) {
        return rows
            .filter((row) => row.type === 'INCOME' || row.amountCents > 0)
            .reduce((sum, row) => sum + row.amountCents, 0);
    }
}
exports.IncomeCalculator = IncomeCalculator;
class ExpenseCalculator {
    static calculate(rows) {
        return rows
            .filter((row) => row.type === 'EXPENSE' || row.amountCents < 0)
            .reduce((sum, row) => sum + Math.abs(row.amountCents), 0);
    }
}
exports.ExpenseCalculator = ExpenseCalculator;
class CategoryCalculator {
    static aggregate(rows) {
        return rows.reduce((acc, row) => {
            const key = row.category ?? 'Uncategorized';
            acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
            return acc;
        }, {});
    }
}
exports.CategoryCalculator = CategoryCalculator;
class ProfileCalculator {
    static aggregate(rows) {
        return rows.reduce((acc, row) => {
            const key = row.profile ?? 'Unassigned';
            acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
            return acc;
        }, {});
    }
}
exports.ProfileCalculator = ProfileCalculator;
class MerchantCalculator {
    static aggregate(rows) {
        return rows.reduce((acc, row) => {
            const key = row.merchant ?? 'Unknown';
            acc[key] = (acc[key] ?? 0) + Math.abs(row.amountCents);
            return acc;
        }, {});
    }
}
exports.MerchantCalculator = MerchantCalculator;
class RecurringCalculator {
    static detect(rows) {
        return [...new Set(rows.map((row) => row.merchant ?? 'Unknown'))];
    }
}
exports.RecurringCalculator = RecurringCalculator;
class InstallmentCalculator {
    static activeInstallments(rows) {
        return rows.filter((row) => row.installmentCurrent && row.installmentTotal).length;
    }
}
exports.InstallmentCalculator = InstallmentCalculator;
class ComparisonCalculator {
    static diff(current, previous) {
        return current - previous;
    }
    static percentageChange(current, previous) {
        if (previous === 0) {
            return 0;
        }
        return Number((((current - previous) / previous) * 100).toFixed(2));
    }
}
exports.ComparisonCalculator = ComparisonCalculator;
class TrendCalculator {
    static trend(values) {
        return values;
    }
}
exports.TrendCalculator = TrendCalculator;
class FinancialHealthCalculator {
    static savingsRate(income, expenses) {
        if (income === 0) {
            return 0;
        }
        return Number((((income - expenses) / income) * 100).toFixed(2));
    }
}
exports.FinancialHealthCalculator = FinancialHealthCalculator;
//# sourceMappingURL=analytics.js.map