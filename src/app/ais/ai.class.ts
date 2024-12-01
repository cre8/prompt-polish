import { StorageService } from '../storage.service';

/**
 * Base class for AI services
 */
export abstract class AI<T> {
  constructor(protected storage: StorageService) {}

  /**
   * Returns the storage key for the configuration
   */
  abstract get storageKey(): string;

  /**
   * Makes a request to the AI
   * @param prompt
   */
  abstract request(prompt: string): Promise<string>;

  /**
   * Checks if the AI is configured
   * @returns
   */
  getConfig() {
    return this.storage.get<T>(this.storageKey);
  }
}
