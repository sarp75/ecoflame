import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub;

  const { wantedClass } = await request.json();
  if (typeof wantedClass !== "string" || wantedClass.length === 0) {
    return Response.json({ error: "nigga wgat it is" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("class", wantedClass);

  if (error) {
    console.error(error);
    return Response.json({ error: true }, { status: 500 });
  }

  return Response.json({ data });
}
