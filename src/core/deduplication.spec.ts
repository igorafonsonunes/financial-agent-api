import { DeduplicationStrategy } from './deduplication';

describe('DeduplicationStrategy', () => {
  it('generates the same signature for the same transaction', () => {
    const input = {
      accountId: 'account-1',
      date: '2026-09-01',
      description: '  IFOOD   TEST  ',
      amountCents: -2590,
      installmentCurrent: 1,
      installmentTotal: 3,
    };

    expect(DeduplicationStrategy.signature(input)).toBe(
      DeduplicationStrategy.signature({ ...input, description: 'IFOOD TEST' }),
    );
  });

  it('keeps installments distinct', () => {
    const base = {
      accountId: 'account-1',
      date: '2026-09-01',
      description: 'LOJA',
      amountCents: -10000,
    };

    expect(
      DeduplicationStrategy.signature({ ...base, installmentCurrent: 1, installmentTotal: 3 }),
    ).not.toBe(
      DeduplicationStrategy.signature({ ...base, installmentCurrent: 2, installmentTotal: 3 }),
    );
  });

  it('uses a bank transaction id when available', () => {
    const base = {
      accountId: 'account-1',
      date: '2026-09-01',
      description: 'TRANSFERENCIA',
      amountCents: 10000,
    };

    expect(
      DeduplicationStrategy.signature({ ...base, bankTransactionId: 'bank-1' }),
    ).not.toBe(
      DeduplicationStrategy.signature({ ...base, bankTransactionId: 'bank-2' }),
    );
  });
});
