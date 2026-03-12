"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
import { GoldHistoryResponse, formatVND } from "@/lib/gold";

interface GoldChartModalProps {
  typeCode: string;
  typeName: string;
  onClose: () => void;
}

interface ChartPoint {
  date: string;
  buy: number;
  sell: number;
}

function formatMillions(val: number) {
  return (val / 1_000_000).toFixed(1) + "M";
}

export default function GoldChartModal({
  typeCode,
  typeName,
  onClose,
}: GoldChartModalProps) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://www.vang.today/api/prices?type=${typeCode}&days=7`
        );
        const json: GoldHistoryResponse = await res.json();
        const pts: ChartPoint[] = json.data.map((d) => {
          const dt = new Date(d.update_time * 1000);
          const label = `${dt.getDate()}/${dt.getMonth() + 1}`;
          return { date: label, buy: d.buy, sell: d.sell };
        });
        setData(pts.reverse());
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [typeCode]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-lg font-bold text-amber-600">{typeName}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors bg-white hover:bg-slate-100 p-1 rounded-md border border-slate-200 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-6 pt-4">
          {loading ? (
            <div className="h-56 flex items-center justify-center text-slate-500 text-sm font-medium">
              Đang tải dữ liệu biểu đồ...
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={formatMillions}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={["auto", "auto"]}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
                    labelStyle={{ color: "#475569", marginBottom: 4, fontWeight: "500" }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => [formatVND(val), ""]}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(v) => <span className="text-slate-600 text-sm font-medium">{v === "buy" ? "Mua vào" : "Bán ra"}</span>}
                    wrapperStyle={{ paddingTop: 8 }}
                  />
                  <Line dataKey="buy" stroke="#059669" strokeWidth={2} dot={{ r: 4, fill: "#059669" }} activeDot={{ r: 6 }} name="buy" />
                  <Line dataKey="sell" stroke="#e11d48" strokeWidth={2} dot={{ r: 4, fill: "#e11d48" }} activeDot={{ r: 6 }} name="sell" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
