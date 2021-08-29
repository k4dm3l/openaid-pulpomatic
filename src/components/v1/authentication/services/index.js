import cryptoJs from 'crypto-js';
import boom from '@hapi/boom';
import jwt from 'jsonwebtoken';

import getUserByUsername from '../DAO';
import env from '../../../../configs';

const getSessionToken = async ({ username, password }) => {
  const user = await getUserByUsername(username);

  if (!user) throw boom.unauthorized('Wrong credentials');
  const decryptedPassword = cryptoJs.AES.decrypt(
    user.password, env.CRYPTO_SECRET,
  ).toString(cryptoJs.enc.Utf8);

  if (decryptedPassword !== password) throw boom.unauthorized('Wrong credentials');

  const token = jwt.sign({ ...user }, env.AUTH_SECRET, {
    expiresIn: Number(env.TOKEN_EXPIRATION_TIME || 86400),
  });

  return {
    token,
  };
};

export default getSessionToken;
