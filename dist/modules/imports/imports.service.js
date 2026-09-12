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
const caixa_pdf_1 = require("../../core/caixa-pdf");
let ImportsService = class ImportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createImport(dto) {
        const content = dto.content ?? '';
        const isPdf = dto.filename.toLowerCase().endsWith('.pdf');
        const parser = isPdf ? null : parser_1.CsvParserFactory.create(dto.filename, content);
        const normalizedRows = isPdf ? await (0, caixa_pdf_1.parseCaixaPdf)(content) : await parser.parse(content);
        const fileHash = (0, node_crypto_1.createHash)('sha256').update(content).digest('hex');
        const importRecord = await this.prisma.import.create({
            data: {
                accountId: dto.accountId,
                filename: dto.filename,
                parserType: isPdf ? 'CaixaPdfOcrParser' : parser.constructor.name,
                fileHash,
                status: 'PROCESSING',
                totalRows: normalizedRows.length,
            },
        });
        let importedRows = 0;
        let duplicateRows = 0;
        let invalidRows = 0;
        for (const [index, row] of normalizedRows.entries()) {
            const description = row.originalDescription?.trim() || 'Sem descrição';
            const bankTransactionId = typeof row.metadata?.bankTransactionId === 'string'
                ? row.metadata.bankTransactionId
                : null;
            if (!row.date || !Number.isInteger(row.amountCents)) {
                invalidRows += 1;
                await this.prisma.rawImportRow.create({
                    data: {
                        importId: importRecord.id,
                        rowNumber: index + 1,
                        rawData: JSON.stringify(row),
                        parsed: false,
                        error: 'Invalid normalized transaction data',
                    },
                });
                continue;
            }
            const signature = deduplication_1.DeduplicationStrategy.signature({
                accountId: dto.accountId,
                date: row.date.toISOString().slice(0, 10),
                description,
                amountCents: row.amountCents,
                installmentCurrent: row.installment?.current,
                installmentTotal: row.installment?.total,
                bankTransactionId,
            });
            const existing = await this.prisma.transactionEntry.findFirst({
                where: { originalHash: signature },
                select: { id: true },
            });
            if (existing) {
                duplicateRows += 1;
                await this.prisma.rawImportRow.create({
                    data: {
                        importId: importRecord.id,
                        rowNumber: index + 1,
                        rawData: JSON.stringify(row),
                        parsed: true,
                        error: 'Duplicate transaction',
                    },
                });
                continue;
            }
            const dbTransactionType = row.type === 'CREDIT' ? 'INCOME' : 'EXPENSE';
            const transaction = await this.prisma.financialTransaction.create({
                data: {
                    type: dbTransactionType,
                    description,
                    normalizedDescription: description,
                    displayName: description,
                    totalAmountCents: row.amountCents,
                    installmentTotal: row.installment?.total,
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
                    rawData: JSON.stringify(row),
                    parsed: true,
                },
            });
            importedRows += 1;
        }
        return this.prisma.import.update({
            where: { id: importRecord.id },
            data: {
                status: invalidRows > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
                importedRows,
                duplicateRows,
                invalidRows,
                completedAt: new Date(),
            },
        });
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