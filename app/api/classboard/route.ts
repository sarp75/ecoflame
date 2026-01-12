import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // SELECT class, SUM(xp)
  // FROM profiles
  // GROUP BY class;

  const { data, error } = await supabase.rpc("get_class_xp_totals");

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to load class leaderboard" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // SELECT class, SUM(xp)
  // FROM profiles
  // GROUP BY class;

  const { data, error } = await supabase.rpc("get_class_xp_totals");

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to load class leaderboard" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
