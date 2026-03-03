import { IsString, IsUrl, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SUPPORTED_LANGUAGES } from '@my-types/index';

const SUPPORTED_LANGUAGE_CODES = Object.keys(SUPPORTED_LANGUAGES) as string[];

export class ProcessBlogRequestDto {
  @ApiProperty({
    description: 'The URL of the blog/article to process',
    example: 'https://example.com/blog-post',
  })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url: string;

  @ApiProperty({
    description: 'Target language code for translation',
    example: 'hi',
    enum: SUPPORTED_LANGUAGE_CODES,
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGE_CODES, {
    message: 'Language must be one of: ' + SUPPORTED_LANGUAGE_CODES.join(', '),
  })
  language: string;
}

export class ProcessBlogResponseDto {
  @ApiProperty({ description: 'Unique ID of the processed blog' })
  id: string;

  @ApiProperty({ description: 'Translated title' })
  title: string;

  @ApiProperty({ description: 'Translated content text' })
  translatedText: string;

  @ApiProperty({ description: 'URL to the generated audio file' })
  audioUrl: string;

  @ApiProperty({ description: 'Processing time in milliseconds', required: false })
  @IsOptional()
  processingTime?: number;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'Error status code' })
  statusCode: number;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error type' })
  error: string;
}
