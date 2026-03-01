import { baseTasks } from "@/lib/tasks";
import { NextRequest } from "next/server";

// deprecated shiiiiiii
export async function GET(_request: NextRequest) {
  // returning the full task payload keeps upload ui and homepage in sync
  return new Response(JSON.stringify(baseTasks), {
    /* headers: {
      "Cache-Control": "public, max-age=3000, stale-while-revalidate=3000",
    },*/
  });
}
