"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const analytics_1 = require("../../core/analytics");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(period) {
        const transactions = await this.prisma.transactionEntry.findMany({
            where: {
                transactionDate: {
                    gte: period.start,
                    lte: period.end,
                },
            },
        });
        const summary = {
            income: analytics_1.IncomeCalculator.calculate(transactions.map((row) => ({ ...row, amountCents: row.amountCents }))),
            expenses: analytics_1.ExpenseCalculator.calculate(transactions.map((row) => ({ ...row, amountCents: row.amountCents }))),
            balance: analytics_1.BalanceCalculator.calculate(transactions.map((row) => ({ ...row, amountCents: row.amountCents }))),
            savingsRate: analytics_1.FinancialHealthCalculator.savingsRate(analytics_1.IncomeCalculator.calculate(transactions.map((row) => ({ ...row, amountCents: row.amountCents }))), analytics_1.ExpenseCalculator.calculate(transactions.map((row) => ({ ...row, amountCents: row.amountCents })))),
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
            categories: Object.entries(analytics_1.CategoryCalculator.aggregate(transactions.map((row) => ({ amountCents: row.amountCents, category: 'uncategorized' })))).map(([category, amount]) => ({ category, amount })),
            profiles: analytics_1.ProfileCalculator.aggregate(transactions.map((row) => ({ amountCents: row.amountCents, profile: 'default' }))),
            merchants: analytics_1.MerchantCalculator.aggregate(transactions.map((row) => ({ amountCents: row.amountCents, merchant: row.displayName ?? 'Unknown' }))),
            recurring: [],
            installments: [],
            trends: [],
            insights: [],
        };
    }
    async getMonthly() {
        const rows = await this.prisma.transactionEntry.findMany();
        return rows.map((row) => ({
            month: row.transactionDate.toISOString().slice(0, 7),
            income: row.amountCents > 0 ? row.amountCents : 0,
            expense: row.amountCents < 0 ? Math.abs(row.amountCents) : 0,
            balance: row.amountCents,
        }));
    }
    async getCategories() {
        const rows = await this.prisma.transactionEntry.findMany();
        const grouped = analytics_1.CategoryCalculator.aggregate(rows.map((row) => ({ amountCents: row.amountCents, category: row.displayName ?? 'uncategorized' })));
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
        const current = rows.reduce((sum, row) => sum + row.amountCents, 0);
        const previous = rows.length ? rows[0].amountCents : 0;
        return {
            previous,
            current,
            difference: analytics_1.ComparisonCalculator.diff(current, previous),
            percentage: analytics_1.ComparisonCalculator.percentageChange(current, previous),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map