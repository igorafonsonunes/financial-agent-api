import { PrismaService } from '../../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
export declare class MerchantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateMerchantDto): import(".prisma/client").Prisma.Prisma__MerchantClient<{
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        normalizedName: string | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        normalizedName: string | null;
        notes: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        normalizedName: string | null;
        notes: string | null;
    }>;
    update(id: string, dto: UpdateMerchantDto): Promise<{
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        normalizedName: string | null;
        notes: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        normalizedName: string | null;
        notes: string | null;
    }>;
}
