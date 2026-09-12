import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    dashboard(month?: string): Promise<{
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
    monthly(): Promise<{
        month: string | any[];
        income: number;
        expense: number;
        balance: number;
    }[]>;
    categories(): Promise<{
        data: {
            category: string;
            amount: number;
            percentage: number;
        }[];
    }>;
    comparison(): Promise<{
        previous: number;
        current: any;
        difference: number;
        percentage: number;
    }>;
}
