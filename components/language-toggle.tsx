"use client";

import { useLang } from "@/components/lang-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={cn(
        "fixed right-4 top-4 z-[120] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400",
        className,
      )}
      aria-label={lang === "tr" ? "dili ingilizce yap" : "switch language to turkish"}
    >
      {lang === "tr" ? "🇹🇷" : "🇬🇧"}
    </button>
  );
}

