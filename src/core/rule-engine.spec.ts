import { RuleEngine, RuleMatchType } from './rule-engine';

describe('RuleEngine', () => {
  it('should prioritize more specific rules over generic ones', () => {
    const engine = new RuleEngine([
      {
        id: 'generic',
        name: 'IFOOD generic',
        description: 'Generic food rule',
        pattern: 'IFOOD',
        matchType: RuleMatchType.CONTAINS,
        categoryId: 'food',
        profileId: 'variable',
        priority: 10,
        active: true,
      },
      {
        id: 'specific',
        name: 'IFOOD pizza',
        description: 'Specific pizza rule',
        pattern: 'IFOOD*PIZZA',
        matchType: RuleMatchType.CONTAINS,
        categoryId: 'delivery',
        profileId: 'variable',
        priority: 100,
        active: true,
      },
    ]);

    const result = engine.evaluate({
      originalDescription: 'IFOOD*PIZZA',
      normalizedDescription: 'IFOOD',
      displayName: 'Ifood Pizza',
      merchantName: 'IFOOD',
    });

    expect(result.categoryId).toBe('delivery');
    expect(result.profileId).toBe('variable');
  });

  it('should not match inactive rules', () => {
    const engine = new RuleEngine([
      {
        id: 'inactive',
        name: 'Inactive rule',
        description: 'Disabled',
        pattern: 'MERCADO',
        matchType: RuleMatchType.CONTAINS,
        categoryId: 'grocery',
        profileId: 'variable',
        priority: 50,
        active: false,
      },
    ]);

    const result = engine.evaluate({
      originalDescription: 'MERCADO',
      normalizedDescription: 'MERCADO',
      displayName: 'Supermercado',
      merchantName: 'MERCADO',
    });

    expect(result).toBeNull();
  });
});
