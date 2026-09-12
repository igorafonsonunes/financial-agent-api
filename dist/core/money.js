"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
class Money {
    static fromDecimal(value) {
        const normalized = Number(value);
        if (!Number.isFinite(normalized)) {
            throw new Error(`Invalid monetary value: ${value}`);
        }
        return Math.round(normalized * 100);
    }
    static toDecimal(cents) {
        return (cents / 100).toFixed(2);
    }
    static add(...values) {
        return values.reduce((total, value) => total + Number(value), 0);
    }
    static subtract(left, right) {
        return left - right;
    }
    static percentage(part, total) {
        if (total === 0) {
            return 0;
        }
        return Number(((part / total) * 100).toFixed(2));
    }
}
exports.Money = Money;
//# sourceMappingURL=money.js.map