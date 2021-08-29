import boom from '@hapi/boom';
import env from '../../configs/index';

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

export const wrapErrors = (err, req, res, next) => (
  !err.isBoom ? next(boom.badImplementation(err)) : next(err)
);

export const errorHandler = (err, req, res) => {
  const {
    output: { statusCode, payload },
  } = err;

  res
    .status(statusCode)
    .json(withErrorStack({ ...payload, data: err.data || null }, err.stack));
};
