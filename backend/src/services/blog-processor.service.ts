import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { TranslateService } from './translate.service';
import { TTSService } from './tts.service';
import { CacheService } from './cache.service';
import { StorageService } from './storage.service';
import { BlogProcessRequest, BlogProcessResponse } from '@my-types/index';
import { generateUrlHash } from '@utils/hash';

@Injectable()
export class BlogProcessorService {
  private readonly logger = new Logger(BlogProcessorService.name);

  constructor(
    private readonly scraperService: ScraperService,
    private readonly translateService: TranslateService,
    private readonly ttsService: TTSService,
    private readonly cacheService: CacheService,
    private readonly storageService: StorageService
  ) {}

  async processBlog(request: BlogProcessRequest): Promise<BlogProcessResponse> {
    const startTime = Date.now();
    const { url, language } = request;

    this.logger.log(`Processing blog: ${url} -> ${language}`);

    // 1. Check cache first
    const cached = await this.cacheService.getCachedResult(url, language);
    if (cached) {
      this.logger.log(`Returning cached result for: ${url}`);
      return cached;
    }

    try {
      // 2. Scrape the URL
      this.logger.log(`Scraping URL: ${url}`);
      const scrapedContent = await this.scraperService.scrapeUrl(url);

      // 3. Translate content
      this.logger.log(`Translating content to ${language}`);
      const translation = await this.translateService.translate(
        scrapedContent.content,
        scrapedContent.title,
        language
      );

      // 4. Generate audio
      this.logger.log(`Generating audio`);
      const audioBuffer = await this.ttsService.generateAudio(translation.text, language);

      // 5. Upload audio to storage
      const urlHash = generateUrlHash(url, language);
      const fileName = this.ttsService.generateAudioFileName(urlHash, language);

      this.logger.log(`Uploading audio to storage`);
      const storageResult = await this.storageService.uploadAudio(fileName, audioBuffer);

      // 6. Calculate processing time
      const processingTime = Date.now() - startTime;

      // 7. Save to cache/DB
      this.logger.log(`Caching result`);
      const result = await this.cacheService.saveResult(
        url,
        language,
        scrapedContent.title,
        scrapedContent.content,
        translation.title,
        translation.text,
        storageResult.audioUrl,
        storageResult.audioPath,
        scrapedContent.wordCount,
        processingTime
      );

      this.logger.log(`Blog processing completed in ${processingTime}ms`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process blog: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to process blog: ${error.message}`);
    }
  }

  async processBlogAsync(request: BlogProcessRequest): Promise<{ jobId: string }> {
    // For async processing with background jobs (BullMQ)
    // This is a placeholder for future implementation
    throw new BadRequestException('Async processing not implemented yet');
  }
}
