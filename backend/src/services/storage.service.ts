import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TTSResult } from '@my-types/index';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.key');
    this.bucket = this.configService.get<string>('supabase.bucket') || 'audio-files';

    if (!url || !key) {
      throw new Error('Supabase URL and Key must be configured');
    }

    this.supabase = createClient(url, key);
  }

  async uploadAudio(
    fileName: string,
    buffer: Buffer,
    contentType: string = 'audio/mpeg'
  ): Promise<TTSResult> {
    this.logger.log(`Uploading audio file: ${fileName}`);

    try {
      const { error } = await this.supabase.storage.from(this.bucket).upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(fileName);

      this.logger.log(`Audio uploaded successfully: ${publicUrl}`);

      return {
        audioUrl: publicUrl,
        audioPath: fileName,
      };
    } catch (error) {
      this.logger.error('Failed to upload audio:', error);
      throw error;
    }
  }

  async deleteAudio(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage.from(this.bucket).remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      this.logger.log(`Deleted audio file: ${filePath}`);
    } catch (error) {
      this.logger.error('Failed to delete audio:', error);
      throw error;
    }
  }

  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      this.logger.error('Failed to create signed URL:', error);
      throw error;
    }
  }
}
