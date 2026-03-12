// Types for gold price API from vang.today

export interface GoldPrice {
  name: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  currency: string;
}

export interface GoldPricesResponse {
  success: boolean;
  timestamp: number;
  time: string;
  date: string;
  count: number;
  prices: Record<string, GoldPrice>;
}

export interface GoldHistoryEntry {
  buy: number;
  sell: number;
  update_time: number;
  date?: string;
}

export interface GoldHistoryResponse {
  success: boolean;
  data: Array<{
    type_code: string;
    buy: number;
    sell: number;
    change_buy: number;
    change_sell: number;
    update_time: number;
  }>;
}

const BASE_URL = "https://www.vang.today/api";

export const GOLD_NAMES: Record<string, string> = {
  XAUUSD: "Vàng Thế Giới",
  SJL1L10: "SJC 9999",
  SJ9999: "Nhẫn SJC",
  DOHNL: "DOJI Hà Nội",
  DOHCML: "DOJI HCM",
  DOJINHTV: "DOJI Nữ Trang",
  BTSJC: "Bảo Tín SJC",
  BT9999NTT: "Bảo Tín 9999",
  PQHNVM: "PNJ Hà Nội",
  PQHN24NTT: "PNJ 24K",
  VNGSJC: "VN Gold SJC",
  VIETTINMSJC: "Viettin SJC",
};

// Preferred display order — XAUUSD (world) first, then domestic
export const GOLD_ORDER = [
  "XAUUSD",
  "SJL1L10",
  "SJ9999",
  "BTSJC",
  "BT9999NTT",
  "DOHNL",
  "DOHCML",
  "DOJINHTV",
  "PQHNVM",
  "PQHN24NTT",
  "VNGSJC",
  "VIETTINMSJC",
];

export async function getAllPrices(): Promise<GoldPricesResponse> {
  const res = await fetch(`${BASE_URL}/prices`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch gold prices");
  return res.json();
}

export async function getPriceHistory(
  type: string,
  days: number = 7
): Promise<GoldHistoryResponse> {
  const res = await fetch(`${BASE_URL}/prices?type=${type}&days=${days}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Failed to fetch history for ${type}`);
  return res.json();
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatChange(change: number, currency: "VND" | "USD"): string {
  if (change === 0) return "";
  const sign = change > 0 ? "+" : "";
  if (currency === "VND") {
    return `${sign}${new Intl.NumberFormat("vi-VN").format(change)}`;
  }
  return `${sign}${change.toFixed(2)}`;
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts * 1000);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const mo = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${hh}:${mm} ${dd}/${mo}`;
}
