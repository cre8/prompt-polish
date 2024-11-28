import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';
import { OpenAIConfig } from './ais/open-ai/types';
import { OpenAIResponse } from './ais/open-ai/types';

/**
 * Service to make the different AI requests
 */
@Injectable({
  providedIn: 'root',
})
export class AIService {
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService
  ) {}

  /**
   * Uses the specified AI to make a request
   * @param prompt
   * @returns
   */
  request(prompt: string) {
    return this.openAI(prompt);
  }

  /**
   * Makes a request to the openai api
   * @param prompt
   * @returns
   */
  private async openAI(prompt: string) {
    const values = await this.storage.get<OpenAIConfig>('openAI');
    if (!values) {
      alert('config for openai not found');
    }
    return firstValueFrom(
      this.httpClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: values.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${values.token}`,
            'Openai-Project': values.projectId,
          },
        }
      )
    ).then((response) => response.choices[0].message.content);
  }
}
