import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogController, HealthController } from '@controllers/index';
import {
  ScraperService,
  TranslateService,
  TTSService,
  CacheService,
  StorageService,
  BlogProcessorService,
} from '@services/index';
import { ReadabilityService } from '@utils/index';
import {
  appConfig,
  supabaseConfig,
  huggingfaceConfig,
  lingoConfig,
} from '@config/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, supabaseConfig, huggingfaceConfig, lingoConfig],
      envFilePath: '.env',
    }),
  ],
  controllers: [BlogController, HealthController],
  providers: [
    // Utils
    ReadabilityService,
    
    // Services
    ScraperService,
    TranslateService,
    TTSService,
    CacheService,
    StorageService,
    BlogProcessorService,
  ],
})
export class AppModule {}
