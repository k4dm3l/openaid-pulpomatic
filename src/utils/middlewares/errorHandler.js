import boom from '@hapi/boom';
import env from '../../configs/index';
import logger from '../libs/logger';

export const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(next);

export const withErrorStack = (err, stack) => {
  if (env.ENVIRONMENT !== 'production') {
    return { err, stack };
  }

  return err;
};

export const notFoundHandler = (req, res) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
};

// eslint-disable-next-line
export const logError = (err, req, res, next) => {
  logger.error(err);

  if (err.isBoom) {
    res.status(err.output.statusCode).json({
      error: true, message: err.output.payload.message,
    });
  } else {
    res.status(500).json({
      error: true, message: err.message.trim() || 'Internal server error',
    });
  }
};
