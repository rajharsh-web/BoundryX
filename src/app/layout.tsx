import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { DemoBettingProvider } from "@/context/DemoBettingContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { DemoBetSlip } from "@/components/betting/DemoBetSlip";
import { ToastProvider } from "@/components/ui/Toast";
import { TickerWrapper } from "@/components/cricket/TickerWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "cricket scores",
    "live cricket commentary",
    "cricket ball by ball",
    "demo betting simulator",
    "cricket match center",
    siteConfig.name,
  ],
  authors: [{ name: siteConfig.name }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0f14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0f14] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        <DemoBettingProvider>
          <ToastProvider>
            <Suspense fallback={<div className="h-16 bg-[#0e141a] border-b border-[#232f38]" />}>
              <Header />
            </Suspense>
            <Suspense fallback={null}>
              <TickerWrapper />
            </Suspense>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
            <Suspense fallback={null}>
              <BottomNavigation />
            </Suspense>
            <DemoBetSlip />
          </ToastProvider>
        </DemoBettingProvider>
      </body>
    </html>
  );
}

