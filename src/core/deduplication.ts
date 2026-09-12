import { createHash } from 'node:crypto';

export interface DeduplicationInput {
  accountId: string;
  date: string;
  description: string;
  amountCents: number;
  installmentCurrent?: number | null;
  installmentTotal?: number | null;
}

export class DeduplicationStrategy {
  static signature(input: DeduplicationInput): string {
    const normalizedDescription = input.description
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ');

    const payload = {
      accountId: input.accountId,
      date: input.date,
      description: normalizedDescription,
      amountCents: input.amountCents,
      installmentCurrent: input.installmentCurrent ?? null,
      installmentTotal: input.installmentTotal ?? null,
    };

    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }
}
