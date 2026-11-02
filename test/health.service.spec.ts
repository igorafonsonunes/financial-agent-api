import { HealthService } from '../src/modules/health/health.service';

describe('HealthService', () => {
  it('reports the API and database as healthy', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };
    const service = new HealthService(prisma as never);

    await expect(service.check()).resolves.toEqual({
      status: 'ok',
      api: 'ok',
      database: 'ok',
    });
  });

  it('reports an unavailable database', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error('database unavailable')),
    };
    const service = new HealthService(prisma as never);

    await expect(service.check()).rejects.toMatchObject({
      status: 503,
      response: {
        status: 'error',
        api: 'ok',
        database: 'error',
      },
    });
  });
});
