import { Injectable } from '@angular/core';

export function saveToStorage<T>(key: string, item: T) {
  window.localStorage.setItem(key, JSON.stringify(item));
}
export function loadFromStorage<T>(key: string) {
  const data = window.localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : undefined;
}
export function removeFromStorage(key: string) {
  window.localStorage.removeItem(key);
}

export abstract class LocalStorage<T> {
  private readonly key: string;
  private readonly value: T;

  protected constructor(key: string) {
    this.key = key;
    this.value = loadFromStorage<T>(this.key) ?? ({} as T);
  }

  set<P extends keyof T>(key: P, value: T[P]) {
    this.value[key] = value;
    saveToStorage(this.key, this.value);
  }

  get<P extends keyof T>(key: P) {
    return this.value[key];
  }
}

export interface LocalUserData {
  lastVisitedUrl: string
}

@Injectable()
export class UserStorageService extends LocalStorage<LocalUserData> {
  constructor() {
    super('user-data');
  }
}
