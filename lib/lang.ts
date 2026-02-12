"use client";
// sofistike dil utili
export type Lang = "en" | "tr";

const COOKIE_NAME = "lang";
// bir yılda 60 saniye * 60 dakika * 24 saat * 365 gün
const YEAR = 60 * 60 * 24 * 365;

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";

  return navigator.language?.startsWith("tr") ? "tr" : "en";
}

export function setLangCookie(lang: Lang) {
  if (typeof document === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=${YEAR}; SameSite=Lax`;
}

export function getLangCookie(): Lang | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"),
  );

  return match ? (match[2] as Lang) : null;
}

export function initLangCookie(): Lang {
  const existing = getLangCookie();
  if (existing) return existing;

  const detected = detectLang();
  setLangCookie(detected);
  return detected;
}
