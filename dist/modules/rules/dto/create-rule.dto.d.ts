export declare enum MatchTypeDto {
    EXACT = "EXACT",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH"
}
export declare class CreateRuleDto {
    name: string;
    description?: string;
    pattern: string;
    matchType: MatchTypeDto;
    merchantId?: string;
    categoryId?: string;
    subcategoryId?: string;
    profileId?: string;
    displayNameTemplate?: string;
    isEssential?: boolean;
    priority?: number;
    active?: boolean;
}
