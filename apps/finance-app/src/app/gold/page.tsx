"use client";

import { Heading, DataLabel, Button, useGoldPortfolio } from "@mamahub/ui";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function GoldDashboard() {
  const {
    data: gold,
    add: addGold,
    remove: removeGold,
    loading,
  } = useGoldPortfolio();
  const [livePrices, setLivePrices] = useState<
    { type_code: string; buy: number; sell: number }[]
  >([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  console.log("livePrices", livePrices);

  // Form State
  const [typeCode, setTypeCode] = useState("SJL1L10");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Fetch API
  useEffect(() => {
    let active = true;
    const fetchPrices = async () => {
      try {
        const res = await fetch("/finance/api/prices");
        const json = await res.json();
        console.log("res", res);
        if (json.success && active) {
          setLivePrices(json.data);
          setPricesLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch gold prices", e);
        setPricesLoading(false);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleAddGold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !buyPrice || !buyDate) return;

    await addGold({
      type_code: typeCode,
      quantity: parseFloat(quantity),
      buy_price: parseFloat(buyPrice),
      buy_date: buyDate,
    });

    setQuantity("");
    setBuyPrice("");
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Compute stats
  const totalVolume = gold.reduce((sum, item) => sum + item.quantity, 0);

  const getLivePrice = (code: string) => {
    const p = livePrices.find((x) => x.type_code === code);
    return p ? p.buy : 0;
  };

  const currentTotalValue = gold.reduce((sum, item) => {
    const currentPrice = getLivePrice(item.type_code) || item.buy_price;
    return sum + currentPrice * item.quantity;
  }, 0);

  const totalInvested = gold.reduce(
    (sum, item) => sum + item.buy_price * item.quantity,
    0,
  );
  const profit = currentTotalValue - totalInvested;

  return (
    <div className="min-h-svh bg-background p-6 md:p-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-foreground pb-8">
          <div>
            <DataLabel className="uppercase tracking-widest font-bold text-foreground">
              Module 01.A
            </DataLabel>
            <Heading
              variant="h1"
              className="mt-2 text-foreground tracking-tighter"
            >
              GOLD_ASSETS
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
          {/* Left Column: Live Prices & Input */}
          <div className="md:col-span-4 flex flex-col gap-8">
            {/* Live Data Ticker */}
            <div className="bg-foreground text-background p-6 shadow-hard relative">
              <Heading
                variant="h4"
                className="text-secondary mb-4 uppercase text-sm border-b border-secondary/30 pb-2 tracking-widest"
              >
                Live Market Rates
              </Heading>
              {pricesLoading ? (
                <DataLabel className="text-background/50">
                  Fetching consensus...
                </DataLabel>
              ) : (
                <div className="flex flex-col gap-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {livePrices.map((p) => (
                    <div
                      key={p.type_code}
                      className="flex justify-between items-end border-b border-background/20 pb-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-background">
                          {p.type_code}
                        </span>
                        <span className="text-xs text-secondary">
                          Buy: {formatter.format(p.buy)}
                        </span>
                      </div>
                      <span className="font-mono text-sm text-destructive font-bold">
                        {formatter.format(p.sell)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="bg-card border-2 border-foreground p-6 shadow-hard">
              <Heading
                variant="h4"
                className="mb-6 uppercase text-sm border-b-2 border-foreground pb-2 tracking-widest"
              >
                Log Asset Acquisition
              </Heading>

              <form onSubmit={handleAddGold} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-foreground/80">
                    Asset Type
                  </label>
                  <select
                    className="h-10 border-2 border-foreground bg-background px-2 font-mono text-sm uppercase rounded-none"
                    value={typeCode}
                    onChange={(e) => setTypeCode(e.target.value)}
                  >
                    {livePrices.map((p) => (
                      <option key={p.type_code} value={p.type_code}>
                        {p.type_code}
                      </option>
                    ))}
                    {livePrices.length === 0 && (
                      <option value="SJL1L10">SJL1L10 (SJC)</option>
                    )}
                    {livePrices.length === 0 && (
                      <option value="XAUUSD">XAUUSD</option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-foreground/80">
                    Volume (Lượng)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-10 border-2 border-foreground bg-background px-3 font-mono text-sm rounded-none"
                    placeholder="e.g. 1.5"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-foreground/80">
                    Acquisition Price (Per Unit)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="h-10 border-2 border-foreground bg-background px-3 font-mono text-sm rounded-none"
                    placeholder="e.g. 85500000"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase text-foreground/80">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={buyDate}
                    onChange={(e) => setBuyDate(e.target.value)}
                    className="h-10 border-2 border-foreground bg-background px-3 font-mono text-sm rounded-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 mt-4 uppercase font-bold border-2 border-foreground shadow-hard-sm"
                >
                  Commit Record
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Portfolio & Stats */}
          <div className="md:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-secondary border-2 border-foreground p-6 shadow-hard relative">
                <div className="absolute top-0 right-0 p-2 border-b-2 border-l-2 border-foreground bg-primary text-primary-foreground font-mono text-[10px] font-bold">
                  VOL
                </div>
                <DataLabel className="uppercase text-xs font-bold text-foreground/80">
                  Total Volume
                </DataLabel>
                <div className="text-4xl font-serif font-bold mt-2">
                  {totalVolume.toFixed(2)} Lượng
                </div>
              </div>

              <div className="bg-card border-2 border-foreground p-6 shadow-hard relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 border-b-2 border-l-2 border-foreground bg-primary text-primary-foreground font-mono text-[10px] font-bold z-10">
                  VAL
                </div>
                <DataLabel className="uppercase text-xs font-bold text-foreground/80 relative z-10">
                  Liquid Value
                </DataLabel>
                <div className="text-3xl md:text-4xl font-mono font-bold mt-2 relative z-10 text-foreground">
                  {formatter.format(currentTotalValue)}
                </div>
                {profit > 0 ? (
                  <div className="text-sm font-bold text-secondary mt-1 relative z-10">
                    +{formatter.format(profit)} (Profit)
                  </div>
                ) : profit < 0 ? (
                  <div className="text-sm font-bold text-destructive mt-1 relative z-10">
                    {formatter.format(profit)} (Loss)
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-card border-2 border-foreground shadow-hard flex-1 min-h-[300px]">
              <div className="border-b-2 border-foreground p-4 bg-muted">
                <Heading
                  variant="h4"
                  className="uppercase text-sm tracking-widest text-foreground"
                >
                  Ledger Logs
                </Heading>
              </div>
              {loading ? (
                <div className="p-8 flex justify-center">
                  <DataLabel>Loading ledger...</DataLabel>
                </div>
              ) : gold.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center opacity-50">
                  <div className="text-4xl font-serif mb-4">ø</div>
                  <DataLabel>No assets recorded</DataLabel>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-foreground bg-background">
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70">
                        Date
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70">
                        Type
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70 text-right">
                        Vol
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70 text-right">
                        Buy Price
                      </th>
                      <th className="p-3 text-xs uppercase font-bold text-foreground/70 text-center">
                        Act
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gold
                      .sort(
                        (a, b) =>
                          new Date(b.buy_date).getTime() -
                          new Date(a.buy_date).getTime(),
                      )
                      .map((g) => (
                        <tr
                          key={g.id}
                          className="border-b border-foreground/20 hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-3 text-sm font-mono">
                            {g.buy_date}
                          </td>
                          <td className="p-3 text-sm font-bold">
                            {g.type_code}
                          </td>
                          <td className="p-3 text-sm font-mono text-right">
                            {g.quantity}
                          </td>
                          <td className="p-3 text-sm font-mono text-right">
                            {formatter.format(g.buy_price)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => removeGold(g.id)}
                              className="text-destructive hover:underline text-xs uppercase font-bold"
                            >
                              Void
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
