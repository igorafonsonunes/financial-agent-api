import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly service;
    constructor(service: CategoriesService);
    create(dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        sortOrder: number;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        name: string;
        active: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        sortOrder: number;
    }>;
}
