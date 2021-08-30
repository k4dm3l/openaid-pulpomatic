import mongoose from 'mongoose';
import supertest from 'supertest';
import serverConfig from '../app';
import Mongo from '../db/mongo';
import env from '../configs';
import { getDatabaseUrlMongo } from '../utils/libs/utils';

const api = supertest(serverConfig.app);
const mongoDb = new Mongo(getDatabaseUrlMongo(env.ENVIRONMENT || 'DEVELOPMENT'));

describe('Component - pulpomatic-openaid', () => {
  test('Endpoint - Get Formated Information - Should return a object with the information of IRAQ and years from 2005 to 2009', async () => {
    const credentials = {
      username: 'test1',
      password: 'Aasdkjald12*',
    };

    await mongoDb.connectMongoDB();

    const responseLogin = await api.post('/api/v1/authentication/login').send(credentials);
    const { token } = responseLogin.body.data;

    const response = await api.get('/api/v1/pulpomatic-aid?country=IQ&year=2010')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    const expectResult = {
      2005: {
        AidData: 1009466541,
        'World Bank': 115065654,
        'Foreign, Commonwealth and Development Office': 33469482,
        'Ministry of Foreign Affairs of the Netherlands': 541368,
        Sweden: 22058663.431651007,
      },
      2006: {
        'World Bank': 190085979,
        'Foreign, Commonwealth and Development Office': 0,
        'Ministry of Foreign Affairs of the Netherlands': 2078472,
        Sweden: 626732.0529021668,
        AidData: 2923680608,
      },
      2007: {
        'UN-Habitat': 4000584,
        'World Bank': 116287090,
        'Bill and Melinda Gates Foundation': 10000000,
        Sweden: 2877483.970191422,
        AidData: 1350984097.86182,
        "InterAction's NGO Aid Map": 813890.33,
        GlobalGiving: 44408,
        'U.S. Agency for International Development': 2309504524.1499987,
        'European Commission - International Partnerships': 115000000,
        'Ministry of Foreign Affairs, Denmark': 5000000,
        'United Nations Development Programme': 108553799,
        'UNOCHA - Central Emergency Response Fund (CERF)': 7531949,
      },
      2008: {
        'UN-Habitat': 17906235,
        'World Bank': 172663387,
        'Australian Aid': 193598214,
        'Foreign Affairs, Trade and Development Canada (DFATD)': 14315395.98,
        'Ministry of Foreign Affairs, Finland': 8318888,
        'Foreign, Commonwealth and Development Office': 5802600,
        'Ministry of Foreign Affairs of the Netherlands': 1583678,
        Sweden: 14129928.613653235,
        AidData: 1431299618.8433,
        "InterAction's NGO Aid Map": 466067.37,
        GlobalGiving: 1332,
        'U.S. Agency for International Development': 21771031.54999999,
        'The federal government of the United States': 1370593.689999999,
        'Ministry of Foreign Affairs, Denmark': 5000000,
        'United Nations Development Programme': 23341711,
        'International Labour Organization': 2610822,
        'AICS - Italian Agency for Cooperation and Development': 21600000,
        'UNOCHA - Central Emergency Response Fund (CERF)': 11636655,
      },
      2009: {
        'UN-Habitat': 2127350,
        'Australian Aid': 84929330,
        'Foreign Affairs, Trade and Development Canada (DFATD)': 12600000,
        'Foreign, Commonwealth and Development Office': 20320334,
        'Ministry of Foreign Affairs of the Netherlands': 2370383,
        Sweden: 18506508.29192997,
        AidData: 1800735716,
        "InterAction's NGO Aid Map": 1812044.6600000001,
        'U.S. Agency for International Development': 950016313.0900005,
        'The federal government of the United States': -8591972.53,
        'European Commission - Service for Foreign Policy Instruments': 199596.41000000003,
        'Ministry of Foreign Affairs, Denmark': 140148236.35999998,
        'United Nations Development Programme': 63227754,
        'United Nations Industrial Development Organization': -213080.4800000001,
        'AICS - Italian Agency for Cooperation and Development': 7966630.860000003,
        'UNOCHA - Central Emergency Response Fund (CERF)': 1004837,
      },
    };

    expect(response.body.data).toMatchObject(expectResult);
  }, 30000);

  afterAll(() => {
    mongoose.connection.close();
  });
});
