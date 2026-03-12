"use client";

import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import MetricCard from "@/components/ui/MetricCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const spendingData = [
  { name: "May", amount: 2800 },
  { name: "Jun", amount: 3100 },
  { name: "Jul", amount: 2900 },
  { name: "Aug", amount: 3500 },
  { name: "Sep", amount: 3050 },
  { name: "Oct", amount: 3200 },
];

const categoryData = [
  { name: "Housing", value: 1500, color: "#3b82f6" },
  { name: "Food", value: 650, color: "#22c55e" },
  { name: "Transport", value: 420, color: "#f59e0b" },
  { name: "Other", value: 300, color: "#a855f7" },
  { name: "Utilities", value: 200, color: "#94a3b8" },
];

const recentTransactions = [
  { id: 1, merchant: "Netflix Subscription", icon: "NF", category: "Entertainment", date: "Oct 24, 2023", amount: -15.99, amountColor: "text-red-600", categoryColor: "bg-purple-100 text-purple-700" },
  { id: 2, merchant: "Amazon Purchase", icon: "AM", category: "Shopping", date: "Oct 22, 2023", amount: -84.50, amountColor: "text-red-600", categoryColor: "bg-blue-100 text-blue-700" },
  { id: 3, merchant: "Company Salary", icon: "CO", category: "Income", date: "Oct 20, 2023", amount: 4200.00, amountColor: "text-green-600", categoryColor: "bg-green-100 text-green-700" },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Balance"
          value="$45,280.00"
          trend="+2.5%"
          trendDirection="up"
          icon={<Wallet className="w-5 h-5 text-blue-600" />}
          colorTheme="blue"
        />
        <MetricCard
          title="Monthly Income"
          value="$8,450.00"
          trend="vs last month"
          trendDirection="neutral"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          colorTheme="green"
        />
        <MetricCard
          title="Monthly Expenses"
          value="$3,210.50"
          trend="+12%"
          trendDirection="down"
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
          colorTheme="red"
        />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Spending Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Spending Trends (6 Months)</h2>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Current</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                  width={45}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', fontWeight: '500', marginBottom: '4px' }}
                  itemStyle={{ color: '#0f172a', fontWeight: '600' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`$${value}`, 'Amount']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Expense Categories</h2>
          <div className="h-56 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`$${value}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {categoryData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">View all</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Merchant / Service</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-medium text-xs">
                      {tx.icon}
                    </div>
                    <span className="font-semibold text-slate-900">{tx.merchant}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", tx.categoryColor)}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {tx.date}
                  </td>
                  <td className={clsx("px-6 py-4 text-right font-bold", tx.amountColor)}>
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
