import { useState, useEffect, useCallback } from "react";
import {
  storeManager,
  Expense,
  GoldAsset,
  StockAsset,
  SavingsAsset,
} from "../lib/idb";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Hooks for managing IndexedDB collections with React State synchronization

export function useFinanceStore<T extends { id: string }>(storeKey: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    const result = await storeManager.getCollection<T>(storeKey);
    setData(result);
    setLoading(false);
  }, [storeKey]);

  useEffect(() => {
    fetchCollection();
    // Custom event listener for cross-tab or cross-component sync
    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.storeKey === storeKey) {
        fetchCollection();
      }
    };
    window.addEventListener("finance-store-updated", handleStorageUpdate);
    return () =>
      window.removeEventListener("finance-store-updated", handleStorageUpdate);
  }, [fetchCollection, storeKey]);

  const add = async (item: Omit<T, "id">) => {
    const newItem = {
      ...item,
      id: generateId(),
    } as T;
    const newData = await storeManager.addItem(storeKey, newItem);
    setData(newData);
    window.dispatchEvent(
      new CustomEvent("finance-store-updated", { detail: { storeKey } }),
    );
    return newItem;
  };

  const remove = async (id: string) => {
    const newData = await storeManager.removeItem<T>(storeKey, id);
    setData(newData);
    window.dispatchEvent(
      new CustomEvent("finance-store-updated", { detail: { storeKey } }),
    );
  };

  return { data, loading, add, remove, refresh: fetchCollection };
}

export function useExpenses() {
  return useFinanceStore<Expense>("finance:expenses");
}

export function useGoldPortfolio() {
  return useFinanceStore<GoldAsset>("finance:gold");
}

export function useStockPortfolio() {
  return useFinanceStore<StockAsset>("finance:stocks");
}

export function useSavings() {
  return useFinanceStore<SavingsAsset>("finance:savings");
}
