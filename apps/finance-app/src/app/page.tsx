"use client";

import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import MetricCard from "@/components/ui/MetricCard";
import { useFinance } from "@/hooks/useFinance";
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/finance";
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

export default function Home() {
  const { incomes, expenses } = useFinance();

  // Aggregate Data
  const totalIncome = useMemo(() => incomes.reduce((sum, item) => sum + item.amount, 0), [incomes]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalBalance = totalIncome - totalExpenses;

  // Recent Activity (Limit to 5)
  const recentTransactions = useMemo(() => {
    const combined = [
      ...incomes.map(i => ({ 
        id: i.id, 
        merchant: i.name, 
        icon: "IN", 
        category: i.category, 
        amount: i.amount, 
        type: "income" as const,
        timestamp: i.createdAt
      })),
      ...expenses.map(e => ({ 
        id: e.id, 
        merchant: e.description, 
        icon: "EX", 
        category: e.category, 
        amount: e.amount, 
        type: "expense" as const,
        timestamp: e.createdAt || new Date(e.date).getTime()
      })),
    ];
    
    return combined
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [incomes, expenses]);

  // Category Chart Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    expenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + e.amount;
    });

    return EXPENSE_CATEGORIES.map(cat => ({
      name: cat.name,
      value: counts[cat.name] || 0,
      color: cat.bg.split('-')[1] === 'blue' ? '#3b82f6' : 
             cat.bg.split('-')[1] === 'green' ? '#22c55e' : 
             cat.bg.split('-')[1] === 'purple' ? '#f59e0b' : 
             cat.bg.split('-')[1] === 'amber' ? '#a855f7' : '#94a3b8'
    })).filter(c => c.value > 0);
  }, [expenses]);

  // Simple Spending Trends (Last 6 entries if available)
  const spendingData = useMemo(() => {
    if (expenses.length === 0) return [{ name: "Current", amount: 0 }];
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.slice(-6).map(e => ({ name: e.date.split('-')[2], amount: e.amount }));
  }, [expenses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          trend="Lifetime"
          trendDirection="neutral"
          icon={<Wallet className="w-5 h-5 text-blue-600" />}
          colorTheme="blue"
        />
        <MetricCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          trend="All time"
          trendDirection="up"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          colorTheme="green"
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          trend="All time"
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
            <h2 className="text-lg font-semibold text-slate-800">Recent Spending</h2>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Actual</span>
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
            {categoryData.length > 0 ? (
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
            ) : (
              <div className="text-slate-400 text-sm italic">No expense data</div>
            )}
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

      {/* Recent Activity */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
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
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", 
                      tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                     {tx.type === "expense" ? (expenses.find(e => e.id === tx.id)?.date || "Today") : "Today"}
                  </td>
                  <td className={clsx("px-6 py-4 text-right font-bold", 
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  )}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
