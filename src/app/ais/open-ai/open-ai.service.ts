import { Injectable } from '@angular/core';
import { StorageService } from '../../storage.service';
import { ModelResponse, OpenAIConfig, OpenAIResponse } from './types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AI } from '../ai.class';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService extends AI<OpenAIConfig> {
  constructor(storage: StorageService, private httpClient: HttpClient) {
    super(storage);
  }

  override get storageKey(): string {
    return 'openAI';
  }

  /**
   * Makes a request to the openai api
   * @param prompt
   * @returns
   */
  async request(prompt: string) {
    const values = await this.storage.get<OpenAIConfig>(this.storageKey);
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
            Authorization: `Bearer ${values.apiKey}`,
            'Openai-Project': values.projectId,
          },
        }
      )
    ).then(
      (response) => response.choices[0].message.content,
      (response) => {
        throw Error(response.error.error.message);
      }
    );
  }

  /**
   * Validate the configuration by making a request to the openai api
   * @param config
   * @returns
   */
  validate(config: OpenAIConfig) {
    return firstValueFrom(
      this.httpClient.post<OpenAIResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: config.model,
          messages: [
            {
              role: 'user',
              content: 'test',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
            'Openai-Project': config.projectId,
          },
        }
      )
    ).then(
      () => true,
      (res) => {
        throw Error(res.error.error.message);
      }
    );
  }

  /**
   * Get the available models
   * @returns
   */
  async getModels() {
    const config = await this.storage.get<OpenAIConfig>(this.storageKey);
    return firstValueFrom(
      this.httpClient.get<ModelResponse>('https://api.openai.com/v1/models', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
          'Openai-Project': config.projectId,
        },
      })
    ).then((res) =>
      res.data.map((model) => model.id).sort((a, b) => a.localeCompare(b))
    );
  }
}
