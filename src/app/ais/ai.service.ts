import { inject, Injectable } from '@angular/core';
import { OpenAIService } from './open-ai/open-ai.service';
import { OpenAIComponent } from './open-ai/open-ai.component';
import { StorageService } from '../storage.service';
import { AnthropicService } from './anthropic/anthropic.service';
import { AnthropicComponent } from './anthropic/anthropic.component';
import { Service } from './types';

/**
 * Service to make the different AI requests
 */
@Injectable({
  providedIn: 'root',
})
export class AIService {
  /**
   * List of services
   */
  services: Service[] = [
    {
      label: 'OpenAI',
      service: inject(OpenAIService),
      component: OpenAIComponent,
    },
    {
      label: 'Anthropic',
      service: inject(AnthropicService),
      component: AnthropicComponent,
    },
  ];

  constructor(private storageService: StorageService) {}

  /**
   * Gets the services that have a valid config
   * @returns
   */
  async getServices(): Promise<string[]> {
    const valid: string[] = [];
    for (const service of this.services) {
      await service.service.getConfig().then(
        () => {
          valid.push(service.label);
        },
        () => {
          //to nothing
        }
      );
    }
    return valid;
  }

  /**
   * Sets the active AI service
   * @param service
   */
  setService(service: string) {
    this.storageService.set('active-service', service);
  }

  /**
   * Gets the active AI service
   * @returns
   */
  selectedService(): Promise<string> {
    return this.storageService.get<string>('active-service').catch(() => {
      throw new Error('No service selected');
    });
  }

  /**
   * Checks if any AI service is configured
   * @returns Promise<void>
   */
  async isConfigured(): Promise<void> {
    const configPromises = this.services.map((service) =>
      service.service.getConfig().then(
        () => true,
        () => false
      )
    );

    const results = await Promise.all(configPromises);
    if (results.some((result) => result)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('No AI service is configured'));
    }
  }

  /**
   * Uses the specified AI to make a request
   * @param prompt
   * @returns
   */
  async request(serviceName: string, prompt: string) {
    const service = await this.services.find(
      (service) => service.label === serviceName
    );
    if (!service) throw new Error('Service not found');
    return service.service.request(prompt);
  }
}
