import { NextResponse } from "next/server";
import { dragonPowerScore, xpToLevel } from "@/lib/progression";
import type { UserProfile } from "@/app/page";

const WIN_REWARD = { xp: 80, coins: 35 };
const LOSS_REWARD = { xp: 25, coins: 10 };

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;
    const cookie = request.headers.get("cookie") ?? "";
    const fetchInit: RequestInit = {
      headers: { cookie },
      cache: "no-store",
    };

    const meRes = await fetch(`${origin}/api/info`, fetchInit);
    if (!meRes.ok) {
      return NextResponse.json({ error: "me bilgisi alınamadı" }, { status:  meRes.status });
    }
    const mePayload = await meRes.json();
    const me: UserProfile = mePayload.data ?? mePayload;

    const leaderRes = await fetch(`${origin}/api/leaderboard`, fetchInit);
    if (!leaderRes.ok) {
      return NextResponse.json({ error: "rakip listesi yok" }, { status: leaderRes.status });
    }
    const leaderPayload = await leaderRes.json();
    const roster: UserProfile[] = leaderPayload.data ?? leaderPayload ?? [];
    const opponents = roster.filter((user) => user.user_id !== me.user_id);
    if (!opponents.length) {
      // shit nobody else to fight
      return NextResponse.json({ error: "sadece sen varsın" }, { status: 409 });
    }

    const opponent =
      opponents[Math.floor(Math.random() * opponents.length)];
    const mePower = dragonPowerScore(me.total_xp, me.coins);
    const opponentPower = dragonPowerScore(opponent.total_xp, opponent.coins);
    const meWins =
      mePower === opponentPower ? Math.random() > 0.5 : mePower > opponentPower;
    const reward = meWins ? WIN_REWARD : LOSS_REWARD;

    const updatedMe: UserProfile = {
      ...me,
      total_xp: me.total_xp + reward.xp,
      coins: me.coins + reward.coins,
    };

    const message = meWins
      ? `${me.name} ejderhası seviye ${xpToLevel(updatedMe.total_xp)} ile ateş püskürttü!`
      : `${opponent.name} bu raundu aldı, ama ${me.name} ekstra antrenmanla dönecek.`;

    return NextResponse.json(
      {
        me: updatedMe,
        opponent,
        winnerId: meWins ? me.user_id : opponent.user_id,
        dragonPower: { me: mePower, opponent: opponentPower },
        reward,
        message,
        timestamp: Date.now(),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "savaş başarısız" },
      { status: 500 },
    );
  }
}

