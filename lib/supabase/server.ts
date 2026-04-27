import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn("[Supabase] URL is missing! Running in safety mode.");
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (err) {
            // This can fail in Server Components, which is expected
          }
        },
      },
      // Force fetch to handle connection errors without crashing the process
      global: {
        fetch: (...args) => fetch(...args).catch(err => {
          console.error("[Supabase Fetch Error]:", err.message);
          throw err; // Still throw so Supabase knows it failed, but we log it now
        })
      }
    }
  );
}
