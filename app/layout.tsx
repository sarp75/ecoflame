"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isShowcase = usePathname().match("^/showcase(?:/.*)?$");
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>Ecoflame</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Ecoflame is a gamified environmental app that rewards users for eco-friendly actions."
        />
        <link rel="icon" href="/images/i-1.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={
          isShowcase
            ? "antialiased dark min-h-screen overflow-x-hidden overflow-y-scroll"
            : `antialiased dark h-screen max-h-screen overflow-hidden`
        }
        style={
          isShowcase
            ? {
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              }
            : {}
        }
      >
        <Toaster className="select-none" />
        {children}
      </body>
    </html>
  );
}
