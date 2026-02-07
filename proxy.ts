import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - install cuz it's a one-time setup route
     * - /images cuz it's a folder with static images and shit
     * - /api cuz i don't wanna have a shitload of latency on api routes
     * - showcase cuz its full of static hero shit
     */
    "/((?!_next/static|_next/image|images|install|api|showcase|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
