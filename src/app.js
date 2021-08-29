import express from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'socket.io';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import Cors from './configs/cors';
import env from './configs/index';
import {
  handledFatalException,
  normalizePort,
  getDatabaseUrlMongo,
  getDatabaseUrlRedis,
} from './utils/libs/utils';
import { notFoundHandler, wrapErrors, errorHandler } from './utils/middlewares/errorHandler';
import Mongo from './db/mongo';
import Redis from './db/redis';
import logger from './utils/libs/logger';

// Express instance
const app = express();

// Server initializations
const server = http.createServer(app);
const io = new WebSocketServer(server);

// Databases Instances
const mongoDb = new Mongo(getDatabaseUrlMongo(env.ENVIRONMENT || 'DEVELOPMENT'));
const redisDb = new Redis(getDatabaseUrlRedis(env.ENVIRONMENT || 'DEVELOPMENT'));

// Global middleares
app.use(cors(Cors.setCorsConfiguration()));
app.use(compression);
app.use(helmet());
app.use(express.json({ limit: '50 mb' }));
app.use(express.urlencoded({ extended: true, limit: '50 mb', parameterLimit: 50000 }));
app.use(morgan(env.ENVIRONMENT === 'DEVELOPMENT' ? 'dev' : 'combined'));

// Socket instance
io.on('connection', (socket) => {
  logger.info(`New socket connection ${socket.id}`);
});

// Routes

// Not found resource error handler
app.use(notFoundHandler);

// Error Handlers
app.use(wrapErrors);
app.use(errorHandler);

const startServer = async (port) => {
  try {
    const normalizedPort = normalizePort(port);

    if (!normalizedPort) throw new Error('No valid PORT configuration. Please check');

    app.listen(env.PORT, () => {
      logger.info(`Running on http://localhost:${port}`);
    });

    await mongoDb.connectMongoDB();
    const redisClient = redisDb.connectRedisDB();

    if (!redisClient) {
      logger.error(('Redis DB no connected'));
    }

    redisClient.on('error', () => {});
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

export default startServer;
