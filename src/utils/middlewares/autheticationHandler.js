import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import env from '../../configs';

const loggedIn = (req, res, next) => {
  const token = req.headers.authorization || null;
  if (!token) throw boom.unauthorized('No valid Bearer token');
  if (!token.startsWith('Bearer ')) throw boom.unauthorized('No valid Bearer token');

  const tokenArray = token.split(' ');
  res.locals = jwt.verify(tokenArray[1], env.AUTH_SECRET) || {};
  next();
};

export default loggedIn;
