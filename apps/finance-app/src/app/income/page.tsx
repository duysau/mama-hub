"use client";

import { Briefcase, TrendingUp, Home as HomeIcon, ChevronRight } from "lucide-react";
import clsx from "clsx";

const incomeSources = [
  { id: 1, name: "Main Salary", company: "Tech Corp Inc.", frequency: "Monthly", amount: 5500.00, iconBg: "bg-blue-50 text-blue-600", icon: Briefcase },
  { id: 2, name: "UI Design Freelance", company: "Upwork Client", frequency: "Project-based", amount: 2200.00, iconBg: "bg-purple-50 text-purple-600", icon: Briefcase },
  { id: 3, name: "Stock Dividends", company: "Portfolio Alpha", frequency: "Quarterly", amount: 450.00, iconBg: "bg-emerald-50 text-emerald-600", icon: TrendingUp },
  { id: 4, name: "Studio Rental", company: "Property B", frequency: "Monthly", amount: 300.00, iconBg: "bg-orange-50 text-orange-600", icon: HomeIcon },
];

export default function Income() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 ease-out">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Income Tracker
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage and project your monthly earnings
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Income This Month</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-bold text-emerald-600 tabular-nums tracking-tight">$8,450.00</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium bg-emerald-50 w-max px-2.5 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1.5" />
            12% from last month
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Projected Annual Income</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-bold text-slate-900 tabular-nums tracking-tight">$101,400.00</span>
            </div>
          </div>
          <div className="mt-5">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Based on current monthly average</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:sticky lg:top-24">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Add New Income</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Source Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Freelance Design" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white cursor-pointer">
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Dividends</option>
                  <option>Rental</option>
                  <option>Other</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-colors mt-2 text-sm"
              >
                Add Income
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-base font-semibold text-slate-900">
                Income Sources
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                4 Sources
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {incomeSources.map((source) => {
                const Icon = source.icon;
                return (
                  <div key={source.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0", source.iconBg)}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">{source.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{source.company} • {source.frequency}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                      <p className="text-sm font-bold text-slate-900 tabular-nums">
                        +${source.amount.toFixed(2)}
                      </p>
                      <button className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors mt-1">
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center group transition-colors">
                View Detailed History
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
