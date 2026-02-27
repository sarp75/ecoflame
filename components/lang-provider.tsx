"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initLangCookie, Lang, setLangCookie } from "@/lib/lang";

type Copy = { tr: string; en: string };

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (copy: Copy | string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const current = initLangCookie();
    setLangState(current);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangCookie(next);
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "tr" ? "en" : "tr";
      setLangCookie(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (copy: Copy | string) => {
      if (typeof copy === "string") return copy;
      return lang === "tr" ? copy.tr : copy.en;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("LangProvider missing in tree");
  return ctx;
}

export type { Copy };
