import { createHash } from 'crypto';

export function generateUrlHash(url: string, language?: string): string {
  const data = language ? `${url}:${language}` : url;
  return createHash('sha256').update(data).digest('hex');
}

export function generateCacheKey(url: string, language: string): string {
  return `blog:${generateUrlHash(url, language)}`;
}
