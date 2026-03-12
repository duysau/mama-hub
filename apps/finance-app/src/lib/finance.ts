export type IncomeCategory = 'Salary' | 'Freelance' | 'Dividends' | 'Rental' | 'Other';
export type ExpenseCategory = 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Shopping' | 'Health' | 'Other';

export interface IncomeEntry {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  company: string;
  frequency: string;
  createdAt: number;
}

export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  createdAt: number;
}

export const INCOME_CATEGORIES: IncomeCategory[] = ['Salary', 'Freelance', 'Dividends', 'Rental', 'Other'];

export const EXPENSE_CATEGORIES: { name: ExpenseCategory; color: string; bg: string }[] = [
  { name: 'Housing', color: 'text-blue-700', bg: 'bg-blue-100' },
  { name: 'Food', color: 'text-green-700', bg: 'bg-green-100' },
  { name: 'Transport', color: 'text-purple-700', bg: 'bg-purple-100' },
  { name: 'Entertainment', color: 'text-amber-700', bg: 'bg-amber-100' },
  { name: 'Utilities', color: 'text-slate-700', bg: 'bg-slate-100' },
  { name: 'Shopping', color: 'text-pink-700', bg: 'bg-pink-100' },
  { name: 'Health', color: 'text-rose-700', bg: 'bg-rose-100' },
  { name: 'Other', color: 'text-gray-700', bg: 'bg-gray-100' },
];

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getCurrentMonth = () => {
  return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

export const getMonthYear = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

export const INITIAL_INCOMES: IncomeEntry[] = [
  { id: '1', name: 'Main Salary', amount: 5500, category: 'Salary', company: 'Tech Corp Inc.', frequency: 'Monthly', createdAt: Date.now() },
  { id: '2', name: 'UI Design Freelance', amount: 2200, category: 'Freelance', company: 'Upwork Client', frequency: 'Project-based', createdAt: Date.now() },
];

export const INITIAL_EXPENSES: ExpenseEntry[] = [
  { id: 'e1', description: 'Monthly Rent', amount: 1800, category: 'Housing', date: '2026-03-01', createdAt: Date.now() },
  { id: 'e2', description: 'Groceries', amount: 156.40, category: 'Food', date: '2026-03-05', createdAt: Date.now() },
];
