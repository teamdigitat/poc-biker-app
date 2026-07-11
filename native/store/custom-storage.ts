import { StateStorage } from 'zustand/middleware';

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(name: string): string | null {
    return this.store.get(name) || null;
  }

  setItem(name: string, value: string): void {
    this.store.set(name, value);
  }

  removeItem(name: string): void {
    this.store.delete(name);
  }
}

const memoryStorage = new MemoryStorage();
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const safePersistStorage: StateStorage = {
  getItem: (name: string) => {
    if (isWeb) {
      try {
        return localStorage.getItem(name);
      } catch {
        return memoryStorage.getItem(name);
      }
    }
    return memoryStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (isWeb) {
      try {
        localStorage.setItem(name, value);
        return;
      } catch {}
    }
    memoryStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (isWeb) {
      try {
        localStorage.removeItem(name);
        return;
      } catch {}
    }
    memoryStorage.removeItem(name);
  },
};
