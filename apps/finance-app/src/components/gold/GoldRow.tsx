"use client";

import { useState } from "react";
import { ChevronDown, TrendingUp, LineChart } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import type { GoldPrice, GoldHistoryResponse } from "@/lib/gold";
import { formatVND, formatChange, formatTimestamp } from "@/lib/gold";
import GoldChartModal from "./GoldChartModal";

interface GoldRowProps {
  typeCode: string;
  data: GoldPrice;
}

interface HistoryRow {
  date: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  update_time: number;
}

function getTrend(change: number) {
  if (change > 0) return { label: "Tăng", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (change < 0) return { label: "Giảm", color: "text-rose-700 bg-rose-50 border-rose-200" };
  return { label: "Ổn định", color: "text-slate-600 bg-slate-100 border-slate-200" };
}

export default function GoldRow({ typeCode, data }: GoldRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const isWorld = data.currency === "USD";
  const trend = getTrend(data.change_buy);

  async function toggleExpand() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (history.length > 0) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(
        `https://www.vang.today/api/prices?type=${typeCode}&days=7`
      );
      const json: GoldHistoryResponse = await res.json();
      const seen = new Set<string>();
      const rows: HistoryRow[] = [];
      for (const entry of json.data) {
        const dt = new Date(entry.update_time * 1000);
        const dateKey = `${dt.getDate()}/${(dt.getMonth() + 1).toString().padStart(2, "0")}`;
        if (!seen.has(dateKey)) {
          seen.add(dateKey);
          rows.push({ ...entry, date: dateKey });
        }
      }
      setHistory(rows);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <>
      {/* Main row */}
      <div
        className={clsx(
          "grid grid-cols-[1fr_auto_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 cursor-pointer transition-colors",
          expanded ? "bg-slate-50/80" : "hover:bg-slate-50"
        )}
        onClick={toggleExpand}
      >
        <div>
          <p className={clsx("font-bold text-sm", isWorld ? "text-amber-600" : "text-slate-900")}>
            {data.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{typeCode}</p>
        </div>

        <div className="text-right">
          {isWorld ? (
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              ${data.buy.toFixed(2)}
            </span>
          ) : (
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {formatVND(data.buy)}
            </span>
          )}
          {data.change_buy !== 0 && (
            <p className={clsx("text-xs font-medium tabular-nums mt-0.5", data.change_buy > 0 ? "text-emerald-600" : "text-rose-600")}>
              {data.change_buy > 0 ? "↑" : "↓"} {formatChange(Math.abs(data.change_buy), data.currency as "VND" | "USD")}
            </p>
          )}
        </div>

        {!isWorld && (
          <div className="text-right hidden sm:block">
            <span className="text-sm font-bold text-slate-900 tabular-nums">{formatVND(data.sell)}</span>
            {data.change_sell !== 0 && (
              <p className={clsx("text-xs font-medium tabular-nums mt-0.5", data.change_sell > 0 ? "text-emerald-600" : "text-rose-600")}>
                {data.change_sell > 0 ? "↑" : "↓"} {formatChange(Math.abs(data.change_sell), "VND")}
              </p>
            )}
          </div>
        )}
        {isWorld && <div className="hidden sm:block" />}

        <div className="text-center hidden md:block">
          <span className={clsx("text-xs font-medium px-2 py-1 rounded border", trend.color)}>
            {trend.label}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-slate-400 hidden lg:block whitespace-nowrap">
            {data.currency === "VND" ? "--:-- --/--" : ""}
          </span>
          <ChevronDown
            className={clsx(
              "w-4 h-4 text-slate-400 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded history panel */}
      {expanded && (
        <div className="bg-slate-50 border-y border-slate-100 px-5 py-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">
              Lịch sử giá {data.name}
            </p>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-amber-200 bg-white text-amber-600 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm"
                onClick={(e) => { e.stopPropagation(); setShowChart(true); }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Biểu đồ
              </button>
              <Link
                href={`/gold/${typeCode}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-blue-200 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <LineChart className="w-3.5 h-3.5" />
                Chi tiết
              </Link>
            </div>
          </div>

          {loadingHistory ? (
            <p className="text-xs text-slate-500 py-4 text-center">Đang tải...</p>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold">Ngày</th>
                    <th className="px-4 py-3 text-right font-semibold">Mua vào</th>
                    <th className="px-4 py-3 text-right hidden sm:table-cell font-semibold">Bán ra</th>
                    <th className="px-4 py-3 text-right hidden md:table-cell font-semibold">Cập nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-700 font-medium">{h.date}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={clsx("font-bold tabular-nums", isWorld ? "text-slate-900" : "text-slate-900")}>
                          {isWorld ? `$${h.buy.toFixed(2)}` : formatVND(h.buy)}
                        </span>
                        {h.change_buy !== 0 && (
                          <p className={clsx("text-xs mt-0.5 tabular-nums font-medium", h.change_buy > 0 ? "text-emerald-600" : "text-rose-600")}>
                            {h.change_buy > 0 ? "↑" : "↓"}+{formatChange(Math.abs(h.change_buy), data.currency as "VND" | "USD")}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-bold tabular-nums text-slate-900">
                          {isWorld ? "-" : formatVND(h.sell)}
                        </span>
                        {!isWorld && h.change_sell !== 0 && (
                          <p className={clsx("text-xs mt-0.5 tabular-nums font-medium", h.change_sell > 0 ? "text-emerald-600" : "text-rose-600")}>
                            {h.change_sell > 0 ? "↑" : "↓"}+{formatChange(Math.abs(h.change_sell), "VND")}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 text-xs hidden md:table-cell tabular-nums">
                        {formatTimestamp(h.update_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showChart && (
        <GoldChartModal
          typeCode={typeCode}
          typeName={data.name}
          onClose={() => setShowChart(false)}
        />
      )}
    </>
  );
}
