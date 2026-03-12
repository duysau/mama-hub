"use client";

import { useState, useMemo } from "react";
import {
  Briefcase,
  TrendingUp,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useFinance } from "@/hooks/useFinance";
import {
  IncomeCategory,
  INCOME_CATEGORIES,
  formatCurrency,
  IncomeEntry,
} from "@/lib/finance";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Salary: Briefcase,
  Freelance: Briefcase,
  Dividends: TrendingUp,
  Rental: HomeIcon,
  Other: Briefcase,
};

const CATEGORY_COLORS: Record<string, string> = {
  Salary: "bg-blue-50 text-blue-600",
  Freelance: "bg-purple-50 text-purple-600",
  Dividends: "bg-emerald-50 text-emerald-600",
  Rental: "bg-orange-50 text-orange-600",
  Other: "bg-slate-50 text-slate-600",
};

export default function Income() {
  const { incomes, addIncome, removeIncome } = useFinance();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<IncomeCategory>("Salary");
  const [company, setCompany] = useState("");

  const totalMonthlyIncome = useMemo(() => {
    return incomes.reduce((sum, item) => sum + item.amount, 0);
  }, [incomes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    addIncome({
      name,
      amount: parseFloat(amount),
      category,
      company: company || "N/A",
      frequency: "Monthly",
    });

    // Reset form
    setName("");
    setAmount("");
    setCompany("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 ease-out">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Income Tracking
        </h1>
        <p className="text-slate-500 mt-1">
          Manage all your revenue streams and salary in one place
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Income This Month
              </span>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-emerald-600 tabular-nums tracking-tight">
                  {formatCurrency(totalMonthlyIncome)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium bg-emerald-50 w-max px-2.5 py-1 rounded-full">
              Live tracking
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Projected Annual Income
              </span>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-slate-900 tabular-nums tracking-tight">
                  {formatCurrency(totalMonthlyIncome * 12)}
                </span>
              </div>
            </div>
            <div className="mt-5">
              <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden w-full">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Based on current monthly average
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List Section */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  Income Sources
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                  {incomes.length} {incomes.length === 1 ? "Source" : "Sources"}
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {incomes.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-slate-400 text-sm italic">
                      No income sources added yet.
                    </p>
                  </div>
                ) : (
                  incomes.map((source: IncomeEntry) => {
                    const Icon = CATEGORY_ICONS[source.category] || Briefcase;
                    return (
                      <div
                        key={source.id}
                        className="px-6 py-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center">
                          <div
                            className={clsx(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              CATEGORY_COLORS[source.category] ||
                                "bg-slate-50 text-slate-600",
                            )}
                          >
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-slate-900">
                              {source.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {source.company} • {source.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                          <p className="text-sm font-bold text-slate-900 tabular-nums">
                            +{formatCurrency(source.amount)}
                          </p>
                          <button
                            onClick={() => removeIncome(source.id)}
                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center group transition-colors">
                  View detailed breakdown
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* Add Form Section */}
          <section className="lg:col-span-1 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-5">
                Add New Income
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Freelance Design"
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Amount (Monthly)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      required
                      className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as IncomeCategory)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white cursor-pointer"
                  >
                    {INCOME_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Tech Corp"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-colors text-sm"
                >
                  Save Income Source
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
