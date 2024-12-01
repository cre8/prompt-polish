import { inject, Injectable, Type } from '@angular/core';
import { OpenAIService } from './open-ai/open-ai.service';
import { OpenAIComponent } from './open-ai/open-ai.component';
import { AI } from './ai.class';
import { StorageService } from '../storage.service';
import { AnthropicService } from './anthropic/anthropic.service';
import { AnthropicComponent } from './anthropic/anthropic.component';

interface Service {
  label: string;
  service: AI<unknown>;
  component: Type<unknown>;
}

/**
 * Service to make the different AI requests
 */
@Injectable({
  providedIn: 'root',
})
export class AIService {
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

  setActive(service: string) {
    this.storageService.set('active-service', service);
  }

  selectedService(): Promise<string> {
    return this.storageService.get<string>('active-service').catch(() => {
      throw new Error('No service selected');
    });
  }

  setService(service: string) {
    this.storageService.set('active-service', service);
  }

  /**
   * Checks if the AI is configured
   * @returns
   */
  isConfigured() {
    return this.getSelected();
  }

  private async getSelected() {
    const selected = await this.selectedService();
    return this.services.find((service) => service.label === selected);
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
