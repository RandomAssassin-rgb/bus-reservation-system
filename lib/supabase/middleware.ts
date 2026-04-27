import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  try {
    // Add a race condition to prevent the middleware from hanging the entire site
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
    await Promise.race([supabase.auth.getUser(), timeout]);
  } catch (err) {
    console.warn("Middleware Auth check bypassed due to network delay or failure.");
  }
  
  return response;
}
