import { ReactNode } from "react";
import clsx from "clsx";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: ReactNode;
  colorTheme?: "blue" | "green" | "red" | "yellow" | "slate";
}

const themeStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-amber-50 text-amber-600",
  slate: "bg-slate-50 text-slate-600",
};

export default function MetricCard({
  title,
  value,
  trend,
  trendDirection = "neutral",
  icon,
  colorTheme = "blue",
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">
          {title}
        </h3>
        <div className={clsx("p-2 rounded-lg", themeStyles[colorTheme])}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline flex-wrap gap-2">
        <span className="text-3xl font-bold text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={clsx(
              "text-sm font-medium",
              trendDirection === "up" && "text-green-600",
              trendDirection === "down" && "text-red-600",
              trendDirection === "neutral" && "text-slate-400"
            )}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
