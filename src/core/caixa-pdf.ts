import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { NormalizedTransaction } from './parser';

const run = promisify(execFile);

function cents(value: string) { return Math.round(Number(value.replace(/\./g, '').replace(',', '.')) * 100); }

export function parseCaixaOcrText(text: string): NormalizedTransaction[] {
  return text.split(/\r?\n/).flatMap((line) => {
    const date = /^(\d{2}\/\d{2}\/\d{4})\s*-/.exec(line.trim());
    const amounts = [...line.matchAll(/(\d{1,3}(?:\.\d{3})*,\d{2})\s*([CD])\b/g)];
    if (!date || !amounts.length || /SALDO\s+DIA/i.test(line)) return [];
    const amount = amounts[Math.max(0, amounts.length - 2)] ?? amounts[0];
    const description = line.slice(date[0].length, amount.index).replace(/^\s*\d+\s*/, '').replace(/\s+/g, ' ').trim();
    if (!description || cents(amount[1]) === 0) return [];
    const [day, month, year] = date[1].split('/').map(Number);
    const signed = cents(amount[1]) * (amount[2] === 'D' ? -1 : 1);
    return [{ date: new Date(Date.UTC(year, month - 1, day)), originalDescription: description, amountCents: signed, type: signed < 0 ? 'DEBIT' : 'CREDIT', metadata: { source: 'caixa-pdf-ocr' } }];
  });
}

export async function parseCaixaPdf(content: string): Promise<NormalizedTransaction[]> {
  const dir = await mkdtemp(join(tmpdir(), 'financial-caixa-'));
  const input = join(dir, 'statement.pdf'); const prefix = join(dir, 'page');
  try {
    await import('node:fs/promises').then(({ writeFile }) => writeFile(input, Buffer.from(content, 'base64')));
    await run('pdftoppm', ['-r', '250', '-png', input, prefix]);
    const { stdout } = await run('sh', ['-c', `for f in ${prefix}-*.png; do tesseract "$f" stdout -l por 2>/dev/null; done`]);
    return parseCaixaOcrText(stdout);
  } finally { await rm(dir, { recursive: true, force: true }); }
}
