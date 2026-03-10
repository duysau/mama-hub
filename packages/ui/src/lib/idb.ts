import { get, set, del, keys, clear } from "idb-keyval";

export const storage = {
  getItem: async <T>(key: string): Promise<T | undefined> => {
    try {
      return await get<T>(key);
    } catch (e) {
      console.error("Error reading from IndexedDB:", e);
      return undefined;
    }
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      await set(key, value);
    } catch (e) {
      console.error("Error writing to IndexedDB:", e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await del(key);
    } catch (e) {
      console.error("Error removing from IndexedDB:", e);
    }
  },
  getAllKeys: async (): Promise<string[]> => {
    try {
      return (await keys()) as string[];
    } catch (e) {
      console.error("Error getting keys from IndexedDB:", e);
      return [];
    }
  },
  clearAll: async (): Promise<void> => {
    try {
      await clear();
    } catch (e) {
      console.error("Error clearing IndexedDB:", e);
    }
  },
};

// --- Finance Data Schemas ---

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO string
  notes?: string;
}

export interface GoldAsset {
  id: string;
  type_code: string; // e.g. SJL1L10
  quantity: number; // Stored in Lượng internally if possible
  buy_price: number; // Price per unit
  buy_date: string; // ISO string
}

export interface StockAsset {
  id: string;
  ticker: string;
  quantity: number;
  buy_price: number;
  buy_date: string; // ISO string
}

export interface SavingsAsset {
  id: string;
  bank_name: string;
  principal: number;
  interest_rate: number; // Percentage
  start_date: string; // ISO string
  term_months: number;
}

// Helper methods for Array-based stores
export const storeManager = {
  getCollection: async <T>(key: string): Promise<T[]> => {
    const data = await storage.getItem<T[]>(key);
    return data || [];
  },
  saveCollection: async <T>(key: string, data: T[]): Promise<void> => {
    await storage.setItem(key, data);
  },
  addItem: async <T extends { id: string }>(
    key: string,
    item: T,
  ): Promise<T[]> => {
    const data = await storeManager.getCollection<T>(key);
    data.push(item);
    await storeManager.saveCollection(key, data);
    return data;
  },
  removeItem: async <T extends { id: string }>(
    key: string,
    id: string,
  ): Promise<T[]> => {
    let data = await storeManager.getCollection<T>(key);
    data = data.filter((item) => item.id !== id);
    await storeManager.saveCollection(key, data);
    return data;
  },
};
