"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvParserFactory = exports.InterCsvParser = exports.NubankCsvParser = exports.GenericCsvParser = void 0;
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
const csv_parser_1 = __importDefault(require("csv-parser"));
class BaseCsvParser {
    parseDate(value) {
        const trimmed = value.trim();
        const [day, month, year] = trimmed.split('/');
        const parsedDay = Number(day);
        const parsedMonth = Number(month) - 1;
        const parsedYear = Number(year);
        return new Date(Date.UTC(parsedYear, parsedMonth, parsedDay));
    }
    parseDecimalToCents(value) {
        const trimmed = (value ?? '0').trim();
        if (!trimmed) {
            return 0;
        }
        let normalized = trimmed.replace(/\s+/g, '');
        if (normalized.includes('.') && normalized.includes(',')) {
            normalized = normalized.replace(/\./g, '').replace(',', '.');
        }
        else if (normalized.includes(',')) {
            normalized = normalized.replace(',', '.');
        }
        const numeric = Number(normalized);
        if (!Number.isFinite(numeric)) {
            return 0;
        }
        return Math.round(numeric * 100);
    }
    parsePlainDecimalToCents(value) {
        const trimmed = (value ?? '0').trim();
        if (!trimmed) {
            return 0;
        }
        let normalized = trimmed.replace(/[^0-9,.-]/g, '');
        if (!normalized) {
            return 0;
        }
        if (normalized.includes('.') && normalized.includes(',')) {
            normalized = normalized.replace(/\./g, '').replace(',', '.');
        }
        else if (normalized.includes(',')) {
            normalized = normalized.replace(',', '.');
        }
        const numeric = Number(normalized);
        if (!Number.isFinite(numeric)) {
            return 0;
        }
        return Math.round(numeric * 100);
    }
    typeFromAmount(amountCents) {
        return amountCents >= 0 ? 'CREDIT' : 'DEBIT';
    }
    async parseCsvRows(content) {
        const rows = [];
        await new Promise((resolve, reject) => {
            node_stream_1.Readable.from([content])
                .pipe((0, csv_parser_1.default)({
                separator: this.delimiter,
                mapHeaders: ({ header }) => (header ? header.trim() : ''),
                mapValues: ({ value }) => (typeof value === 'string' ? value.trim() : value),
            }))
                .on('data', (row) => {
                rows.push(row);
            })
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });
        return rows;
    }
}
class GenericCsvParser extends BaseCsvParser {
    delimiter = ',';
    canParse(fileName, sample) {
        return fileName.toLowerCase().endsWith('.csv') || sample.includes(',');
    }
    async parse(content) {
        const lines = content
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
        if (lines.length === 0) {
            return [];
        }
        const rows = await this.parseCsvRows(content);
        return rows.slice(1).map((row) => {
            const dateValue = Object.values(row)[0] ?? new Date().toISOString();
            const originalDescription = Object.values(row)[1]?.trim() || 'Unknown';
            const amountValue = Object.values(row)[2] ?? '0';
            const amountCents = this.parsePlainDecimalToCents(amountValue);
            return {
                date: this.parseDate(dateValue),
                originalDescription,
                amountCents,
                type: this.typeFromAmount(amountCents),
                metadata: {
                    source: 'generic-csv',
                    rowNumber: rows.indexOf(row) + 2,
                },
            };
        });
    }
}
exports.GenericCsvParser = GenericCsvParser;
class NubankCsvParser extends BaseCsvParser {
    delimiter = ',';
    canParse(fileName, sample) {
        return (fileName.toLowerCase().includes('nubank') ||
            sample.includes('Data,Valor,Identificador,Descrição') ||
            sample.includes('Data,Valor'));
    }
    async parse(content) {
        const rows = await this.parseCsvRows(content);
        return rows
            .filter((row) => row['Data'] || row['Valor'])
            .map((row) => {
            const date = this.parseDate(row['Data'] ?? '');
            const amountCents = this.parsePlainDecimalToCents(row['Valor'] ?? '0');
            const originalDescription = (row['Descrição'] ?? '').trim();
            const bankTransactionId = row['Identificador']?.trim();
            return {
                date,
                originalDescription,
                amountCents,
                type: this.typeFromAmount(amountCents),
                metadata: {
                    bankTransactionId,
                },
            };
        });
    }
}
exports.NubankCsvParser = NubankCsvParser;
class InterCsvParser extends BaseCsvParser {
    delimiter = ';';
    canParse(fileName, sample) {
        return (fileName.toLowerCase().includes('inter') ||
            sample.includes('Data Lançamento') ||
            sample.includes('Data Lançamento;Histórico;Descrição;Valor;Saldo'));
    }
    async parse(content) {
        const lines = content.split(/\r?\n/);
        const startIndex = lines.findIndex((line) => line.trim().startsWith('Data Lançamento'));
        const csvSlice = startIndex >= 0 ? lines.slice(startIndex).join('\n') : content;
        const rows = await this.parseCsvRows(csvSlice);
        return rows
            .filter((row) => !!(row['Data Lançamento'] ?? row['Data']))
            .map((row) => {
            const dateValue = row['Data Lançamento'] ?? row['Data'] ?? '';
            const historicalValue = row['Histórico'] ?? '';
            const descriptionValue = row['Descrição'] ?? '';
            const originalDescription = [historicalValue, descriptionValue].filter(Boolean).join(' - ');
            const amountCents = this.parseDecimalToCents(row['Valor'] ?? '0');
            const rawBalanceCents = this.parseDecimalToCents(row['Saldo'] ?? '0');
            const date = this.parseDate(dateValue);
            const bankTransactionId = (0, node_crypto_1.createHash)('sha256')
                .update(`${dateValue}|${amountCents}|${originalDescription}|${rawBalanceCents}`)
                .digest('hex');
            return {
                date,
                originalDescription,
                amountCents,
                type: this.typeFromAmount(amountCents),
                metadata: {
                    bankTransactionId,
                    rawBalanceCents,
                    historico: historicalValue,
                    descricao: descriptionValue,
                },
            };
        });
    }
}
exports.InterCsvParser = InterCsvParser;
class CsvParserFactory {
    static create(fileName = 'export.csv', sample = '') {
        if (new NubankCsvParser().canParse(fileName, sample)) {
            return new NubankCsvParser();
        }
        if (new InterCsvParser().canParse(fileName, sample)) {
            return new InterCsvParser();
        }
        return new GenericCsvParser();
    }
}
exports.CsvParserFactory = CsvParserFactory;
//# sourceMappingURL=parser.js.map