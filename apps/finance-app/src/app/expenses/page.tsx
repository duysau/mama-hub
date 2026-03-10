"use client";

import { Heading, DataLabel, Button, useExpenses } from "@mamahub/ui";
import { useState } from "react";
import Link from "next/link";

export default function ExpensesDashboard() {
  const {
    data: expenses,
    add: addExpense,
    remove: removeExpense,
    loading,
  } = useExpenses();

  // Form State
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) return;

    await addExpense({
      amount: parseFloat(amount),
      category,
      date,
      notes,
    });

    setAmount("");
    setNotes("");
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Compute stats
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const dailyTotal = expenses
    .filter((e) => e.date === todayString)
    .reduce((sum, e) => sum + e.amount, 0);
  const monthlyTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);
  const yearlyTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === thisYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Housing",
    "Baby",
    "Health",
    "Other",
  ];

  return (
    <div className="min-h-svh bg-background p-6 md:p-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-foreground pb-8">
          <div>
            <DataLabel className="uppercase tracking-widest font-bold text-foreground">
              Module 01.B
            </DataLabel>
            <Heading
              variant="h1"
              className="mt-2 text-foreground tracking-tighter"
            >
              OUTFLOW
            </Heading>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <Link href="/finance">
              <Button
                variant="outline"
                className="rounded-none border-2 border-foreground shadow-hard-sm hover:active-translate h-10 uppercase tracking-widest text-xs"
              >
                ← Back
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="bg-destructive border-2 border-foreground p-6 shadow-hard relative">
              <div className="absolute top-0 right-0 p-2 border-b-2 border-l-2 border-foreground bg-primary text-primary-foreground font-mono text-[10px] font-bold z-10">
                LOG
              </div>

              <Heading
                variant="h4"
                className="mb-6 uppercase text-sm border-b-2 border-foreground/30 pb-2 tracking-widest text-background"
              >
                Record Expenditure
              </Heading>

              <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-background">
                    Amount (VND)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 border-2 border-foreground bg-background px-4 font-mono text-xl font-bold rounded-none shadow-hard-sm focus:translate-y-[2px] focus:translate-x-[2px] transition-all focus:shadow-none outline-none"
                    placeholder="e.g. 50000"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-background">
                    Category
                  </label>
                  <select
                    className="h-10 border-2 border-foreground bg-background px-2 font-mono text-sm uppercase rounded-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-background">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-10 border-2 border-foreground bg-background px-3 font-mono text-sm rounded-none"
                    placeholder="e.g. Lunch with team"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-background">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 border-2 border-foreground bg-background px-3 font-mono text-sm rounded-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  className="h-12 mt-4 uppercase font-bold border-2 border-foreground shadow-hard-sm hover:bg-background hover:text-foreground"
                >
                  Burn Capital
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Stats & Logs */}
          <div className="md:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-card border-2 border-foreground p-6 shadow-hard relative overflow-hidden">
                <DataLabel className="uppercase text-xs font-bold text-foreground/80 relative z-10">
                  Today
                </DataLabel>
                <div className="text-2xl md:text-3xl font-mono font-bold mt-2 relative z-10 text-destructive">
                  -{formatter.format(dailyTotal)}
                </div>
              </div>

              <div className="bg-card border-2 border-foreground p-6 shadow-hard relative overflow-hidden">
                <DataLabel className="uppercase text-xs font-bold text-foreground/80 relative z-10">
                  This Month
                </DataLabel>
                <div className="text-2xl md:text-3xl font-mono font-bold mt-2 relative z-10 text-destructive">
                  -{formatter.format(monthlyTotal)}
                </div>
              </div>

              <div className="bg-secondary border-2 border-foreground p-6 shadow-hard relative overflow-hidden">
                <DataLabel className="uppercase text-xs font-bold text-foreground/80 relative z-10">
                  This Year
                </DataLabel>
                <div className="text-2xl md:text-3xl font-mono font-bold mt-2 relative z-10 text-foreground">
                  -{formatter.format(yearlyTotal)}
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-foreground shadow-hard flex-1 min-h-[300px]">
              <div className="border-b-2 border-foreground p-4 bg-muted">
                <Heading
                  variant="h4"
                  className="uppercase text-sm tracking-widest text-foreground"
                >
                  Transaction Ledger
                </Heading>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <DataLabel>Loading ledger...</DataLabel>
                </div>
              ) : expenses.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center opacity-50">
                  <div className="text-4xl font-serif mb-4">ø</div>
                  <DataLabel>No transactions recorded</DataLabel>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-background">
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70">
                        Date
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70">
                        Category/Notes
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70 text-right">
                        Amount
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70 text-center">
                        Act
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((e) => (
                        <tr
                          key={e.id}
                          className="border-b border-foreground/10 hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-3 text-sm font-mono align-top">
                            {e.date}
                          </td>
                          <td className="p-3 align-top">
                            <div className="text-sm font-bold uppercase">
                              {e.category}
                            </div>
                            {e.notes && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {e.notes}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-sm font-mono font-bold text-destructive text-right align-top">
                            -{formatter.format(e.amount)}
                          </td>
                          <td className="p-3 text-center align-top">
                            <button
                              onClick={() => removeExpense(e.id)}
                              className="text-foreground/50 hover:text-foreground hover:underline text-xs uppercase font-bold"
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
