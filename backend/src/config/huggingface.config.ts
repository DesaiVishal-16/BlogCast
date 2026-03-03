import { registerAs } from '@nestjs/config';

export const huggingfaceConfig = registerAs('huggingface', () => ({
  apiKey: process.env.HF_API_KEY,
  ttsModel: process.env.HF_TTS_MODEL || 'hexgrad/Kokoro-82M',
}));

export default huggingfaceConfig;
