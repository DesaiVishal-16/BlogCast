import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BlogProcessorService } from '@services/blog-processor.service';
import { ProcessBlogRequestDto, ProcessBlogResponseDto, ErrorResponseDto } from '@dto/blog.dto';

@ApiTags('Blog Processing')
@Controller('blog')
export class BlogController {
  private readonly logger = new Logger(BlogController.name);

  constructor(private readonly blogProcessorService: BlogProcessorService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ 
    summary: 'Process a blog URL',
    description: 'Extracts content from a blog URL, translates it to the specified language, and generates an audio file'
  })
  @ApiBody({ type: ProcessBlogRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Blog processed successfully',
    type: ProcessBlogResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid URL or language',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async processBlog(
    @Body() request: ProcessBlogRequestDto
  ): Promise<ProcessBlogResponseDto> {
    this.logger.log(`Processing request: ${request.url} -> ${request.language}`);
    
    return this.blogProcessorService.processBlog({
      url: request.url,
      language: request.language,
    });
  }
}
