/**
 * WALBLOB LOCAL HISTORY (Zero-Knowledge)
 * 
 * Only stores non-sensitive metadata in localStorage.
 * KEYS ARE NEVER STORED.
 */

export interface HistoryItem {
  blobId: string;
  name: string;
  size: number;
  uploadedAt: number;
  url: string;
}

const STORAGE_KEY = 'walblob_history_v1';

export const historyService = {
  save(item: HistoryItem) {
    const history = this.getAll();
    const exists = history.find(h => h.blobId === item.blobId);
    if (!exists) {
      const updated = [item, ...history].slice(0, 50); // Keep last 50
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },

  getAll(): HistoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  remove(blobId: string) {
    const history = this.getAll().filter(h => h.blobId !== blobId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
};
