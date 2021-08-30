import axios from 'axios';
import boom from '@hapi/boom';
import { promisify } from 'util';

import env from '../../../../configs';
import { getDatabaseUrlRedis } from '../../../../utils/libs/utils';
import logger from '../../../../utils/libs/logger';
import Redis from '../../../../db/redis';
import reportDao from '../DAO';

const redisDb = new Redis(getDatabaseUrlRedis(env.ENVIRONMENT || 'DEVELOPMENT'), env.REDIS_PASSWORD);

/* eslint-disable */
const groupByOngName = (arrayResults, key = 'nameONG') => {
  return arrayResults.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
/* eslint-enable */

const calculateFormatedResults = (groupedResults) => {
  const ongNames = Object.keys(groupedResults);
  const mappedResult = {};

  ongNames.forEach((key) => {
    if (key.trim() !== '') {
      mappedResult[key] = 0;
      groupedResults[key].forEach((data) => {
        if (data.transactions && data.transactions.length) {
          data.transactions.forEach((transaction) => {
            if (transaction.value) {
              mappedResult[key] += Number(transaction.value.text);
            } else {
              const idsTransactions = Object.keys(transaction);
              if (Array.isArray(idsTransactions) && idsTransactions.length) {
                idsTransactions.forEach((id) => {
                  mappedResult[key] += Number(transaction[id].value.text);
                });
              }
            }
          });
        }
      });
    }
  });

  return mappedResult;
};

const getOpenAIDInformation = async ({
  countryCode, year, offset, limit,
}) => {
  const response = await axios.get(`${env.OPENAID}?offset=${offset}&&limit=${limit}&&recipient-country=${countryCode}&&start-date__lt=${year}-12-01&&start-date__gt=${year}-01-01`);

  if (!response || response.status !== 200) throw boom.badRequest('');
  return response.data;
};

const getOpenAIDTotalRecordsPerYear = async ({ country, year }) => {
  const data = await getOpenAIDInformation({
    countryCode: country,
    year,
    offset: 0,
    limit: 1,
  });

  return data['total-count'];
};

const getPulpomaticAIDPerYear = async ({ country, year }) => {
  const results = [];
  const promisesPagePerYear = [];

  const totalPages = Math.ceil(await getOpenAIDTotalRecordsPerYear({ country, year }) / 100);

  for (let i = 0; i < totalPages; i += 1) {
    let offset = 0;
    offset += 100;

    if (i === 0) {
      promisesPagePerYear.push(getOpenAIDInformation({
        countryCode: country,
        year,
        offset: 0,
        limit: 100,
      }));
    } else {
      promisesPagePerYear.push(getOpenAIDInformation({
        countryCode: country,
        year,
        offset,
        limit: 100,
      }));
    }
  }

  if (promisesPagePerYear && promisesPagePerYear.length) {
    await Promise.all(promisesPagePerYear.map(async (yearPageInfo) => {
      const resolvedPromise = await yearPageInfo;

      if (resolvedPromise && resolvedPromise['iati-activities'] && resolvedPromise['iati-activities'].length) {
        resolvedPromise['iati-activities'].forEach((activity) => {
          let nameONG = '';
          let transactions = [];

          if (Array.isArray(activity['iati-activity']['reporting-org'].narrative)) {
            const objText = activity['iati-activity']['reporting-org'].narrative.find((name) => name['xml:lang'] === 'en');

            if (objText) {
              nameONG = objText.text;
            }
          } else if (typeof activity['iati-activity']['reporting-org'].narrative === 'object') {
            nameONG = activity['iati-activity']['reporting-org'].narrative.text;
          } else {
            nameONG = activity['iati-activity']['reporting-org'].narrative || activity['iati-activity']['reporting-org'].text;
          }

          if (typeof activity['iati-activity'].transaction === 'object') {
            transactions = [{ ...activity['iati-activity'].transaction || {} }];
          } else {
            transactions = activity['iati-activity'].transaction || [];
          }

          results.push({ nameONG, transactions });
        });
      }
    }));
  }

  const groupedResults = groupByOngName(results);
  const response = calculateFormatedResults(groupedResults);

  if (!await reportDao.getReportByIdentifier(`${country}_${year}`)) {
    const arrayResponse = Object.entries(response);
    const mappedReport = [];

    if (arrayResponse && arrayResponse.length) {
      arrayResponse.forEach((agency) => {
        mappedReport.push({
          agency: agency[0] || '',
          contribution: agency[1] || 0,
        });
      });

      await reportDao.newReport({
        identifier: `${country}_${year}`,
        report: mappedReport,
      });
    }
  }

  return { year, results: response };
};

const getPulpomaticAIDLastFiveYears = async ({ country, year }) => {
  const startYear = Number(year) - 5;
  const finalYear = Number(year) - 1;
  const promisesPerYear = [];
  const response = {};

  const redisClient = redisDb.connectRedisDB();
  const redisSetAsync = promisify(redisClient.set).bind(redisClient);
  const redisGetAsync = promisify(redisClient.get).bind(redisClient);

  if (!redisClient) {
    logger.error(('Redis DB no connected'));
  }

  for (let i = startYear; i <= finalYear; i += 1) {
    const data = JSON.parse(await redisGetAsync(`${country}_${i}`));

    if (!data) {
      promisesPerYear.push(getPulpomaticAIDPerYear({
        country,
        year: i,
      }));
    } else {
      response[i] = { ...data[`${i}_${country}`] };
    }
  }

  if (promisesPerYear && promisesPerYear.length) {
    await Promise.all(promisesPerYear.map(async (promiseDataPerYear) => {
      const resolvedPromise = await promiseDataPerYear;
      const cachedObject = {};
      cachedObject[`${resolvedPromise.year}_${country}`] = resolvedPromise.results;

      const redisResult = await redisSetAsync(`${country}_${resolvedPromise.year}`, JSON.stringify(cachedObject), 'EX', Number(env.REDIS_EXPIRATION_TIME_API_DATA));
      if (!redisResult || redisResult !== 'OK') {
        logger.error('Error redis connection');
      }

      response[`${resolvedPromise.year}`] = resolvedPromise.results;
    }));
  }

  redisClient.quit();

  return response;
};

export default getPulpomaticAIDLastFiveYears;
