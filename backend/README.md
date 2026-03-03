# Blog Translation Backend API

A production-ready NestJS backend that converts blog URLs into translated text and audio.

## 🚀 Features

- **URL Scraping**: Extracts clean article content from any blog URL
- **Translation**: Translates content to 15+ supported languages
- **Text-to-Speech**: Generates audio using FREE Hugging Face Kokoro-82M model
- **Caching**: Database-level caching to reduce API costs
- **Object Storage**: Audio files stored in Supabase Storage
- **Modular Architecture**: Easy to extend and maintain

## 📁 Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── controllers/               # API controllers
│   ├── blog.controller.ts     # Blog processing endpoints
│   └── health.controller.ts   # Health check endpoints
├── services/                  # Business logic
│   ├── scraper.service.ts     # Web scraping
│   ├── translate.service.ts   # Translation service
│   ├── tts.service.ts         # Text-to-speech (Hugging Face)
│   ├── cache.service.ts       # Database caching
│   ├── storage.service.ts     # Supabase storage
│   └── blog-processor.service.ts  # Main orchestrator
├── utils/                     # Utility functions
│   ├── readability.service.ts # Content extraction
│   ├── chunker.ts             # Text chunking
│   ├── hash.ts                # Hashing utilities
│   └── validators.ts          # Input validation
├── db/                        # Database
│   ├── schema.prisma          # Prisma schema
│   └── prisma.service.ts      # Prisma client
├── config/                    # Configuration
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── supabase.config.ts
│   ├── huggingface.config.ts  # Hugging Face config
│   ├── lingo.config.ts
│   └── redis.config.ts
├── dto/                       # Data Transfer Objects
│   └── blog.dto.ts
└── types/                     # TypeScript types
    └── index.ts
```

## 🛠️ Tech Stack

- **Node.js** >= 18
- **TypeScript**
- **NestJS** - Framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Supabase** - Object Storage
- **Hugging Face** - FREE Text-to-Speech (Kokoro-82M)
- **Lingo.dev SDK** - AI-powered translation
- **Cheerio** - HTML parsing

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account (for storage)
- Hugging Face API key (FREE - for TTS)
- Lingo.dev API key (for AI translation)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Run the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📡 API Endpoints

### Process Blog

```http
POST /api/v1/blog/process
Content-Type: application/json

{
  "url": "https://example.com/blog-post",
  "language": "hi"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Translated title",
  "translatedText": "Translated content...",
  "audioUrl": "https://cdn.example.com/audio.wav",
  "processingTime": 12500
}
```

### Health Check

```http
GET /health
```

### Supported Languages

```http
GET /languages
```

## 🔧 Supported Languages

| Code | Language   |
| ---- | ---------- |
| hi   | Hindi      |
| es   | Spanish    |
| fr   | French     |
| de   | German     |
| it   | Italian    |
| pt   | Portuguese |
| ru   | Russian    |
| ja   | Japanese   |
| ko   | Korean     |
| zh   | Chinese    |
| ar   | Arabic     |
| nl   | Dutch      |
| pl   | Polish     |
| tr   | Turkish    |
| vi   | Vietnamese |

## 🔑 API Keys Setup

### Hugging Face (FREE - for TTS)

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to **Settings** → **Access Tokens**
4. Create a new token
5. Add to `.env`:
   ```env
   HF_API_KEY="your-hf-token"
   HF_TTS_MODEL="hexgrad/Kokoro-82M"
   ```

### Lingo.dev (for Translation)

1. Go to [lingo.dev](https://lingo.dev)
2. Sign up for an account
3. Get your API key
4. Add to `.env`:
   ```env
   LINGO_API_KEY="your-lingo-key"
   ```

### Supabase (for Storage)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy the URL and anon key
5. Add to `.env`:
   ```env
   SUPABASE_URL="your-project-url"
   SUPABASE_KEY="your-anon-key"
   ```

## 📊 Database Schema

### processed_blogs

- Stores processed blog results
- Indexed by url_hash and language
- Prevents duplicate processing

### processing_jobs

- Tracks async processing jobs (future feature)
- Supports background processing with BullMQ

## 🔒 Security

- Input validation with class-validator
- URL whitelist validation
- CORS configuration
- Environment-based configuration

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 💰 Cost Comparison

| Service | Before (OpenAI) | After (Hugging Face) | Savings |
|---------|----------------|---------------------|---------|
| TTS | ~$0.015/min | **FREE** | **100%** |
| Translation | Lingo.dev | Lingo.dev | Same |
| **Total** | **$$$** | **$** | **~90%** |

## 📈 Performance Optimizations

- Database-level caching
- Text chunking for large articles
- Efficient HTML parsing with Cheerio
- Connection pooling with Prisma

## 🚧 Future Enhancements

- [ ] Background job processing with BullMQ
- [ ] Redis caching layer
- [ ] Rate limiting
- [ ] Authentication/Authorization
- [ ] Webhook notifications
- [ ] Batch processing
- [ ] Custom voice selection

## 📝 License

MIT
