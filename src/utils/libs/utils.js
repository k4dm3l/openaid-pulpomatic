import env from '../../configs/index';
import logger from './logger';

const normalizePort = (port) => {
  const normalizedPort = parseInt(port, 10);

  if (Number.isNaN(normalizedPort)) {
    return port;
  }
  if (normalizedPort > 0) {
    return normalizedPort;
  }

  return false;
};

const handledFatalException = (error) => {
  logger.info(error);
  process.exit(1);
};

const getDatabaseUrlMongo = (environmet) => {
  let databaseURL = '';

  switch (environmet) {
    case 'PRODUCTION':
      databaseURL = env.MONGO_URI_PRODUCTION;
      break;

    case 'STAGING':
      databaseURL = env.MONGO_URI_STAGING;
      break;

    case 'DEVELOPMENT':
      databaseURL = env.MONGO_URI_DEVELOP;
      break;

    default:
      databaseURL = env.MONGO_URI_DEVELOP;
      break;
  }

  return databaseURL;
};

const getDatabaseUrlRedis = (environmet) => {
  let databaseURL = '';

  switch (environmet) {
    case 'PRODUCTION':
      databaseURL = env.REDIS_URI_PRODUCTION;
      break;

    case 'STAGING':
      databaseURL = env.REDIS_URI_STAGING;
      break;

    case 'DEVELOPMENT':
      databaseURL = env.REDIS_URI_DEVELOP;
      break;

    default:
      databaseURL = env.REDIS_URI_DEVELOP;
      break;
  }

  return databaseURL;
};

export {
  normalizePort,
  handledFatalException,
  getDatabaseUrlMongo,
  getDatabaseUrlRedis,
};
