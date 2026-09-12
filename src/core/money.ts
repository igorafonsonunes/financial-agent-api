export class Money {
  static fromDecimal(value: string | number): number {
    const normalized = Number(value);
    if (!Number.isFinite(normalized)) {
      throw new Error(`Invalid monetary value: ${value}`);
    }

    return Math.round(normalized * 100);
  }

  static toDecimal(cents: number): string {
    return (cents / 100).toFixed(2);
  }

  static add(...values: number[]): number {
    return values.reduce((total, value) => total + Number(value), 0);
  }

  static subtract(left: number, right: number): number {
    return left - right;
  }

  static percentage(part: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Number(((part / total) * 100).toFixed(2));
  }
}
