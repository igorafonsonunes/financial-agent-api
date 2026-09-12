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
exports.ImportsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const parser_1 = require("../../core/parser");
const deduplication_1 = require("../../core/deduplication");
let ImportsService = class ImportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createImport(dto) {
        const parser = parser_1.CsvParserFactory.create(dto.filename, dto.content || '');
        const normalizedRows = await parser.parse(dto.content || '');
        const fileHash = (0, node_crypto_1.createHash)('sha256').update(dto.content || '').digest('hex');
        const importRecord = await this.prisma.import.create({
            data: {
                accountId: dto.accountId,
                filename: dto.filename,
                parserType: parser.constructor.name,
                fileHash,
                status: 'COMPLETED',
                totalRows: normalizedRows.length,
                importedRows: normalizedRows.length,
            },
        });
        for (const [index, row] of normalizedRows.entries()) {
            const description = row.originalDescription || 'Sem descrição';
            const dbTransactionType = row.type === 'CREDIT' ? 'INCOME' : 'EXPENSE';
            const signature = deduplication_1.DeduplicationStrategy.signature({
                accountId: dto.accountId,
                date: row.date.toISOString().slice(0, 10),
                description,
                amountCents: row.amountCents,
                installmentCurrent: row.installment?.current,
                installmentTotal: row.installment?.total,
            });
            const existing = await this.prisma.transactionEntry.findFirst({
                where: { originalHash: signature },
            });
            if (existing) {
                continue;
            }
            const transaction = await this.prisma.financialTransaction.create({
                data: {
                    type: dbTransactionType,
                    description,
                    normalizedDescription: description,
                    displayName: description,
                    totalAmountCents: row.amountCents,
                    currency: 'BRL',
                },
            });
            await this.prisma.transactionEntry.create({
                data: {
                    financialTransactionId: transaction.id,
                    accountId: dto.accountId,
                    importId: importRecord.id,
                    transactionDate: row.date,
                    postingDate: row.date,
                    originalDescription: description,
                    normalizedDescription: description,
                    displayName: description,
                    amountCents: row.amountCents,
                    currency: 'BRL',
                    entryType: row.type,
                    installmentCurrent: row.installment?.current,
                    installmentTotal: row.installment?.total,
                    originalHash: signature,
                },
            });
            await this.prisma.rawImportRow.create({
                data: {
                    importId: importRecord.id,
                    rowNumber: index + 1,
                    rawData: JSON.stringify({ description, amountCents: row.amountCents }),
                    parsed: true,
                },
            });
        }
        return importRecord;
    }
    findAll() {
        return this.prisma.import.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findOne(id) {
        const importRecord = await this.prisma.import.findUnique({
            where: { id },
            include: { rows: true, entries: true },
        });
        if (!importRecord) {
            throw new common_1.NotFoundException(`Import ${id} not found`);
        }
        return importRecord;
    }
};
exports.ImportsService = ImportsService;
exports.ImportsService = ImportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportsService);
//# sourceMappingURL=imports.service.js.map