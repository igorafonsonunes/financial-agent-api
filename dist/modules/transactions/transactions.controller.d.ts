import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly service;
    constructor(service: TransactionsService);
    create(dto: CreateTransactionDto): import(".prisma/client").Prisma.Prisma__FinancialTransactionClient<{
        type: string;
        description: string;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        normalizedDescription: string | null;
        displayName: string | null;
        merchantId: string | null;
        installmentTotal: number | null;
        totalAmountCents: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        entries: {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            normalizedDescription: string | null;
            displayName: string | null;
            installmentTotal: number | null;
            financialTransactionId: string;
            accountId: string;
            importId: string | null;
            transactionDate: Date;
            postingDate: Date | null;
            originalDescription: string;
            amountCents: number;
            entryType: string;
            installmentCurrent: number | null;
            originalHash: string | null;
        }[];
    } & {
        type: string;
        description: string;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        normalizedDescription: string | null;
        displayName: string | null;
        merchantId: string | null;
        installmentTotal: number | null;
        totalAmountCents: number | null;
    })[]>;
    findOne(id: string): Promise<{
        entries: {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            normalizedDescription: string | null;
            displayName: string | null;
            installmentTotal: number | null;
            financialTransactionId: string;
            accountId: string;
            importId: string | null;
            transactionDate: Date;
            postingDate: Date | null;
            originalDescription: string;
            amountCents: number;
            entryType: string;
            installmentCurrent: number | null;
            originalHash: string | null;
        }[];
    } & {
        type: string;
        description: string;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        normalizedDescription: string | null;
        displayName: string | null;
        merchantId: string | null;
        installmentTotal: number | null;
        totalAmountCents: number | null;
    }>;
    update(id: string, dto: UpdateTransactionDto): Promise<{
        type: string;
        description: string;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        normalizedDescription: string | null;
        displayName: string | null;
        merchantId: string | null;
        installmentTotal: number | null;
        totalAmountCents: number | null;
    }>;
    remove(id: string): Promise<{
        type: string;
        description: string;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        normalizedDescription: string | null;
        displayName: string | null;
        merchantId: string | null;
        installmentTotal: number | null;
        totalAmountCents: number | null;
    }>;
}
