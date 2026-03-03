import { registerAs } from '@nestjs/config';

export const lingoConfig = registerAs('lingo', () => ({
  apiKey: process.env.LINGO_API_KEY,
  fastMode: process.env.LINGO_FAST_MODE === 'true' || false,
  baseUrl: process.env.LINGO_BASE_URL || 'https://api.lingo.dev',
}));

export default lingoConfig;
