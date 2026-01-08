import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const formData = await request.formData();
  const name = formData.get("name");
  const selectedClass = formData.get("selected_class");

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "invalid name" }, { status: 400 });
  }

  if (typeof selectedClass !== "string" || !selectedClass.trim()) {
    return Response.json({ error: "invalid class" }, { status: 400 });
  }

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        name: name.trim(),
        class: selectedClass.trim(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error(error);
    return Response.json({ error: true }, { status: 500 });
  }

  return Response.json({ ok: true });
}
