import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { ScrapedContent } from '@my-types/index';

@Injectable()
export class ReadabilityService {
  async extractContent(html: string, url: string): Promise<ScrapedContent> {
    const $ = cheerio.load(html);

    // Remove non-content elements
    this.removeNoise($);

    // Extract title
    const title = this.extractTitle($);

    // Extract main content
    const content = this.extractMainContent($);

    // Clean up the content
    const cleanContent = this.cleanText(content);

    const wordCount = cleanContent.split(/\s+/).length;

    return {
      title: this.cleanText(title),
      content: cleanContent,
      url,
      wordCount,
    };
  }

  private removeNoise($: cheerio.CheerioAPI): void {
    const selectorsToRemove = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      'aside',
      '.sidebar',
      '.advertisement',
      '.ads',
      '.comments',
      '.social-share',
      '.related-posts',
      '.newsletter',
      'iframe',
      'noscript',
      '[role="banner"]',
      '[role="navigation"]',
      '[role="complementary"]',
    ];

    selectorsToRemove.forEach(selector => {
      $(selector).remove();
    });
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    // Try different title selectors
    const titleSelectors = [
      'h1.entry-title',
      'h1.post-title',
      'h1.article-title',
      'article h1',
      '.content h1',
      'h1',
    ];

    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title && title.length > 5) {
        return title;
      }
    }

    // Fallback to meta title
    return $('title').text().trim() || 'Untitled';
  }

  private extractMainContent($: cheerio.CheerioAPI): string {
    const contentSelectors = [
      'article',
      '.entry-content',
      '.post-content',
      '.article-content',
      '[role="main"]',
      'main',
      '.content',
      '#content',
      '.post',
    ];

    let bestContent = '';
    let maxTextLength = 0;

    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        if (text.length > maxTextLength) {
          maxTextLength = text.length;
          bestContent = text;
        }
      }
    }

    // If no specific content container found, use body
    if (!bestContent) {
      bestContent = $('body').text().trim();
    }

    return bestContent;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/\t+/g, ' ') // Replace tabs with space
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\[.*?\]/g, '') // Remove text in brackets
      .replace(/\{.*?\}/g, '') // Remove text in curly braces
      .trim();
  }
}
