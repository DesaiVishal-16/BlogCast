import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { chunkText, mergeChunks, TextChunk } from '@utils/chunker';
import { TranslationResult } from '@my-types/index';

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);
  private readonly lingo: LingoDotDevEngine;
  private readonly fastMode: boolean;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('lingo.apiKey');
    this.fastMode = this.configService.get<boolean>('lingo.fastMode') || false;

    this.lingo = new LingoDotDevEngine({
      apiKey,
    });
  }

  async translate(
    text: string,
    title: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    this.logger.log(`Translating to ${targetLanguage} using Lingo.dev`);

    try {
      // Detect source language if not provided
      let detectedSourceLang = sourceLanguage;
      if (!detectedSourceLang) {
        detectedSourceLang = await this.detectLanguage(text.slice(0, 500));
        this.logger.log(`Detected source language: ${detectedSourceLang}`);
      }

      // Translate title
      const translatedTitle = await this.translateText(title, targetLanguage, detectedSourceLang);

      // Chunk and translate content for better performance
      const chunks = chunkText(text, 3000); // Smaller chunks for Lingo.dev
      const translatedChunks: TextChunk[] = [];

      for (const chunk of chunks) {
        const translatedContent = await this.translateText(
          chunk.content,
          targetLanguage,
          detectedSourceLang
        );

        translatedChunks.push({
          ...chunk,
          content: translatedContent,
        });
      }

      const translatedContent = mergeChunks(translatedChunks);

      return {
        title: translatedTitle,
        text: translatedContent,
        sourceLanguage: detectedSourceLang,
        targetLanguage,
      };
    } catch (error) {
      this.logger.error('Lingo.dev translation failed:', error);
      throw new BadRequestException(`Translation failed: ${error.message}`);
    }
  }

  async translateBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string[]> {
    this.logger.log(`Batch translating ${texts.length} texts to ${targetLanguage}`);

    try {
      const detectedSourceLang =
        sourceLanguage || (await this.detectLanguage(texts[0]?.slice(0, 500) || ''));

      // Translate each text individually
      const results: string[] = [];
      for (const text of texts) {
        const translated = await this.translateText(text, targetLanguage, detectedSourceLang);
        results.push(translated);
      }

      return results;
    } catch (error) {
      this.logger.error('Batch translation failed:', error);
      throw new BadRequestException(`Batch translation failed: ${error.message}`);
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const result = await this.lingo.recognizeLocale(text);
      return result;
    } catch (error) {
      this.logger.warn('Language detection failed, defaulting to auto:', error);
      return 'auto';
    }
  }

  async translateHtml(
    html: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    this.logger.log(`Translating HTML content to ${targetLanguage}`);

    try {
      const detectedSourceLang = sourceLanguage || (await this.detectLanguage(html.slice(0, 500)));

      const result = await this.lingo.localizeHtml(html, {
        sourceLocale: detectedSourceLang,
        targetLocale: targetLanguage,
      });

      return result;
    } catch (error) {
      this.logger.error('HTML translation failed:', error);
      throw new BadRequestException(`HTML translation failed: ${error.message}`);
    }
  }

  private async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    if (!text || text.trim().length === 0) {
      return text;
    }

    // Check if API key is configured
    const apiKey = this.configService.get<string>('lingo.apiKey');
    if (!apiKey) {
      // Fallback to mock translation for development
      this.logger.warn('No Lingo.dev API key configured, using mock translation');
      return `[${targetLanguage.toUpperCase()}] ${text}`;
    }

    try {
      const result = await this.lingo.localizeText(text, {
        sourceLocale: sourceLanguage || 'auto',
        targetLocale: targetLanguage,
      });

      return result;
    } catch (error) {
      this.logger.error('Text translation failed:', error);
      throw new Error(`Lingo.dev translation error: ${error.message}`);
    }
  }
}
