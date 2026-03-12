"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Expenses", href: "/expenses" },
  { name: "Income", href: "/income" },
  { name: "Kho vàng", href: "/gold" },
  { name: "Bảng giá vàng", href: "/gold/list-gold" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                FinTrack
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 h-full items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "inline-flex items-center h-full px-1 border-b-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden relative">
              <Image 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="User Avatar"
                fill
                className="object-cover bg-amber-50"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
