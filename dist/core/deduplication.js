"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeduplicationStrategy = void 0;
const node_crypto_1 = require("node:crypto");
class DeduplicationStrategy {
    static signature(input) {
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
        return (0, node_crypto_1.createHash)('sha256').update(JSON.stringify(payload)).digest('hex');
    }
}
exports.DeduplicationStrategy = DeduplicationStrategy;
//# sourceMappingURL=deduplication.js.map