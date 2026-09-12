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
exports.CreateAccountDto = exports.AccountTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AccountTypeDto;
(function (AccountTypeDto) {
    AccountTypeDto["CHECKING"] = "CHECKING";
    AccountTypeDto["SAVINGS"] = "SAVINGS";
    AccountTypeDto["CREDIT_CARD"] = "CREDIT_CARD";
    AccountTypeDto["CASH"] = "CASH";
    AccountTypeDto["INVESTMENT"] = "INVESTMENT";
    AccountTypeDto["OTHER"] = "OTHER";
})(AccountTypeDto || (exports.AccountTypeDto = AccountTypeDto = {}));
class CreateAccountDto {
    name;
    institutionName;
    type;
    currency;
    active;
}
exports.CreateAccountDto = CreateAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Conta Corrente Nubank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Nubank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "institutionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AccountTypeDto, example: AccountTypeDto.CHECKING }),
    (0, class_validator_1.IsEnum)(AccountTypeDto),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BRL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAccountDto.prototype, "active", void 0);
//# sourceMappingURL=create-account.dto.js.map