// import mongoose from 'mongoose';
import supertest from 'supertest';
import serverConfig from '../app';

const api = supertest(serverConfig.app);
// eslint-disable-next-line
const healthCheckMockInfo = {
  server: {
    os: 'Darwin Kernel Version 20.2.0: Wed Dec  2 20:40:21 PST 2020; root:xnu-7195.60.75~1/RELEASE_ARM64_T8101',
    host: 'Camilos-MacBook-Pro.local',
  },
  dbStatus: 'CONNECTED',
};

describe('Component - health-check', () => {
  beforeAll(() => {});

  test('status code should be 200', async () => {
    await api.get('/health-check')
      .expect(200);
  });

  test('content type should be application/json', async () => {
    await api.get('/health-check')
      .expect('Content-Type', /application\/json/);
  });

  test('body contain db and server status information', async () => {
    const response = await api.get('/health-check');
    expect(response.body.data).toEqual(expect.objectContaining({
      server: expect.objectContaining({
        os: expect.any(String),
        host: expect.any(String),
      }),
      dbStatus: expect.any(String),
    }));
  });

  test('db connection status should be equal CONNECTED or DISCONNECTED', async () => {
    const response = await api.get('/health-check');
    expect(response.body.data.dbStatus === 'CONNECTED' || response.body.data.dbStatus === 'DISCONNECTED').toBeTruthy();
  });
});
