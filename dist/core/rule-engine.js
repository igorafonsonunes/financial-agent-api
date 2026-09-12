"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = exports.RuleMatchType = void 0;
var RuleMatchType;
(function (RuleMatchType) {
    RuleMatchType["EXACT"] = "EXACT";
    RuleMatchType["CONTAINS"] = "CONTAINS";
    RuleMatchType["STARTS_WITH"] = "STARTS_WITH";
    RuleMatchType["ENDS_WITH"] = "ENDS_WITH";
})(RuleMatchType || (exports.RuleMatchType = RuleMatchType = {}));
class RuleEngine {
    rules;
    constructor(rules) {
        this.rules = rules;
    }
    evaluate(input) {
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
    matchesRule(value, rule) {
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
exports.RuleEngine = RuleEngine;
//# sourceMappingURL=rule-engine.js.map