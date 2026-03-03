const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export interface ConvertRequest {
  url: string;
  language: string;
}

export interface ConvertResponse {
  success: boolean;
  translated_text: string;
  audio_url: string;
  original_url: string;
  target_language: string;
  error?: string;
}

export async function convertUrlToAudio(request: ConvertRequest): Promise<ConvertResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      translated_text: '',
      audio_url: '',
      original_url: request.url,
      target_language: request.language,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
