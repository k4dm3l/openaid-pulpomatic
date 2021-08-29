import redis from 'redis';
import logger from '../utils/libs/logger';

export default class Redis {
  connectionUri = null;

  dbPassword = null;

  constructor(connectionUri, dbPassword) {
    this.connectionUri = connectionUri;
    this.dbPassword = dbPassword;
  }

  connectRedisDB() {
    try {
      const redisClient = redis.createClient({
        url: this.connectionUri,
        no_ready_check: true,
        auth_pass: this.dbPassword,
      });

      if (!redisClient) throw new Error('Error creating redis client');

      logger.info(`Redis Connected ${true}`);
      return redisClient;
    } catch (error) {
      logger.error((`Redis connection error: ${error}`));
      return null;
    }
  }
}
