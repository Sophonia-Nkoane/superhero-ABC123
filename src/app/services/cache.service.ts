import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private storage: Storage = localStorage;

  setItem(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = this.storage.getItem(key);
    if (!item) {
      return null;
    }
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error parsing cached item for key "${key}":`, e);
      // Remove the invalid item to prevent future errors
      this.removeItem(key);
      return null;
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }
}