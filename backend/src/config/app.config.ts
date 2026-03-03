import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  maxContentLength: parseInt(process.env.MAX_CONTENT_LENGTH || '50000', 10),
  cacheTtl: parseInt(process.env.CACHE_TTL || '86400', 10),
}));

export default appConfig;
