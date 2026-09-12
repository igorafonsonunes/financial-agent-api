import { PrismaService } from '../../prisma/prisma.service';
export declare class TransactionEntryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTransaction(transactionId: string): Promise<{
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
    }[]>;
}
