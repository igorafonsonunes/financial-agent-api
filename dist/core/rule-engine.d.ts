export declare enum RuleMatchType {
    EXACT = "EXACT",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH"
}
export interface CategorizationRule {
    id: string;
    name: string;
    description?: string;
    pattern: string;
    matchType: RuleMatchType;
    merchantId?: string;
    categoryId?: string;
    subcategoryId?: string;
    profileId?: string;
    displayNameTemplate?: string;
    isEssential?: boolean;
    priority?: number;
    active: boolean;
}
export interface RuleInput {
    originalDescription: string;
    normalizedDescription: string;
    displayName: string;
    merchantName?: string;
}
export interface RuleEvaluation {
    matchedRuleId: string;
    categoryId?: string;
    subcategoryId?: string;
    profileId?: string;
    isEssential?: boolean;
    displayName?: string;
}
export declare class RuleEngine {
    private readonly rules;
    constructor(rules: CategorizationRule[]);
    evaluate(input: RuleInput): RuleEvaluation | null;
    private matchesRule;
}
