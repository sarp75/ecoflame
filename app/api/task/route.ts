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
    .from("tasks")
    .select("*")
    .eq("active", "TRUE");

  if (error) {
    console.error(error);
    return Response.json({ error: true }, { status: 500 });
  }

  return new Response(JSON.stringify(data), {
   /* headers: {
      "Cache-Control": "public, max-age=3000, stale-while-revalidate=3000",
    },*/
  });
}
