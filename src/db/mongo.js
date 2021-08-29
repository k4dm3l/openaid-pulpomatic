import mongoose from 'mongoose';
import logger from '../utils/libs/logger';

export default class Mongo {
  connectionUri = '';

  constructor(connectionUri) {
    this.connectionUri = connectionUri;
  }

  async connectMongoDB() {
    try {
      const connection = await mongoose.connect(this.connectionUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      logger.info(`MongoDB Connected ${connection.connection.host}`);
    } catch (error) {
      logger.error((`MongoDB connection error: ${error}`));
    }
  }

  async closeDBConnection() {
    try {
      await mongoose.disconnect();
    } catch (error) {
      logger.error((`Error trying to dissconect: ${error}`));
    }
  }

  closeConnectionCrashNodeProcess() {
    mongoose.connection.close(() => process.exit(0));
  }
}
