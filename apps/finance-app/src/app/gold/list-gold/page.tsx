import { getAllPrices, GOLD_ORDER, formatUSD } from "@/lib/gold";
import GoldRow from "@/components/gold/GoldRow";
import { Globe } from "lucide-react";

export const revalidate = 300;

export default async function GoldListPage() {
  const data = await getAllPrices();
  const world = data.prices["XAUUSD"];

  const orderedTypes = GOLD_ORDER.filter((k) => data.prices[k]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* World gold header bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Globe className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-600">Vàng Thế Giới</p>
              <p className="text-xs text-slate-500">XAU/USD</p>
            </div>
          </div>
          {world && (
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-slate-900">
                {formatUSD(world.buy)}
              </p>
              {world.change_buy !== 0 && (
                <p className={`text-sm font-medium ${world.change_buy > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {world.change_buy > 0 ? "↑" : "↓"} +{Math.abs(world.change_buy).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] px-5 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Loại vàng</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Mua vào</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-right hidden sm:block">Bán ra</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center hidden md:block">Xu hướng</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-right hidden lg:block">Cập nhật</p>
          </div>

          <div className="divide-y divide-slate-100">
            {orderedTypes
              .filter((k) => k !== "XAUUSD")
              .map((typeCode) => (
                <GoldRow
                  key={typeCode}
                  typeCode={typeCode}
                  data={data.prices[typeCode]}
                />
              ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Cập nhật mỗi 5 phút • Dữ liệu từ{" "}
          <a href="https://vang.today" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
            vang.today
          </a>{" "}
          • {data.date} {data.time}
        </p>
      </div>
    </div>
  );
}
