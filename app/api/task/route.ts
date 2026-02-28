import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

const hardcodedTasks = [
  {
    id: "bottle",
    proof_type: "image",
    xp: 150,
    active: true,
    desc: "Plastik bir şişeyi geri dönüşüme at",
    name: "Şişe",
  },
  {
    id: "metal",
    proof_type: "image",
    xp: 200,
    active: true,
    desc: "Metal bir atığı geri dönüşüme at",
    name: "Metal",
  },
  {
    id: "paper",
    proof_type: "image",
    xp: 100,
    active: true,
    desc: "Kağıdı geri dönüşüme at.",
    name: "Kağıt",
  },
];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  //const { data: authData, error: authError } = await supabase.auth.getClaims();

  const data = hardcodedTasks.map((task) => task.id);

  // if (authError || !authData) {
  //  return Response.json({ error: "unauthorized" }, { status: 401 });
  //}
  //const userId = authData.claims.sub;

  //const { data, error } = await supabase
  //.from("tasks")
  //.select("*")
  //.eq("active", "TRUE");

  //if (error) {
  // console.error(error);
  // return Response.json({ error: true }, { status: 500 });
  //}

  return new Response(JSON.stringify(data), {
    /* headers: {
      "Cache-Control": "public, max-age=3000, stale-while-revalidate=3000",
    },*/
  });
}
