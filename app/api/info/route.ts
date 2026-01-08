import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error);
    return Response.json({ error: true }, { status: 500 });
  }

  return Response.json({ data });
}
