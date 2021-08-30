import axios from 'axios';
import { promisify } from 'util';
import boom from '@hapi/boom';

import env from '../../configs/index';
import logger from '../libs/logger';
import Redis from '../../db/redis';
import { getDatabaseUrlRedis } from '../libs/utils';

const redisDb = new Redis(getDatabaseUrlRedis(env.ENVIRONMENT || 'DEVELOPMENT'), env.REDIS_PASSWORD);

const filterCountryRequest = (countryCodeRequest, countryCodeList) => {
  const codeValidation = countryCodeList
    .find((countryCode) => countryCode.code === countryCodeRequest);
  if (codeValidation) return true;
  return false;
};

// eslint-disable-next-line
const validateCountryCode = async (req, res, next) => {
  const redisClient = redisDb.connectRedisDB();
  const redisGetAsync = promisify(redisClient.get).bind(redisClient);
  const redisSetAsync = promisify(redisClient.set).bind(redisClient);

  if (!redisClient) {
    logger.error(('Redis DB no connected'));

    const response = await axios.get(env.COUNTRY_CODE_LIST);

    if (!response || response.status !== 200) {
      logger.error('Error retriving country code list from API');
      next(boom.badRequest('Error retrieving country code list'));
    } else {
      const redisResult = await redisSetAsync('country-list', JSON.stringify(response.data.data), 'EX', Number(env.REDIS_EXPIRATION_TIME_COUNTRY_LIST));
      if (!redisResult || redisResult !== 'OK') {
        logger.error('Error redis connection');
      }

      if (!filterCountryRequest(req.query.country, response.data.data)) {
        next(boom.badRequest(`The Country code ${req.query.country} is no valide based on ISO 3166-1`));
      }

      next();
    }
  } else {
    const data = JSON.parse(await redisGetAsync('country-list'));

    if (!data) {
      const response = await axios.get(env.COUNTRY_CODE_LIST);

      if (!response || response.status !== 200) {
        logger.error('Error retriving country code list from API');
        next(boom.badRequest('Error retrieving country code list'));
      } else {
        const redisResult = await redisSetAsync('country-list', JSON.stringify(response.data.data), 'EX', Number(env.REDIS_EXPIRATION_TIME_COUNTRY_LIST));
        if (!redisResult || redisResult !== 'OK') {
          logger.error('Error redis connection');
        }

        if (!filterCountryRequest(req.query.country, response.data.data)) {
          next(boom.badRequest(`The Country code ${req.query.country} is no valide based on ISO 3166-1`));
        }

        next();
      }
    } else {
      if (!filterCountryRequest(req.query.country, data)) {
        next(boom.badRequest(`The Country code ${req.query.country} is no valide based on ISO 3166-1`));
      }

      next();
    }
  }
};

export default validateCountryCode;
