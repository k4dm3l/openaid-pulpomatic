import dotenv from 'dotenv';

dotenv.config();

export default {
  ENVIRONMENT: process.env.ENVIRONMENT || 'DEVELOPMENT',
  PORT: process.env.PORT || 3003,
  CORS: process.env.CORS || '*',
  MONGO_URI_PRODUCTION: process.env.MONGO_URI_PRODUCTION || '',
  MONGO_URI_STAGING: process.env.MONGO_URI_STAGING || '',
  MONGO_URI_DEVELOP: process.env.MONGO_URI_DEVELOP || '',
  REDIS_URI_PRODUCTION: process.env.REDIS_URI_PRODUCTION || '',
  REDIS_URI_STAGING: process.env.REDIS_URI_STAGING || '',
  REDIS_URI_DEVELOP: process.env.REDIS_URI_DEVELOP || '',
  AUTH_SECRET: process.env.AUTH_SECRET || '',
  TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || '',
  CRYPTO_SECRET: process.env.CRYPTO_SECRET || '',
  OPENAID: process.env.OPENAID || '',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
};
