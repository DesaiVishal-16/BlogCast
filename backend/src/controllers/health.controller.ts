import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SUPPORTED_LANGUAGES } from '@my-types/index';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('languages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get supported languages' })
  @ApiResponse({ status: 200, description: 'List of supported languages' })
  getLanguages() {
    return {
      languages: Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
        code,
        name,
      })),
    };
  }
}
