import { registerAs } from '@nestjs/config';

export const supabaseConfig = registerAs('supabase', () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  bucket: process.env.SUPABASE_BUCKET || 'audio-files',
}));

export default supabaseConfig;
