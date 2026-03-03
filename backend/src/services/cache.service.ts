import { Injectable, Logger } from '@nestjs/common';
import { generateUrlHash } from '@utils/hash';
import { BlogProcessResponse } from '@my-types/index';

interface CacheEntry {
  data: BlogProcessResponse;
  timestamp: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache: Map<string, CacheEntry> = new Map();
  private readonly ttl: number = 24 * 60 * 60 * 1000; // 24 hours in ms

  async getCachedResult(url: string, language: string): Promise<BlogProcessResponse | null> {
    const urlHash = generateUrlHash(url, language);
    const entry = this.cache.get(urlHash);

    if (entry) {
      // Check if expired
      if (Date.now() - entry.timestamp > this.ttl) {
        this.cache.delete(urlHash);
        return null;
      }
      
      this.logger.log(`Memory cache hit for URL: ${url}, language: ${language}`);
      return entry.data;
    }

    return null;
  }

  async saveResult(
    url: string,
    language: string,
    originalTitle: string,
    originalContent: string,
    translatedTitle: string,
    translatedText: string,
    audioUrl: string,
    audioPath: string,
    wordCount: number,
    processingTime: number
  ): Promise<BlogProcessResponse> {
    const urlHash = generateUrlHash(url, language);
    
    const result: BlogProcessResponse = {
      id: urlHash,
      title: translatedTitle,
      translatedText: translatedText,
      audioUrl: audioUrl,
      processingTime: processingTime,
    };

    this.cache.set(urlHash, {
      data: result,
      timestamp: Date.now(),
    });

    this.logger.log(`Saved to memory cache for URL: ${url}`);
    
    return result;
  }

  async isCached(url: string, language: string): Promise<boolean> {
    const urlHash = generateUrlHash(url, language);
    const entry = this.cache.get(urlHash);
    
    if (entry && (Date.now() - entry.timestamp <= this.ttl)) {
      return true;
    }
    
    return false;
  }

  async invalidateCache(url: string, language: string): Promise<void> {
    const urlHash = generateUrlHash(url, language);
    this.cache.delete(urlHash);
    this.logger.log(`Invalidated cache for URL: ${url}`);
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
