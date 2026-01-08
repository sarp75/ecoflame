import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id,name,class,total_xp,coins")
    .order("total_xp", { ascending: false })
    .limit(100);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to load leaderboard" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}

