"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  IncomeEntry,
  ExpenseEntry,
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  generateId,
} from "@/lib/finance";

interface FinanceContextType {
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  addIncome: (income: Omit<IncomeEntry, "id" | "createdAt">) => void;
  removeIncome: (id: string) => void;
  addExpense: (expense: Omit<ExpenseEntry, "id" | "createdAt">) => void;
  removeExpense: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedIncomes = localStorage.getItem("finance_incomes");
    const storedExpenses = localStorage.getItem("finance_expenses");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIncomes(storedIncomes ? JSON.parse(storedIncomes) : INITIAL_INCOMES);
    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : INITIAL_EXPENSES);
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("finance_incomes", JSON.stringify(incomes));
    }
  }, [incomes, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("finance_expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addIncome = useCallback(
    (income: Omit<IncomeEntry, "id" | "createdAt">) => {
      const newEntry: IncomeEntry = {
        ...income,
        id: generateId(),
        createdAt: Date.now(),
      };
      setIncomes((prev) => [...prev, newEntry]);
    },
    [],
  );

  const removeIncome = useCallback((id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addExpense = useCallback(
    (expense: Omit<ExpenseEntry, "id" | "createdAt">) => {
      const newEntry: ExpenseEntry = {
        ...expense,
        id: generateId(),
        createdAt: Date.now(),
      };
      setExpenses((prev) => [...prev, newEntry]);
    },
    [],
  );

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        addIncome,
        removeIncome,
        addExpense,
        removeExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
