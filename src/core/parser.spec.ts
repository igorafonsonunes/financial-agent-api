import { InterCsvParser, NubankCsvParser } from './parser';

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
      metadata: {
        bankTransactionId: 'abc-1',
      },
    });
    expect(rows[1]).toMatchObject({
      date: new Date('2024-09-05T00:00:00.000Z'),
      originalDescription: 'Supermercado',
      amountCents: -421708,
      type: 'DEBIT',
      metadata: {
        bankTransactionId: 'txn-2',
      },
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
      metadata: {
        rawBalanceCents: 250000,
      },
    });
    expect(rows[0].metadata.bankTransactionId).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[1]).toMatchObject({
      originalDescription: 'SALARIO - Recebimento',
      amountCents: 125000,
      type: 'CREDIT',
      metadata: {
        rawBalanceCents: 375000,
      },
    });
  });
});
