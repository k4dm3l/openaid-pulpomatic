import mongoose from 'mongoose';
import supertest from 'supertest';
import serverConfig from '../app';
import Mongo from '../db/mongo';
import env from '../configs';
import { getDatabaseUrlMongo } from '../utils/libs/utils';

const api = supertest(serverConfig.app);
const mongoDb = new Mongo(getDatabaseUrlMongo(env.ENVIRONMENT || 'DEVELOPMENT'));

describe('Component - authentication', () => {
  test('Endpoint - Get session token - Ok credentials status code should be 201, content type JSON', async () => {
    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    await api.post('/api/v1/authentication/login')
      .send(credentials)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('Endpoint - Get session token - Bad credentials status code should be 400, content type JSON', async () => {
    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12',
    };

    await mongoDb.connectMongoDB();

    await api.post('/api/v1/authentication/login')
      .send(credentials)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('Endpoint - Get session token - Should return a object with a token property that is an String', async () => {
    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const response = await api.post('/api/v1/authentication/login').send(credentials);
    expect(response.body.data).toEqual(expect.objectContaining({
      token: expect.any(String),
    }));
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
