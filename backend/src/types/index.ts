export interface BlogProcessRequest {
  url: string;
  language: string;
}

export interface BlogProcessResponse {
  id: string;
  title: string;
  translatedText: string;
  audioUrl: string;
  processingTime?: number;
}

export interface ScrapedContent {
  title: string;
  content: string;
  url: string;
  wordCount: number;
}

export interface TranslationResult {
  title: string;
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TTSResult {
  audioUrl: string;
  audioPath: string;
  duration?: number;
}

export interface CacheEntry {
  urlHash: string;
  language: string;
  data: BlogProcessResponse;
  expiresAt: Date;
}

// Lingo.dev supported language codes
// See: https://lingo.dev/docs/languages
export type SupportedLanguage =
  // Major European languages
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'pl'
  | 'nl'
  | 'sv'
  | 'da'
  | 'no'
  | 'fi'
  // Asian languages
  | 'zh'
  | 'ja'
  | 'ko'
  | 'hi'
  | 'th'
  | 'vi'
  | 'id'
  | 'ms'
  | 'tl'
  // Middle Eastern languages
  | 'ar'
  | 'he'
  | 'tr'
  | 'fa'
  | 'ur'
  // Other major languages
  | 'uk'
  | 'cs'
  | 'ro'
  | 'hu'
  | 'el'
  | 'bg'
  | 'hr'
  | 'sk'
  | 'sl'
  | 'lt'
  | 'lv'
  | 'et'
  | 'mt'
  | 'is'
  | 'ga'
  | 'cy'
  | 'sq'
  | 'mk'
  | 'sr'
  | 'be'
  | 'ka'
  | 'hy'
  | 'az'
  | 'kk'
  | 'uz'
  | 'mn'
  | 'ne'
  | 'si'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'bn'
  | 'or'
  | 'as'
  | 'my'
  | 'km'
  | 'lo'
  | 'jw'
  | 'su'
  | 'sw'
  | 'am'
  | 'so'
  | 'mg'
  | 'ny'
  | 'sn'
  | 'yo'
  | 'ig'
  | 'zu'
  | 'af'
  | 'st'
  | 'sq'
  | 'eu'
  | 'ca'
  | 'gl'
  | 'wa'
  | 'br'
  | 'co'
  | 'oc'
  | 'rm'
  | 'fur'
  | 'lad'
  | 'yi'
  | 'jv'
  | 'haw'
  | 'mi'
  | 'sm'
  | 'to'
  | 'tk'
  | 'tt'
  | 'ba'
  | 'kv'
  | 'cv'
  | 'tyv'
  | 'sah'
  | 'xal'
  | 'ug'
  | 'bo'
  | 'dz'
  | 'si'
  | 'dv'
  | 'ps'
  | 'sd'
  | 'ku'
  | 'ce'
  | 'ab'
  | 'os'
  | 'ky'
  | 'tk'
  | 'tt'
  | 'ba'
  | 'cv'
  | 'tyv'
  | 'sah'
  | 'xal'
  | 'ug'
  | 'bo'
  | 'dz'
  | 'si'
  | 'dv'
  | 'ps'
  | 'sd'
  | 'ku'
  | 'ce'
  | 'ab'
  | 'os';

// Extended supported languages for the application
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  // Major languages
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
  ar: 'Arabic',

  // European
  nl: 'Dutch',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
  pl: 'Polish',
  cs: 'Czech',
  ro: 'Romanian',
  hu: 'Hungarian',
  el: 'Greek',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sk: 'Slovak',
  sl: 'Slovenian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',

  // Asian
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  tl: 'Filipino',

  // Middle Eastern
  he: 'Hebrew',
  tr: 'Turkish',
  fa: 'Persian',
  ur: 'Urdu',

  // South Asian
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
  ne: 'Nepali',
  si: 'Sinhala',

  // Other
  uk: 'Ukrainian',
  be: 'Belarusian',
  ka: 'Georgian',
  hy: 'Armenian',
  az: 'Azerbaijani',
  uz: 'Uzbek',
  kk: 'Kazakh',
  mn: 'Mongolian',
  sw: 'Swahili',
  af: 'Afrikaans',
};

// Language code mapping for TTS voices (OpenAI)
export const TTS_LANGUAGE_VOICES: Record<string, string> = {
  en: 'alloy',
  es: 'echo',
  fr: 'fable',
  de: 'onyx',
  it: 'nova',
  pt: 'shimmer',
  ru: 'echo',
  zh: 'nova',
  ja: 'fable',
  ko: 'onyx',
  hi: 'alloy',
  ar: 'echo',
  nl: 'fable',
  sv: 'nova',
  da: 'shimmer',
  no: 'alloy',
  fi: 'echo',
  pl: 'fable',
  cs: 'onyx',
  ro: 'nova',
  hu: 'shimmer',
  el: 'alloy',
  bg: 'echo',
  hr: 'fable',
  sk: 'onyx',
  sl: 'nova',
  lt: 'shimmer',
  lv: 'alloy',
  et: 'echo',
  th: 'fable',
  vi: 'onyx',
  id: 'nova',
  ms: 'shimmer',
  tl: 'alloy',
  he: 'echo',
  tr: 'fable',
  fa: 'onyx',
  ur: 'nova',
  bn: 'shimmer',
  ta: 'alloy',
  te: 'echo',
  mr: 'fable',
  gu: 'onyx',
  kn: 'nova',
  ml: 'shimmer',
  pa: 'alloy',
  ne: 'echo',
  si: 'fable',
  uk: 'onyx',
  be: 'nova',
  ka: 'shimmer',
  hy: 'alloy',
  az: 'echo',
  uz: 'fable',
  kk: 'onyx',
  mn: 'nova',
  sw: 'shimmer',
  af: 'alloy',
};

// Default voice if language not found
export const DEFAULT_TTS_VOICE = 'alloy';
