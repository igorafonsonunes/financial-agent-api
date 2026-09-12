import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountsController {
    private readonly service;
    constructor(service: AccountsService);
    create(dto: CreateAccountDto): import(".prisma/client").Prisma.Prisma__AccountClient<{
        type: string;
        name: string;
        institutionName: string | null;
        currency: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        type: string;
        name: string;
        institutionName: string | null;
        currency: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        type: string;
        name: string;
        institutionName: string | null;
        currency: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateAccountDto): Promise<{
        type: string;
        name: string;
        institutionName: string | null;
        currency: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        type: string;
        name: string;
        institutionName: string | null;
        currency: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
