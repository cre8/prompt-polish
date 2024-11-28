import { Injectable } from '@angular/core';

/**
 * Storage service for local storage for development and chrome storage for production
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Saves a key value pair
   * @param key
   * @param value
   * @returns
   */
  put(key: string, value: unknown): Promise<void> {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.local.set({ [key]: value }).then(() => resolve());
      } else {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      }
    });
  }

  /**
   * Gets a value from the storage
   * @param key
   * @returns
   */
  get<T>(key: string): Promise<T> {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.local.get(key, (data: Record<string, T>) => {
          resolve(data[key]);
        });
      } else {
        const data = localStorage.getItem(key);
        if (!data) return;
        resolve(JSON.parse(data));
      }
    });
  }
}
