import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api/v1';

export interface BlogProcessRequest {
  url: string;
  language: string;
}

export interface BlogProcessResponse {
  id: string;
  title: string;
  translatedText: string;
  audioUrl: string;
  processingTime?: number;
}

export interface Language {
  code: string;
  name: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 180000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async processBlog(request: BlogProcessRequest): Promise<BlogProcessResponse> {
    const response = await this.client.post('/blog/process', request);
    return response.data;
  }

  async getLanguages(): Promise<Language[]> {
    const response = await this.client.get('/languages');
    return response.data.languages;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
