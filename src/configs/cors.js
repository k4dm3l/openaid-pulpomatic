import env from './index';

export default class Cors {
  static setCorsConfiguration() {
    const corsOptions = {
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'x-company-id',
      ],
      credentials: true,
      methods: '*',
      origin: env.CORS,
      preflightContinue: false,
    };

    return corsOptions;
  }
}
