import { NextResponse } from "next/server";
import { dragonPowerScore, xpToLevel } from "@/lib/progression";
import { createClient } from "@/lib/supabase/server";

const WIN_REWARD = { xp: 80, coins: 35 };
const LOSS_REWARD = { xp: 25, coins: 10 };

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    // supabase claims fetch shiiiii
    const { data: authData, error: authError } =
      await supabase.auth.getClaims();
    if (authError || !authData) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const userId = authData.claims.sub;
    const { data: me, error: meError } = await supabase
      .from("profiles")
      .select("user_id,name,class,total_xp,coins,fights_left")
      .eq("user_id", userId)
      .single();

    if (meError || !me) {
      return NextResponse.json({ error: "profil bulunamadı" }, { status: 404 });
    }

    if (me.fights_left <= 0) {
      return NextResponse.json(
        { error: "bugünlük savaş hakkın kalmadı" },
        { status: 429 },
      );
    }

    const { data: roster, error: rosterError } = await supabase
      .from("profiles")
      .select("user_id,name,class,total_xp,coins")
      .neq("user_id", userId)
      .limit(500);
    if (rosterError) {
      return NextResponse.json({ error: "rakip listesi yok" }, { status: 500 });
    }

    const opponents = roster ?? [];
    if (!opponents.length) {
      return NextResponse.json(
        { error: "dünya senin etrafında dönüyor" },
        { status: 404 },
      );
    }

    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    const mePower = dragonPowerScore(me.total_xp, me.coins);
    const opponentPower = dragonPowerScore(opponent.total_xp, opponent.coins);
    const meWins =
      mePower === opponentPower ? Math.random() > 0.5 : mePower > opponentPower;
    const reward = meWins ? WIN_REWARD : LOSS_REWARD;

    const updatedMe = {
      ...me,
      total_xp: me.total_xp + reward.xp,
      coins: me.coins + reward.coins,
      fights_left: me.fights_left - 1,
    };

    const { data: persisted, error: updateError } = await supabase
      .from("profiles")
      .update({
        total_xp: updatedMe.total_xp,
        coins: updatedMe.coins,
        fights_left: updatedMe.fights_left,
      })
      .eq("user_id", userId)
      .select("user_id,name,class,total_xp,coins")
      .single();
    if (updateError || !persisted) {
      return NextResponse.json(
        { error: "profil güncellenmedi shit" },
        { status: 500 },
      );
    }

    const message = meWins
      ? `${me.name} seviye ${xpToLevel(updatedMe.total_xp)} ejderiyle dehşet saçtı!`
      : `${opponent.name} bu raundu aldı, ama ${me.name} ekstra antrenmanla dönecek.`;

    return NextResponse.json(
      {
        me: persisted,
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
    return NextResponse.json({ error: "savaş başarısız" }, { status: 500 });
  }
}
