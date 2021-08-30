import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import os from 'os';

import Cors from './configs/cors';
import env from './configs/index';
import {
  notFoundHandler, logError,
} from './utils/middlewares/errorHandler';
import logger from './utils/libs/logger';
import {
  handledFatalException,
  normalizePort,
  getDatabaseUrlMongo,
} from './utils/libs/utils';
import Mongo from './db/mongo';

import routerV1 from './components/v1/router.v1';

// Databases Instances
const mongoDb = new Mongo(getDatabaseUrlMongo(env.ENVIRONMENT || 'DEVELOPMENT'));

// Express instance
const app = express();

// Global middleares
app.use(cors(Cors.setCorsConfiguration()));
app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '50 mb' }));
app.use(express.urlencoded({ extended: true, limit: '50 mb', parameterLimit: 50000 }));
app.use(morgan(env.ENVIRONMENT === 'DEVELOPMENT' ? 'dev' : 'combined'));

// Routes
routerV1(app);

app.get('/', (req, res) => res.status(200).send('Welcome to Pulpomatic OpenAID API'));
app.get('/health-check', (req, res) => res.status(200).json({
  status: 200,
  message: 'Health check',
  data: {
    server: {
      os: os.version(),
      host: os.hostname(),
    },
    dbStatus: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
  },
}));

// Not found resource error handler
app.use(notFoundHandler);

// Error Handler
app.use(logError);

const startServer = async (port) => {
  try {
    const normalizedPort = normalizePort(port);

    if (!normalizedPort) throw new Error('No valid PORT configuration. Please check');

    app.listen(env.PORT, () => {
      logger.info(`Running on http://localhost:${port}`);
    });

    await mongoDb.connectMongoDB();
  } catch (error) {
    // Handled process exceptions
    process.on('uncaughtException', handledFatalException(error));
    process.on('unhandledRejection', handledFatalException(error));

    // Handled DB exceptions - MongoDB
    process.on('SIGINT', mongoDb.closeConnectionCrashNodeProcess());
    process.on('SIGTERM', mongoDb.closeConnectionCrashNodeProcess());

    logger.error(error);
  }
};

export default {
  startServer,
  app,
};
