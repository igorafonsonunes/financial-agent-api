export enum RuleMatchType {
  EXACT = 'EXACT',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
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

export class RuleEngine {
  constructor(private readonly rules: CategorizationRule[]) {}

  evaluate(input: RuleInput): RuleEvaluation | null {
    const activeRules = this.rules
      .filter((rule) => rule.active)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    for (const rule of activeRules) {
      const candidate = [
        input.originalDescription,
        input.normalizedDescription,
        input.displayName,
        input.merchantName ?? '',
      ]
        .filter(Boolean)
        .find((value) => this.matchesRule(value, rule));

      if (candidate) {
        return {
          matchedRuleId: rule.id,
          categoryId: rule.categoryId,
          subcategoryId: rule.subcategoryId,
          profileId: rule.profileId,
          isEssential: rule.isEssential,
          displayName: rule.displayNameTemplate ?? input.displayName,
        };
      }
    }

    return null;
  }

  private matchesRule(value: string, rule: CategorizationRule): boolean {
    const haystack = value.trim();
    const needle = rule.pattern.trim();

    if (!haystack || !needle) {
      return false;
    }

    switch (rule.matchType) {
      case RuleMatchType.EXACT:
        return haystack.toUpperCase() === needle.toUpperCase();
      case RuleMatchType.CONTAINS:
        return haystack.toUpperCase().includes(needle.toUpperCase());
      case RuleMatchType.STARTS_WITH:
        return haystack.toUpperCase().startsWith(needle.toUpperCase());
      case RuleMatchType.ENDS_WITH:
        return haystack.toUpperCase().endsWith(needle.toUpperCase());
      default:
        return false;
    }
  }
}
