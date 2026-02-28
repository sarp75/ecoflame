"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/app/page";
import { xpToLevel } from "@/lib/progression";
import DragonVisuals from "@/components/dragon-visuals";
import { useLang } from "@/components/lang-provider";

const HABITATS = [
  { bg: "from-[#041106] via-[#0f2b16] to-[#1f4f2c]", title: "Tohum Diyarı" },
  { bg: "from-[#06160a] via-[#12381f] to-[#225f37]", title: "Yeşim İnİ" },
  { bg: "from-[#091d0d] via-[#164529] to-[#2d7a4f]", title: "Işık Ormanı" },
  { bg: "from-[#0b1f0c] via-[#1e5c34] to-[#3a8c54]", title: "Spiral Vadisi" },
  { bg: "from-[#0e2410] via-[#23623a] to-[#47a366]", title: "Yaşam Kubbesi" },
  { bg: "from-[#112a12] via-[#2f7346] to-[#5dbc7f]", title: "Zümrüt Tacı" },
  { bg: "from-[#142f16] via-[#388256] to-[#7fd49f]", title: "Aurora Çayırı" },
  { bg: "from-[#17381b] via-[#3f9b64] to-[#9af7ba]", title: "Solar Bahçe" },
  { bg: "from-[#1b3f21] via-[#44b978] to-[#b4ffd0]", title: "Sonsuz Koru" },
];
const TIPS = [
  {
    tr: "şşş {name}, seviye {level} sonrası yeni habitat açılıyor",
    en: "psst {name}, a new habitat unlocks after level {level}",
  },
  {
    tr: "klanın güçlü mü {name}? ejderhanla göster!",
    en: "is your clan strong {name}? show it with your dragon!",
  },
  {
    tr: "bugün {name} tam {level} level, kimse bulaşmasın.",
    en: "today {name} is level {level}, better not mess around.",
  },
  {
    tr: "coin sayısı {coins}, biraz görevle arttıralım mı?",
    en: "coins: {coins}, want to boost it with a task?",
  },
  {
    tr: "{name}, su iyi giderdi! {coins} coin ile depo doldurursun.",
    en: "{name}, water sounds great! {coins} coins can fill the tank.",
  },
  {
    tr: "{name}, ejderha bakımı sabır ister, acele etme.",
    en: "{name}, dragon care needs patience, no rush.",
  },
];

export default function DragonComponent(me: UserProfile) {
  const { t } = useLang();
  const level = xpToLevel(me.total_xp);
  const stage = useMemo(
    () => Math.min(HABITATS.length - 1, Math.floor(level / 5)),
    [level],
  );
  const tips = useMemo(() => TIPS.map((entry) => t(entry)), [t]);
  const tipCount = Math.max(1, tips.length);
  const [tipIndex, setTipIndex] = useState(0);
  const [isExcited, setIsExcited] = useState(false);

  useEffect(() => {
    const handle = setInterval(
      () => setTipIndex((prev) => (prev + 1) % tipCount),
      6000,
    );
    return () => clearInterval(handle);
  }, [tipCount]);

  useEffect(() => {
    if (!isExcited) return;
    const timeout = setTimeout(() => setIsExcited(false), 1200);
    return () => clearTimeout(timeout);
  }, [isExcited]);

  const activeTip = useMemo(
    () =>
      (tips[tipIndex % tipCount] ?? "")
        .replaceAll("{name}", me.name)
        .replaceAll("{coins}", String(me.coins))
        .replaceAll("{level}", String(level)),
    [tipIndex, tipCount, tips, me.name, me.coins, level],
  );

  const dragonPose = isExcited
    ? "scale-110 rotate-3 animate-pulse"
    : "animate-bounce";

  return (
    <section className="relative w-full max-w-3xl text-center">
      <div
        className={`relative isolate overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br p-6 text-lime-100 shadow-[0_20px_60px_rgba(3,28,12,0.8)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent)] before:opacity-60 before:content-[''] ${HABITATS[stage].bg}`}
      >
        <div className="absolute inset-x-6 top-4 flex justify-between text-xs uppercase text-white/70">
          <span>{HABITATS[stage].title}</span>
          <span>lvl {level}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pt-8">
          <button
            type="button"
            onClick={() => setIsExcited(true)}
            className={`relative isolate flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-r from-lime-300/20 via-emerald-400/30 to-lime-200/20 text-6xl text-white shadow-[0_0_35px_rgba(124,255,170,0.4)] ring-2 ring-white/10 transition-all duration-400 ${dragonPose}`}
            aria-label="ejderhayı sev"
          >
            <DragonVisuals me={me} />
            <span className="absolute inset-0 -z-10 rounded-full bg-lime-400/20 blur-3xl" />
          </button>
          <div
            className="relative rounded-2xl bg-white/95 px-5 py-3 text-sm font-medium text-emerald-900 shadow-xl shadow-emerald-900/30"
            aria-live="polite"
          >
            {activeTip}
            <span className="absolute left-1/2 top-full -mt-2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white/90" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.35em] text-white/80">
            <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
              coins {me.coins}
            </span>
            <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
              xp {me.total_xp}
            </span>
            <span className="rounded-full border border-white/40 bg-white/10 px-4 py-1">
              lvl {level}
            </span>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.35em] text-lime-100/80">
            <span className="rounded-2xl border border-lime-200/40 bg-lime-300/10 px-3 py-2">
              ruh akışı +{me.coins}
            </span>
            <span className="rounded-2xl border border-emerald-200/40 bg-emerald-300/10 px-3 py-2">
              denge {(level + 7) * 7 - 8}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
