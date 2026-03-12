import { ReactNode } from "react";
import Header from "./Header";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
