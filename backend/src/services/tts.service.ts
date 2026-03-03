import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';
import { TTSResult, TTS_LANGUAGE_VOICES, DEFAULT_TTS_VOICE } from '@my-types/index';
import { createHash } from 'crypto';

interface TTSSettings {
  voice?: string;
  speed?: number;
}

// Voice mapping for Kokoro model (if supported)
const KOKORA_VOICES: Record<string, string> = {
  en: 'af', // American Female (default)
  es: 'af',
  fr: 'af',
  de: 'af',
  it: 'af',
  pt: 'af',
  ru: 'af',
  ja: 'af',
  ko: 'af',
  zh: 'af',
  hi: 'af',
  ar: 'af',
  nl: 'af',
  pl: 'af',
  tr: 'af',
  vi: 'af',
};

@Injectable()
export class TTSService {
  private readonly logger = new Logger(TTSService.name);
  private readonly hf: HfInference;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('HF_API_KEY');
    this.model = this.configService.get<string>('HF_TTS_MODEL') || 'hexgrad/Kokoro-82M';
    this.hf = new HfInference(apiKey);
  }

  async generateAudio(
    text: string,
    language: string,
    settings?: TTSSettings
  ): Promise<Buffer> {
    this.logger.log(`Generating audio for ${language} using Hugging Face (${this.model})`);

    try {
      // Kokoro has a limit, chunk if needed
      const maxLength = 500; // Kokoro works best with shorter text
      const chunks = this.splitTextIntoChunks(text, maxLength);

      const audioBuffers: Buffer[] = [];

      for (const chunk of chunks) {
        const audioBlob = await this.hf.textToSpeech({
          model: this.model,
          inputs: chunk,
        });

        // Convert Blob to Buffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        audioBuffers.push(buffer);
      }

      // Combine all audio buffers
      return Buffer.concat(audioBuffers);
    } catch (error) {
      this.logger.error('TTS generation failed:', error);
      throw new BadRequestException(`Failed to generate audio: ${error.message}`);
    }
  }

  generateAudioFileName(urlHash: string, language: string): string {
    const timestamp = Date.now();
    const uniqueId = createHash('md5')
      .update(`${urlHash}-${timestamp}`)
      .digest('hex')
      .slice(0, 8);
    return `audio/${language}/${uniqueId}.wav`;
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks: string[] = [];
    let currentChunk = '';

    // Split by sentences to maintain context
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }

        // If single sentence is too long, split it by words
        if (sentence.length > maxLength) {
          const words = sentence.split(' ');
          for (const word of words) {
            if ((currentChunk + word).length > maxLength) {
              chunks.push(currentChunk.trim());
              currentChunk = word + ' ';
            } else {
              currentChunk += word + ' ';
            }
          }
        } else {
          currentChunk = sentence;
        }
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
