import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly service;
    constructor(service: ProfilesService);
    create(dto: CreateProfileDto): import(".prisma/client").Prisma.Prisma__ProfileClient<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProfileDto): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
