import mongoose from 'mongoose';
import supertest from 'supertest';
import serverConfig from '../app';
import Mongo from '../db/mongo';
import env from '../configs';
import { getDatabaseUrlMongo } from '../utils/libs/utils';

const api = supertest(serverConfig.app);
const mongoDb = new Mongo(getDatabaseUrlMongo(env.ENVIRONMENT || 'DEVELOPMENT'));

describe('Component - user', () => {
  test('Endpoint - Create User - If there is not bearer token should return status code 401', async () => {
    const newUser = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    await api.post('/api/v1/user').send(newUser)
      .expect('Content-Type', /application\/json/)
      .expect(401);
  });

  test('Endpoint - Create User - If username already exist should return status code 400', async () => {
    const newUser = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const responseLogin = await api.post('/api/v1/authentication/login').send(credentials);
    const { token } = responseLogin.body.data;

    await api.post('/api/v1/user').send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/)
      .expect(400);
  });

  test('Endpoint - Create User - If does not send username in the request should return 400', async () => {
    const newUser = {
      password: 'Aasdkjald12*',
    };

    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const responseLogin = await api.post('/api/v1/authentication/login').send(credentials);
    const { token } = responseLogin.body.data;

    await api.post('/api/v1/user').send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/)
      .expect(400);
  });

  test('Endpoint - Create User - If does not send password in the request should return 400', async () => {
    const newUser = {
      username: 'newUserTest',
    };

    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const responseLogin = await api.post('/api/v1/authentication/login').send(credentials);
    const { token } = responseLogin.body.data;

    await api.post('/api/v1/user').send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/)
      .expect(400);
  });

  test('Endpoint - Create User - If does not send a valid password (1 uppercase, 1 lowercase, 1 digit, 1 special character and at least 8 characters) in the request should return 400', async () => {
    const newUser = {
      username: 'newUserTest2',
      password: '123tes',
    };

    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const responseLogin = await api.post('/api/v1/authentication/login').send(credentials);
    const { token } = responseLogin.body.data;

    await api.post('/api/v1/user').send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/)
      .expect(400);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
