"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import clsx from "clsx";
import { useFinance } from "@/hooks/useFinance";
import {
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  formatCurrency,
  ExpenseEntry,
} from "@/lib/finance";

export default function Expenses() {
  const { expenses, addExpense, removeExpense } = useFinance();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Housing");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const totalMonthlyExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
    });

    // Reset form
    setDescription("");
    setAmount("");
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 ease-out">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Expenses
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Track and manage your monthly spending.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Cancel" : "Add Expense"}
        </button>
      </header>

      {showAddForm && (
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Add New Expense
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rent, Groceries..."
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <label
            className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2"
            htmlFor="month-filter"
          >
            Viewing Transactions For
          </label>
          <select
            id="month-filter"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option>Current Month</option>
          </select>
        </div>

        <div className="md:col-span-2 bg-indigo-600 p-6 rounded-2xl shadow-lg border border-indigo-500 flex items-center justify-between text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-500/20 w-32 h-32 rounded-full transform group-hover:scale-110 transition-transform duration-500"></div>
          <div>
            <p className="font-medium text-indigo-100 text-sm">
              Total Monthly Expenses
            </p>
            <p className="text-4xl font-bold mt-1 tracking-tight">
              {formatCurrency(totalMonthlyExpenses)}
            </p>
          </div>
          <div className="p-3 bg-indigo-500 rounded-full border border-indigo-400/30">
            <Wallet className="w-6 h-6 text-indigo-100" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            Recent Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          {expenses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400 text-sm italic">
                No expenses recorded yet.
              </p>
            </div>
          ) : (
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...expenses]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((expense: ExpenseEntry) => {
                    const catConfig = EXPENSE_CATEGORIES.find(
                      (c) => c.name === expense.category,
                    );
                    return (
                      <tr
                        key={expense.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {expense.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={clsx(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                              catConfig?.bg,
                              catConfig?.color,
                            )}
                          >
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-right tracking-tight">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs italic text-slate-500">
            Showing {expenses.length} transactions
          </span>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All
          </button>
        </div>
      </section>
    </div>
  );
}
