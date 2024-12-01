import { Injectable } from '@angular/core';
import { StorageService } from '../../storage.service';
import { AnthropicConfig } from './types';
import { HttpClient } from '@angular/common/http';
import { AI } from '../ai.class';
import Anthropic from '@anthropic-ai/sdk';

@Injectable({
  providedIn: 'root',
})
export class AnthropicService extends AI<AnthropicConfig> {
  constructor(storage: StorageService, private httpClient: HttpClient) {
    super(storage);
  }

  override get storageKey(): string {
    return 'anthropic';
  }

  private async getInstance(values: AnthropicConfig) {
    return new Anthropic({
      apiKey: values.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Makes a request to the anthropic api
   * @param prompt
   * @returns
   */
  async request(prompt: string) {
    const values = await this.storage.get<AnthropicConfig>(this.storageKey);
    const instance = await this.getInstance(values);
    return instance.messages
      .create({
        model: values.model,
        max_tokens: values.max_tokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      .then((res) => {
        console.log(res);
        return '';
      });
  }

  /**
   * Validate the configuration by making a request to the anthropic api
   * @param config
   * @returns
   */
  validate(config: AnthropicConfig) {
    return this.getInstance(config).then((instance) => {
      return instance.messages
        .create({
          model: config.model,
          max_tokens: config.max_tokens,
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
        })
        .catch((err) => {
          throw Error(err.error.error.message);
        });
    });
  }

  /**
   * Get the available models
   * @returns
   */
  async getModels() {
    return ['claude-3-5-sonnet-20241022'];
  }
}
