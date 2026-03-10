"use client";

import {
  Heading,
  DataLabel,
  Button,
  useExpenses,
  useGoldPortfolio,
} from "@mamahub/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FinanceDashboard() {
  const { data: expenses, loading: expensesLoading } = useExpenses();
  const { data: gold, loading: goldLoading } = useGoldPortfolio();

  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  // Calculate total expenses this month
  const thisMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  // Fetch live gold prices to calculate portfolio value
  useEffect(() => {
    let active = true;
    const fetchPrices = async () => {
      try {
        const res = await fetch("/finance/api/prices");
        const json = await res.json();
        if (json.success && active) {
          const map: Record<string, number> = {};
          json.data.forEach((item: { type_code: string; buy: number }) => {
            map[item.type_code] = item.buy;
          });
          setLivePrices(map);
        }
      } catch (e) {
        console.error("Failed to fetch gold prices", e);
      }
    };
    fetchPrices();

    // Refresh every 60s
    const interval = setInterval(fetchPrices, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate total gold value directly during render to avoid cascading useEffects
  const totalGoldValue = gold.reduce((sum, g) => {
    const currentPricePerLuong = livePrices[g.type_code] || g.buy_price; // fallback to buy price
    // Assume g.quantity is stored in Lượng
    return sum + currentPricePerLuong * g.quantity;
  }, 0);

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="min-h-svh bg-background p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b-2 border-foreground pb-8">
          <div>
            <DataLabel className="uppercase tracking-widest font-bold text-foreground">
              Module 01
            </DataLabel>
            <Heading
              variant="h1"
              className="mt-2 text-foreground tracking-tighter"
            >
              CAPITAL
            </Heading>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-none border-2 border-foreground shadow-hard-sm hover:active-translate h-10"
              >
                RETURN TO HQ
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Net Worth Summary - Spans 8 cols */}
          <div className="md:col-span-8 bg-card border-2 border-foreground p-8 shadow-hard relative">
            <div className="absolute top-0 right-0 p-2 border-b-2 border-l-2 border-foreground bg-primary text-primary-foreground font-mono text-[10px] font-bold">
              NET_WORTH
            </div>

            <Heading variant="h3" className="mb-8">
              Portfolio Overview
            </Heading>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <DataLabel className="uppercase text-xs font-bold text-foreground/70">
                  Gold Assets (Live)
                </DataLabel>
                {goldLoading ? (
                  <div className="h-8 bg-muted animate-pulse" />
                ) : (
                  <div className="text-2xl md:text-3xl font-mono font-bold text-foreground">
                    {formatter.format(totalGoldValue)}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <DataLabel className="uppercase text-xs font-bold text-foreground/70">
                  Stock/Savings
                </DataLabel>
                <div className="text-2xl md:text-3xl font-mono font-bold text-muted-foreground">
                  ₫0
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <DataLabel className="uppercase text-xs font-bold text-destructive">
                  Expenses (Month)
                </DataLabel>
                {expensesLoading ? (
                  <div className="h-8 bg-muted animate-pulse" />
                ) : (
                  <div className="text-2xl md:text-3xl font-mono font-bold text-destructive">
                    -{formatter.format(thisMonthExpenses)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Spans 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              href="/expenses"
              className="group flex-1 bg-destructive border-2 border-foreground p-6 shadow-hard hover:active-translate flex flex-col justify-between transition-all"
            >
              <div>
                <DataLabel className="uppercase text-xs font-bold text-destructive-foreground">
                  Action
                </DataLabel>
                <Heading
                  variant="h4"
                  className="text-destructive-foreground mt-2"
                >
                  Log Expense
                </Heading>
              </div>
              <div className="self-end mt-4 text-destructive-foreground font-serif text-2xl group-hover:translate-x-2 transition-transform">
                →
              </div>
            </Link>

            <Link
              href="/gold"
              className="group flex-1 bg-secondary border-2 border-foreground p-6 shadow-hard hover:active-translate flex flex-col justify-between transition-all"
            >
              <div>
                <DataLabel className="uppercase text-xs font-bold text-secondary-foreground">
                  Action
                </DataLabel>
                <Heading
                  variant="h4"
                  className="text-secondary-foreground mt-2"
                >
                  Manage Gold
                </Heading>
              </div>
              <div className="self-end mt-4 text-secondary-foreground font-serif text-2xl group-hover:translate-x-2 transition-transform">
                →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
