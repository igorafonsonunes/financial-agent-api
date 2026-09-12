import { CsvParserFactory, GenericCsvParser, InterCsvParser, NubankCsvParser } from './parser';

describe('NubankCsvParser', () => {
  it('should parse Nubank CSV values into cents and keep credit/debit signal', async () => {
    const csv = [
      'Data,Valor,Identificador,Descrição',
      '28/08/2024,7500.00,abc-1,Salário',
      '05/09/2024,-4217.08,txn-2,Supermercado',
    ].join('\n');

    const rows = await new NubankCsvParser().parse(csv);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      date: new Date('2024-08-28T00:00:00.000Z'),
      originalDescription: 'Salário',
      amountCents: 750000,
      type: 'CREDIT',
      metadata: { bankTransactionId: 'abc-1' },
    });
    expect(rows[1]).toMatchObject({
      date: new Date('2024-09-05T00:00:00.000Z'),
      originalDescription: 'Supermercado',
      amountCents: -421708,
      type: 'DEBIT',
      metadata: { bankTransactionId: 'txn-2' },
    });
  });
});

describe('InterCsvParser', () => {
  it('should ignore noise lines and parse Brazilian decimal values correctly', async () => {
    const csv = [
      'Extrato Bancário',
      'Periodo: 01/09/2024 a 30/09/2024',
      '',
      'Banco Inter',
      '---',
      'Data Lançamento;Histórico;Descrição;Valor;Saldo',
      '03/09/2024;PIX ENVIADO;Mercado;4.994,61;2.500,00',
      '05/09/2024;SALARIO;Recebimento;1.250,00;3.750,00',
    ].join('\n');

    const rows = await new InterCsvParser().parse(csv);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      originalDescription: 'PIX ENVIADO - Mercado',
      amountCents: 499461,
      type: 'CREDIT',
      metadata: { rawBalanceCents: 250000 },
    });
    expect(rows[0].metadata.bankTransactionId).toMatch(/^[a-f0-9]{64}$/);
  });

  it('parses the current-account export layout produced by Banco Inter', async () => {
    const csv = [
      ' Extrato Conta Corrente ',
      'Conta ;16010809',
      'Período ;11/08/2026 a 11/09/2026',
      'Saldo ;0,00',
      '',
      'Data Lançamento;Histórico;Descrição;Valor;Saldo',
      '31/08/2026;Salário recebido - Portabilidade;;4.994,61;0,00',
      '31/08/2026;Pagamento efetuado;Pagamento Fatura;-432,32;-4.994,61',
      '31/08/2026;Pix enviado ;Igor Afonso Nunes;-4.562,29;-4.562,29',
    ].join('\n');

    const parser = CsvParserFactory.create('Inter-11-08-2026-a-11-09-2026-CSV.csv', csv);
    const rows = await parser.parse(csv);

    expect(parser).toBeInstanceOf(InterCsvParser);
    expect(rows).toHaveLength(3);
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({
        date: new Date('2026-08-31T00:00:00.000Z'),
        originalDescription: 'Salário recebido - Portabilidade',
        amountCents: 499461,
        type: 'CREDIT',
      }),
      expect.objectContaining({
        originalDescription: 'Pagamento efetuado - Pagamento Fatura',
        amountCents: -43232,
        type: 'DEBIT',
      }),
      expect.objectContaining({
        originalDescription: 'Pix enviado - Igor Afonso Nunes',
        amountCents: -456229,
        type: 'DEBIT',
      }),
    ]));
  });
});

describe('GenericCsvParser', () => {
  it('supports ISO dates and Brazilian-formatted amounts', async () => {
    const csv = [
      'date,description,amount',
      '2026-09-01,COMPRA XYZ,"1.234,56"',
    ].join('\n');

    const [row] = await new GenericCsvParser().parse(csv);

    expect(row.date.toISOString()).toBe('2026-09-01T00:00:00.000Z');
    expect(row.amountCents).toBe(123456);
    expect(row.type).toBe('CREDIT');
  });
});
