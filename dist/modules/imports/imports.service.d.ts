import { PrismaService } from '../../prisma/prisma.service';
import { CreateImportDto } from './dto/create-import.dto';
export declare class ImportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createImport(dto: CreateImportDto): Promise<{
        id: string;
        createdAt: Date;
        accountId: string;
        filename: string;
        parserType: string;
        fileHash: string | null;
        status: string;
        totalRows: number;
        importedRows: number;
        duplicateRows: number;
        invalidRows: number;
        completedAt: Date | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        accountId: string;
        filename: string;
        parserType: string;
        fileHash: string | null;
        status: string;
        totalRows: number;
        importedRows: number;
        duplicateRows: number;
        invalidRows: number;
        completedAt: Date | null;
    }[]>;
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
        rows: {
            error: string | null;
            id: string;
            createdAt: Date;
            importId: string;
            rowNumber: number;
            rawData: string;
            parsed: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        accountId: string;
        filename: string;
        parserType: string;
        fileHash: string | null;
        status: string;
        totalRows: number;
        importedRows: number;
        duplicateRows: number;
        invalidRows: number;
        completedAt: Date | null;
    }>;
}
