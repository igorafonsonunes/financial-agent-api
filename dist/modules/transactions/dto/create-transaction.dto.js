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
exports.CreateTransactionDto = exports.TransactionTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TransactionTypeDto;
(function (TransactionTypeDto) {
    TransactionTypeDto["EXPENSE"] = "EXPENSE";
    TransactionTypeDto["INCOME"] = "INCOME";
    TransactionTypeDto["TRANSFER"] = "TRANSFER";
    TransactionTypeDto["REFUND"] = "REFUND";
    TransactionTypeDto["ADJUSTMENT"] = "ADJUSTMENT";
    TransactionTypeDto["OTHER"] = "OTHER";
})(TransactionTypeDto || (exports.TransactionTypeDto = TransactionTypeDto = {}));
class CreateTransactionDto {
    type;
    description;
    normalizedDescription;
    displayName;
    merchantId;
    installmentTotal;
    totalAmountCents;
    currency;
    notes;
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TransactionTypeDto, example: TransactionTypeDto.EXPENSE }),
    (0, class_validator_1.IsEnum)(TransactionTypeDto),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Compra XYZ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 200),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'COMPRA XYZ' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "normalizedDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Compra XYZ 03/12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'merchant-id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "merchantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "installmentTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 125000 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "totalAmountCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BRL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Notas da operação' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
//# sourceMappingURL=create-transaction.dto.js.map