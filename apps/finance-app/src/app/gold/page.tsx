"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, TrendingUp, TrendingDown, Package, BarChart3, List } from "lucide-react";
import clsx from "clsx";
import { formatVND, GOLD_NAMES } from "@/lib/gold";

// ── Types ──────────────────────────────────────────────────────────────────
interface GoldEntry {
  id: string;
  type: string;    // e.g. "SJL1L10"
  amount: number;  // lượng (1 lượng = 37.5g)
  buyPrice: number; // price per lượng at purchase (VND)
  date: string;    // ISO date string
  note: string;
}

const DOMESTIC_TYPES = Object.entries(GOLD_NAMES)
  .filter(([k]) => k !== "XAUUSD")
  .map(([code, name]) => ({ code, name }));

const STORAGE_KEY = "gold_portfolio";

function loadEntries(): GoldEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries: GoldEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatK(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " tỷ";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  return n.toLocaleString("vi-VN");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GoldPortfolio() {
  // Lazy init from localStorage — avoids calling setState inside an effect
  const [entries, setEntries] = useState<GoldEntry[]>(() => loadEntries());
  const [livePrice, setLivePrice] = useState<number | null>(null); // SJL1L10 sell price

  // form state
  const [form, setForm] = useState({
    type: "SJL1L10",
    amount: "",
    buyPrice: "",
    date: today(),
    note: "",
  });
  const [formError, setFormError] = useState("");

  // (no separate effect needed — entries loaded via lazy useState initializer)

  // Fetch live sell price for valuation
  const fetchLivePrice = useCallback(async () => {
    try {
      const res = await fetch("https://www.vang.today/api/prices?type=SJL1L10");
      const json = await res.json();
      if (json.data?.[0]?.sell) setLivePrice(json.data[0].sell);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function run() { await fetchLivePrice(); }
    void run();
    const interval = setInterval(() => { void fetchLivePrice(); }, 300_000);
    return () => clearInterval(interval);
  }, [fetchLivePrice]);

  // ── Portfolio stats ────────────────────────────────────────────────────
  const totalLuong = entries.reduce((s, e) => s + e.amount, 0);
  const totalCost = entries.reduce((s, e) => s + e.amount * e.buyPrice, 0);
  const currentValue = livePrice ? totalLuong * livePrice : null;
  const pnl = currentValue !== null ? currentValue - totalCost : null;

  // ── Add entry ──────────────────────────────────────────────────────────
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const buyPrice = parseFloat(form.buyPrice.replace(/[,.]/g, ""));
    if (!amount || amount <= 0) { setFormError("Nhập số lượng (lượng) hợp lệ"); return; }
    if (!buyPrice || buyPrice <= 0) { setFormError("Nhập giá mua hợp lệ"); return; }
    setFormError("");

    const entry: GoldEntry = {
      id: crypto.randomUUID(),
      type: form.type,
      amount,
      buyPrice,
      date: form.date,
      note: form.note,
    };
    const next = [entry, ...entries];
    setEntries(next);
    saveEntries(next);
    setForm({ type: "SJL1L10", amount: "", buyPrice: "", date: today(), note: "" });
  }

  function handleDelete(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Kho vàng của tôi</p>
              <p className="text-xs text-slate-500">Quản lý & theo dõi danh mục vàng vật chất</p>
            </div>
          </div>
          <Link
            href="/gold/list-gold"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-amber-600 transition-colors border border-slate-200 bg-white shadow-sm rounded-lg px-3 py-1.5 hover:border-amber-200 hover:bg-amber-50"
          >
            <List className="w-3.5 h-3.5" />
            Xem bảng giá
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Summary stats ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Tổng sở hữu",
              value: `${totalLuong.toFixed(2)} lượng`,
              icon: <Package className="w-4 h-4" />,
              color: "text-amber-600",
              bg: "bg-amber-100",
            },
            {
              label: "Tổng vốn bỏ ra",
              value: totalCost > 0 ? formatK(totalCost) + " ₫" : "—",
              icon: <BarChart3 className="w-4 h-4" />,
              color: "text-slate-700",
              bg: "bg-slate-100",
            },
            {
              label: "Giá trị hiện tại",
              value: currentValue !== null ? formatK(currentValue) + " ₫" : "Đang tải...",
              icon: <TrendingUp className="w-4 h-4" />,
              color: "text-emerald-600",
              bg: "bg-emerald-100",
            },
            {
              label: "Lãi / Lỗ",
              value: pnl !== null
                ? (pnl >= 0 ? "+" : "") + formatK(pnl) + " ₫"
                : "—",
              icon: pnl !== null && pnl >= 0
                ? <TrendingUp className="w-4 h-4" />
                : <TrendingDown className="w-4 h-4" />,
              color: pnl === null ? "text-slate-500" : pnl >= 0 ? "text-emerald-600" : "text-rose-600",
              bg: pnl === null ? "bg-slate-100" : pnl >= 0 ? "bg-emerald-100" : "bg-rose-100",
            },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center mb-3", s.bg, s.color)}>
                {s.icon}
              </div>
              <p className="text-xs text-slate-500 mb-1 font-medium">{s.label}</p>
              <p className={clsx("text-lg font-bold tracking-tight leading-tight", s.color === "text-slate-700" ? "text-slate-900" : s.color)}>
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {livePrice && (
          <p className="text-xs text-slate-500 -mt-2">
            Giá thị trường tham chiếu (SJC 9999 bán ra): <span className="text-slate-700 font-medium">{formatVND(livePrice)}/lượng</span>
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Add form ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                Thêm giao dịch mua
              </h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Loại vàng</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all cursor-pointer shadow-sm"
                  >
                    {DOMESTIC_TYPES.map((t) => (
                      <option key={t.code} value={t.code}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Số lượng (lượng)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="vd: 1.5"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Giá mua / lượng (VNĐ)</label>
                  <input
                    type="number"
                    step="100000"
                    min="0"
                    placeholder="vd: 184000000"
                    value={form.buyPrice}
                    onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Ngày mua</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Ghi chú (tuỳ chọn)</label>
                  <input
                    type="text"
                    placeholder="vd: Mua tại SJC Q1..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all shadow-sm"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white font-bold py-2.5 rounded-lg hover:bg-amber-600 transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm vào kho
                </button>
              </form>
            </div>
          </div>

          {/* ── Holdings table ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-900">
                  Danh sách giao dịch
                </h2>
                <span className="text-xs font-medium text-slate-600 bg-slate-200/50 px-2.5 py-1 rounded-full">
                  {entries.length} giao dịch
                </span>
              </div>

              {entries.length === 0 ? (
                <div className="py-16 text-center">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 text-sm font-medium">Chưa có giao dịch nào</p>
                  <p className="text-slate-500 text-xs mt-1">Thêm lần mua đầu tiên bằng form bên trái</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                          <th className="px-5 py-3 text-left font-semibold">Loại / Ngày</th>
                          <th className="px-5 py-3 text-right font-semibold">Số lượng</th>
                          <th className="px-5 py-3 text-right font-semibold hidden sm:table-cell">Giá mua/lượng</th>
                          <th className="px-5 py-3 text-right font-semibold hidden md:table-cell">Tổng vốn</th>
                          <th className="px-5 py-3 text-right font-semibold hidden lg:table-cell">Lãi/Lỗ</th>
                          <th className="px-5 py-3 text-center font-semibold w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {entries.map((entry) => {
                          const cost = entry.amount * entry.buyPrice;
                          const curVal = livePrice ? entry.amount * livePrice : null;
                          const entryPnl = curVal !== null ? curVal - cost : null;
                          return (
                            <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-5 py-4">
                                <p className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                  {GOLD_NAMES[entry.type] ?? entry.type}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 pl-3.5">
                                  {entry.date}
                                  {entry.note && <> • <span className="italic text-slate-400">{entry.note}</span></>}
                                </p>
                              </td>
                              <td className="px-5 py-4 text-right font-bold text-slate-900 text-sm tabular-nums">
                                {entry.amount} <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-1">lượng</span>
                              </td>
                              <td className="px-5 py-4 text-right text-slate-600 text-sm hidden sm:table-cell tabular-nums">
                                {formatVND(entry.buyPrice)}
                              </td>
                              <td className="px-5 py-4 text-right text-slate-600 text-sm hidden md:table-cell tabular-nums font-medium">
                                {formatVND(cost)}
                              </td>
                              <td className="px-5 py-4 text-right text-sm hidden lg:table-cell tabular-nums">
                                {entryPnl !== null ? (
                                  <span className={clsx("font-semibold px-2 py-0.5 rounded-full text-xs", entryPnl >= 0 ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100")}>
                                    {entryPnl >= 0 ? "+" : ""}{formatK(entryPnl)}đ
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-center">
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-md"
                                  title="Xoá giao dịch"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary footer */}
                  <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                    <span className="text-slate-600">
                      Tổng: <span className="text-slate-900 font-bold">{totalLuong.toFixed(2)} lượng</span>
                    </span>
                    <span className="text-slate-600">
                      Vốn: <span className="text-slate-900 font-bold">{formatVND(totalCost)}</span>
                    </span>
                    {pnl !== null && (
                      <span className="text-slate-600">
                        P&L:{" "}
                        <span className={clsx("font-bold", pnl >= 0 ? "text-emerald-600" : "text-rose-600")}>
                          {pnl >= 0 ? "+" : ""}{formatVND(Math.round(pnl))}
                        </span>
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
