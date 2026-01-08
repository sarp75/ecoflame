"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Loading from "@/app/loading";
import DragonComponent from "@/components/dragon";
import type { UserProfile } from "@/app/page";
import { dragonPowerScore, xpToLevel } from "@/lib/progression";
import { textToColor } from "@/lib/profile";

interface FightReport {
  me: UserProfile;
  opponent: UserProfile;
  winnerId: string;
  dragonPower: { me: number; opponent: number };
  reward: { xp: number; coins: number };
  message: string;
  timestamp: number;
}

export default function FightPage() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [report, setReport] = useState<FightReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFighting, setIsFighting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/info", { cache: "no-store" });
        if (!res.ok) throw new Error("profil yok");
        const json = await res.json();
        setMe(json.data ?? json);
      } catch (err) {
        setError("profil çekilemedi");
      } finally {
        setIsLoading(false);
      }
    };
    loadMe();
  }, []);

  const handleFight = useCallback(async () => {
    if (!me) return;
    setIsFighting(true);
    setError(null);
    try {
      const res = await fetch("/api/fight", { method: "POST" });
      if (!res.ok) throw new Error("savaş başarısız");
      const payload = await res.json();
      setReport(payload);
      setMe(payload.me);
    } catch (err) {
      setError("savaş başlatılamadı");
    } finally {
      setIsFighting(false);
    }
  }, [me]);

  if (isLoading || !me) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gradient-to-b from-[#021505] via-[#0c2b16] to-[#1c4325] p-4 text-emerald-50">
      <header className="flex items-center justify-between rounded-2xl border border-emerald-700/30 bg-white/5 px-4 py-3 shadow-lg shadow-emerald-900/40 backdrop-blur">
        <Button variant="ghost" asChild className="text-emerald-100 hover:bg-emerald-500/10">
          <Link href="/">← Ana Sayfa</Link>
        </Button>
        <div className="flex items-center gap-3 rounded-full border border-emerald-600/40 bg-emerald-900/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
          <span className="text-emerald-100">{me.name}</span>
          <Badge className="border border-emerald-300/60 bg-emerald-500/20 text-emerald-100">
            Lvl {xpToLevel(me.total_xp)}
          </Badge>
        </div>
      </header>
      <section className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-700/30 bg-emerald-900/30 p-6 shadow-inner shadow-black/40">
        <DragonComponent {...me} />
        <div className="flex flex-wrap justify-center gap-3 text-[10px] uppercase tracking-[0.35em] text-emerald-200/90">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-700/30 px-4 py-1">xp · {me.total_xp}</span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-700/30 px-4 py-1">coin · {me.coins}</span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-700/30 px-4 py-1">güç · {dragonPowerScore(me.total_xp, me.coins)}</span>
        </div>
      </section>
      <section className="rounded-3xl border border-emerald-600/40 bg-[#0a1c11]/80 p-4 shadow-[0_0_40px_rgba(5,40,15,0.6)] backdrop-blur">
        <div className="flex flex-col gap-4">
          {report ? (
            <>
              <p className="text-base font-semibold dark:text-white">
                {report.message}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <FighterCard
                  label="Sen"
                  user={report.me}
                  power={report.dragonPower.me}
                  isWinner={report.winnerId === report.me.user_id}
                />
                <FighterCard
                  label="Rakip"
                  user={report.opponent}
                  power={report.dragonPower.opponent}
                  isWinner={report.winnerId === report.opponent.user_id}
                />
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="secondary" className="border border-lime-300/50 bg-lime-400/10 text-lime-50">
                  +{report.reward.xp} XP
                </Badge>
                <Badge variant="secondary" className="border border-amber-300/40 bg-amber-400/10 text-amber-100">
                  +{report.reward.coins} Coin
                </Badge>
                <span className="text-emerald-200/60">
                  {new Date(report.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ejderhan hazır. Rakip bulmak için Savaş başlat.
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button
            onClick={handleFight}
            disabled={isFighting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 py-6 text-lg font-semibold text-zinc-900 shadow-lg shadow-emerald-900/50 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {isFighting ? "Savaş başlıyor..." : "Savaş başlat"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function FighterCard({ label, user, power, isWinner }: { label: string; user: UserProfile; power: number; isWinner: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        isWinner
          ? "border-lime-300 bg-lime-400/10 shadow-[0_0_25px_rgba(166,250,149,0.4)]"
          : "border-emerald-800/40 bg-[#12281a]/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage alt={user.name} />
          <AvatarFallback
            style={{ backgroundColor: textToColor(user.name) }}
          >
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted-foreground">
            {label}
          </span>
          <span className="text-sm font-semibold dark:text-white">
            {user.name}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-[11px] uppercase tracking-[0.3em] text-emerald-200/80">
        <span>Lvl {xpToLevel(user.total_xp)}</span>
        <span>Güç {power}</span>
      </div>
    </div>
  );
}
