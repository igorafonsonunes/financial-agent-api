"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCaixaOcrText = parseCaixaOcrText;
exports.parseCaixaPdf = parseCaixaPdf;
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_util_1 = require("node:util");
const run = (0, node_util_1.promisify)(node_child_process_1.execFile);
function cents(value) { return Math.round(Number(value.replace(/\./g, '').replace(',', '.')) * 100); }
function parseCaixaOcrText(text) {
    return text.split(/\r?\n/).flatMap((line) => {
        const date = /^(\d{2}\/\d{2}\/\d{4})\s*-/.exec(line.trim());
        const amounts = [...line.matchAll(/(\d{1,3}(?:\.\d{3})*,\d{2})\s*([CD])\b/g)];
        if (!date || !amounts.length || /SALDO\s+DIA/i.test(line))
            return [];
        const amount = amounts[Math.max(0, amounts.length - 2)] ?? amounts[0];
        const description = line.slice(date[0].length, amount.index).replace(/^\s*\d+\s*/, '').replace(/\s+/g, ' ').trim();
        if (!description || cents(amount[1]) === 0)
            return [];
        const [day, month, year] = date[1].split('/').map(Number);
        const signed = cents(amount[1]) * (amount[2] === 'D' ? -1 : 1);
        return [{ date: new Date(Date.UTC(year, month - 1, day)), originalDescription: description, amountCents: signed, type: signed < 0 ? 'DEBIT' : 'CREDIT', metadata: { source: 'caixa-pdf-ocr' } }];
    });
}
async function parseCaixaPdf(content) {
    const dir = await (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'financial-caixa-'));
    const input = (0, node_path_1.join)(dir, 'statement.pdf');
    const prefix = (0, node_path_1.join)(dir, 'page');
    try {
        await Promise.resolve().then(() => __importStar(require('node:fs/promises'))).then(({ writeFile }) => writeFile(input, Buffer.from(content, 'base64')));
        await run('pdftoppm', ['-r', '250', '-png', input, prefix]);
        const { stdout } = await run('sh', ['-c', `for f in ${prefix}-*.png; do tesseract "$f" stdout -l por 2>/dev/null; done`]);
        return parseCaixaOcrText(stdout);
    }
    finally {
        await (0, promises_1.rm)(dir, { recursive: true, force: true });
    }
}
//# sourceMappingURL=caixa-pdf.js.map