import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ReadabilityService } from '@utils/readability.service';
import { ScrapedContent } from '@my-types/index';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly requestTimeout = 30000; // 30 seconds

  constructor(private readonly readabilityService: ReadabilityService) {}

  async scrapeUrl(url: string): Promise<ScrapedContent> {
    this.logger.log(`Scraping URL: ${url}`);

    try {
      const response = await axios.get(url, {
        timeout: this.requestTimeout,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
        maxRedirects: 5,
        validateStatus: status => status === 200,
      });

      const html = response.data;
      const content = await this.readabilityService.extractContent(html, url);

      if (!content.content || content.content.length < 100) {
        throw new BadRequestException('Could not extract meaningful content from the URL');
      }

      this.logger.log(`Successfully scraped content: ${content.wordCount} words`);
      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new BadRequestException('Request timeout while fetching the URL');
        }
        if (error.response) {
          throw new BadRequestException(`Failed to fetch URL: HTTP ${error.response.status}`);
        }
        throw new BadRequestException(`Network error: ${error.message}`);
      }
      throw error;
    }
  }
}
