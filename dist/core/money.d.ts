export declare class Money {
    static fromDecimal(value: string | number): number;
    static toDecimal(cents: number): string;
    static add(...values: number[]): number;
    static subtract(left: number, right: number): number;
    static percentage(part: number, total: number): number;
}
