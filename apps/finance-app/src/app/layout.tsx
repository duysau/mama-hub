import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";
import { FinanceProvider } from "@/context/FinanceContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinTrack - Personal Finance Manager",
  description: "Minimalist personal finance and gold asset manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <FinanceProvider>
          <Shell>{children}</Shell>
        </FinanceProvider>
      </body>
    </html>
  );
}
