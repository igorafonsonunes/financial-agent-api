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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.financialTransaction.create({
            data: {
                type: dto.type,
                description: dto.description,
                normalizedDescription: dto.normalizedDescription,
                displayName: dto.displayName,
                merchantId: dto.merchantId,
                installmentTotal: dto.installmentTotal,
                totalAmountCents: dto.totalAmountCents,
                currency: dto.currency ?? 'BRL',
                notes: dto.notes,
            },
        });
    }
    findAll() {
        return this.prisma.financialTransaction.findMany({
            orderBy: { createdAt: 'desc' },
            include: { entries: true },
        });
    }
    async findOne(id) {
        const transaction = await this.prisma.financialTransaction.findUnique({
            where: { id },
            include: { entries: true },
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction ${id} not found`);
        }
        return transaction;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.financialTransaction.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.financialTransaction.delete({ where: { id } });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map