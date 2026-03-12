"use client";

import { Plus } from "lucide-react";
import clsx from "clsx";

const expenses = [
  { id: 1, date: "Jan 12, 2026", category: "Housing", description: "Monthly Rent Payment", amount: 1800.00, categoryColor: "bg-blue-100 text-blue-700" },
  { id: 2, date: "Jan 15, 2026", category: "Groceries", description: "Whole Foods Market", amount: 156.40, categoryColor: "bg-green-100 text-green-700" },
  { id: 3, date: "Jan 18, 2026", category: "Transport", description: "Gas Station Refill", amount: 65.00, categoryColor: "bg-purple-100 text-purple-700" },
  { id: 4, date: "Jan 20, 2026", category: "Entertainment", description: "Streaming Subscriptions", amount: 45.99, categoryColor: "bg-amber-100 text-amber-700" },
];

export default function Expenses() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Expense Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your monthly spending
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2" htmlFor="month-filter">
            View Month
          </label>
          <select 
            id="month-filter"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option>January 2026</option>
            <option>February 2026</option>
            <option>March 2026</option>
          </select>
        </div>

        <div className="md:col-span-2 bg-indigo-600 text-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="font-medium text-indigo-100 text-sm">Total Monthly Expenses</p>
            <p className="text-4xl font-bold mt-1 tracking-tight">
              $3,450.00
            </p>
          </div>
          <div className="p-3 bg-indigo-500 rounded-full border border-indigo-400/30">
            <span className="font-bold text-xl">$</span>
          </div>
        </div>
      </section>

      <main className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", expense.categoryColor)}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-right tracking-tight">
                    ${expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs italic text-slate-500">Showing 4 of 24 transactions</span>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All
          </button>
        </div>
      </main>
    </div>
  );
}
