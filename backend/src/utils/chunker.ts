const MAX_CHUNK_SIZE = 4000; // Maximum characters per chunk for translation/TTS
const OVERLAP_SIZE = 100; // Overlap between chunks to maintain context

export interface TextChunk {
  index: number;
  content: string;
  start: number;
  end: number;
}

export function chunkText(text: string, maxChunkSize: number = MAX_CHUNK_SIZE): TextChunk[] {
  if (text.length <= maxChunkSize) {
    return [
      {
        index: 0,
        content: text,
        start: 0,
        end: text.length,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentIndex = 0;
  let chunkIndex = 0;

  while (currentIndex < text.length) {
    let chunkEnd = Math.min(currentIndex + maxChunkSize, text.length);

    // Try to end at a sentence boundary
    if (chunkEnd < text.length) {
      const sentenceEnd = findSentenceBoundary(text, chunkEnd);
      if (sentenceEnd > currentIndex) {
        chunkEnd = sentenceEnd;
      }
    }

    chunks.push({
      index: chunkIndex,
      content: text.slice(currentIndex, chunkEnd).trim(),
      start: currentIndex,
      end: chunkEnd,
    });

    // Move to next chunk with overlap
    currentIndex = chunkEnd - OVERLAP_SIZE;
    chunkIndex++;
  }

  return chunks;
}

function findSentenceBoundary(text: string, position: number): number {
  // Look for sentence endings: . ! ? followed by space or end of string
  const searchText = text.slice(Math.max(0, position - 200), position + 200);
  const relativePos = Math.min(200, position);

  // Search backwards for sentence boundary
  for (let i = relativePos; i > 0; i--) {
    const char = searchText[i];
    const prevChar = searchText[i - 1];
    if (['.', '!', '?'].includes(prevChar) && (char === ' ' || char === '\n')) {
      return position - (relativePos - i);
    }
  }

  // If no sentence boundary found, look for paragraph break
  for (let i = relativePos; i > 0; i--) {
    if (searchText[i] === '\n' && searchText[i - 1] === '\n') {
      return position - (relativePos - i);
    }
  }

  return position;
}

export function mergeChunks(chunks: TextChunk[]): string {
  return chunks
    .sort((a, b) => a.index - b.index)
    .map(chunk => chunk.content)
    .join(' ');
}
