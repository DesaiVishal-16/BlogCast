import { BadRequestException } from '@nestjs/common';
import { SUPPORTED_LANGUAGES } from '@my-types/index';

export function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new BadRequestException('URL must use HTTP or HTTPS protocol');
    }
  } catch (error) {
    throw new BadRequestException('Invalid URL format');
  }
}

export function validateLanguage(language: string): string {
  const lang = language.toLowerCase();
  if (!SUPPORTED_LANGUAGES[lang]) {
    throw new BadRequestException(
      `Unsupported language. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`
    );
  }
  return lang;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
