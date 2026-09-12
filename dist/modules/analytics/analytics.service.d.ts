import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(period: {
        start: Date;
        end: Date;
    }): Promise<{
        period: {
            start: string;
            end: string;
        };
        summary: {
            income: number;
            expenses: number;
            balance: number;
            savingsRate: number;
        };
        expenses: {
            essential: number;
            nonEssential: number;
            fixed: number;
            variable: number;
        };
        categories: Record<string, number>;
        profiles: Record<string, number>;
        merchants: Record<string, number>;
        recurring: never[];
        installments: never[];
        trends: never[];
        insights: never[];
    }>;
    getMonthly(): Promise<{
        month: string | any[];
        income: number;
        expense: number;
        balance: number;
    }[]>;
    getCategories(): Promise<{
        data: {
            category: string;
            amount: number;
            percentage: number;
        }[];
    }>;
    getComparison(): Promise<{
        previous: number;
        current: any;
        difference: number;
        percentage: number;
    }>;
}
