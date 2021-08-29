import redis from 'redis';
import logger from '../utils/libs/logger';

export default class Redis {
  connectionUri = null;

  constructor(connectionUri) {
    this.connectionUri = connectionUri;
  }

  connectRedisDB() {
    try {
      const redisClient = redis.createClient(this.connectionUri);

      if (!redisClient) throw new Error('Error creating redis client');

      logger.info(`Redis Connected ${true}`);
      return redisClient;
    } catch (error) {
      logger.error((`Redis connection error: ${error}`));
      return null;
    }
  }
}
