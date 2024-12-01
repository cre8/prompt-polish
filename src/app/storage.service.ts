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
  set(key: string, value: unknown): Promise<void> {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.local.set({ [key]: value }).then(() => resolve());
        chrome.runtime.sendMessage({
          action: 'updatePrompts',
        });
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
    return new Promise((resolve, reject) => {
      if (chrome.storage) {
        chrome.storage.local.get(key, (data: Record<string, T>) => {
          if (!data[key]) {
            reject();
          } else {
            resolve(data[key]);
          }
        });
      } else {
        const data = localStorage.getItem(key);
        if (!data) {
          reject();
        } else {
          resolve(JSON.parse(data));
        }
      }
    });
  }

  /**
   * Deletes a key from the storage
   * @param key
   * @returns
   */
  delete(key: string): Promise<void> {
    return new Promise((resolve) => {
      if (chrome.storage) {
        chrome.storage.local.remove(key).then(() => resolve());
      } else {
        localStorage.removeItem(key);
        resolve();
      }
    });
  }
}
