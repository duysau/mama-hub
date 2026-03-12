"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GoldHistoryResponse, formatVND, formatUSD, GOLD_NAMES } from "@/lib/gold";
import clsx from "clsx";

interface ChartPoint {
  date: string;
  buy: number;
  sell: number;
}

function fmt(n: number) {
  return (n / 1_000_000).toFixed(1) + "M";
}

function stat(nums: number[]) {
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const avg = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  return { max, min, avg };
}

export default function GoldDetailClient({
  typeCode,
}: {
  typeCode: string;
}) {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [current, setCurrent] = useState<{ buy: number; sell: number; change_buy: number; change_sell: number; update_time: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const isWorld = typeCode === "XAUUSD";
  const name = GOLD_NAMES[typeCode] ?? typeCode;

  useEffect(() => {
    async function load() {
      try {
        // Current price
        const resC = await fetch(
          `https://www.vang.today/api/prices?type=${typeCode}`
        );
        const jsonC: GoldHistoryResponse = await resC.json();
        if (jsonC.data[0]) setCurrent(jsonC.data[0]);

        // 30-day history
        const res = await fetch(
          `https://www.vang.today/api/prices?type=${typeCode}&days=30`
        );
        const json: GoldHistoryResponse = await res.json();
        const pts: ChartPoint[] = json.data.map((d) => {
          const dt = new Date(d.update_time * 1000);
          return {
            date: `${dt.getDate()}/${dt.getMonth() + 1}`,
            buy: d.buy,
            sell: d.sell,
          };
        });
        setChartData(pts.reverse());
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [typeCode]);

  const buyStats = chartData.length > 0 ? stat(chartData.map((d) => d.buy)) : null;
  const updateStr = current
    ? (() => {
        const d = new Date(current.update_time * 1000);
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")} ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/gold/list-gold"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại bảng giá
          </Link>
          <h1 className="text-3xl font-bold text-amber-600">{name}</h1>
          {updateStr && (
            <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Cập nhật lúc: {updateStr}
            </p>
          )}
        </div>

        {/* Current price */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500 font-medium text-sm">
            Đang tải dữ liệu...
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-800 mb-5 pb-4 border-b border-slate-100">Giá hiện tại</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Mua vào</p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                    {isWorld ? formatUSD(current?.buy ?? 0) : formatVND(current?.buy ?? 0)}
                  </p>
                  {current?.change_buy !== undefined && current.change_buy !== 0 && (
                    <p className={clsx("text-sm font-medium mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full", current.change_buy > 0 ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100")}>
                      {current.change_buy > 0 ? "↑" : "↓"} {Math.abs(current.change_buy).toLocaleString()}
                    </p>
                  )}
                  {current?.change_buy === 0 && <p className="text-xs text-slate-400 mt-1">-</p>}
                </div>
                {!isWorld && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Bán ra</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">
                      {formatVND(current?.sell ?? 0)}
                    </p>
                    {current?.change_sell !== undefined && current.change_sell !== 0 && (
                      <p className={clsx("text-sm font-medium mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full", current.change_sell > 0 ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-rose-700 bg-rose-50 border border-rose-100")}>
                        {current.change_sell > 0 ? "↑" : "↓"} {Math.abs(current.change_sell).toLocaleString()}
                      </p>
                    )}
                    {current?.change_sell === 0 && <p className="text-xs text-slate-400 mt-1">-</p>}
                  </div>
                )}
              </div>
            </div>

            {/* 30-day stats */}
            {buyStats && (
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <h2 className="text-base font-bold text-slate-800 mb-5 pb-4 border-b border-slate-100">
                   Thống kê 30 ngày{" "}
                   <span className="text-xs text-slate-500 font-normal">({chartData.length} ngày có dữ liệu)</span>
                 </h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {[
                     { label: "Bán cao nhất", value: !isWorld ? fmt(Math.max(...chartData.map((d) => d.sell))) : formatUSD(buyStats.max) },
                     { label: "Bán thấp nhất", value: !isWorld ? fmt(Math.min(...chartData.map((d) => d.sell))) : formatUSD(buyStats.min) },
                     { label: "Trung bình", value: !isWorld ? fmt(Math.round(chartData.map((d) => d.sell).reduce((a, b) => a + b, 0) / chartData.length)) : formatUSD(buyStats.avg) },
                     {
                       label: "Thay đổi hôm nay",
                       value: current?.change_buy
                         ? (current.change_buy > 0 ? "+" : "") + current.change_buy.toLocaleString()
                         : "+0",
                     },
                   ].map((s) => (
                     <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                       <p className="text-xs text-slate-500 mb-1.5 font-medium">{s.label}</p>
                       <p className={clsx("text-base font-bold", s.label === "Thay đổi hôm nay" && s.value !== "+0" ? (s.value.startsWith("+") ? "text-emerald-600" : "text-rose-600") : "text-slate-900")}>{s.value}</p>
                     </div>
                   ))}
                 </div>
               </div>
            )}

            {/* 30-day chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
              <h2 className="text-base font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Biểu đồ giá 30 ngày</h2>
              <div className="h-80 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: -5, right: 15, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={isWorld ? (v) => `$${v}` : fmt}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={["auto", "auto"]}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
                      labelStyle={{ color: "#475569", marginBottom: 4, fontSize: 12, fontWeight: "600" }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(val: any, name: any) => [
                        isWorld ? formatUSD(val) : formatVND(val),
                        name === "buy" ? "Mua vào" : "Bán ra",
                      ]}
                    />
                    <Legend
                      iconType="circle"
                      formatter={(v) => <span className="text-slate-600 font-medium">{v === "buy" ? "Mua vào" : "Bán ra"}</span>}
                      wrapperStyle={{ paddingTop: 16, fontSize: 13 }}
                    />
                    <Line
                      dataKey="buy"
                      stroke="#059669"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#059669" }}
                      activeDot={{ r: 6 }}
                      name="buy"
                    />
                    {!isWorld && (
                      <Line
                        dataKey="sell"
                        stroke="#e11d48"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#e11d48" }}
                        activeDot={{ r: 6 }}
                        name="sell"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
