import { Money } from './money';
import { DeduplicationStrategy } from './deduplication';

describe('Money', () => {
  it('should convert decimal to cents without floating precision issues', () => {
    expect(Money.fromDecimal('29.90')).toBe(2990);
    expect(Money.fromDecimal('1250.50')).toBe(125050);
    expect(Money.toDecimal(2990)).toBe('29.90');
  });

  it('should support arithmetic in integer cents', () => {
    expect(Money.add(2990, 125050)).toBe(128040);
    expect(Money.subtract(125050, 2990)).toBe(122060);
  });
});

describe('DeduplicationStrategy', () => {
  it('should differentiate installments and detect duplicates', () => {
    const same = DeduplicationStrategy.signature({
      accountId: 'acc-1',
      date: '2026-09-03',
      description: 'COMPRA XYZ 03/12',
      amountCents: 10000,
      installmentCurrent: 3,
      installmentTotal: 12,
    });

    const sameAgain = DeduplicationStrategy.signature({
      accountId: 'acc-1',
      date: '2026-09-03',
      description: 'COMPRA XYZ 03/12',
      amountCents: 10000,
      installmentCurrent: 3,
      installmentTotal: 12,
    });

    const differentInstallment = DeduplicationStrategy.signature({
      accountId: 'acc-1',
      date: '2026-09-04',
      description: 'COMPRA XYZ 04/12',
      amountCents: 10000,
      installmentCurrent: 4,
      installmentTotal: 12,
    });

    expect(same).toBe(sameAgain);
    expect(same).not.toBe(differentInstallment);
  });
});
