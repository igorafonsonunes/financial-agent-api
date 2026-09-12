export declare enum AccountTypeDto {
    CHECKING = "CHECKING",
    SAVINGS = "SAVINGS",
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH",
    INVESTMENT = "INVESTMENT",
    OTHER = "OTHER"
}
export declare class CreateAccountDto {
    name: string;
    institutionName?: string;
    type: AccountTypeDto;
    currency?: string;
    active?: boolean;
}
