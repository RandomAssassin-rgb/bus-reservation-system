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
          } catch (err) {}
        },
      },
      global: {
        fetch: async (url, options) => {
          return fetch(url, {
            ...options,
            // Override the signals to prevent hanging fetches
            signal: options?.signal || AbortSignal.timeout(10000), 
          }).catch(err => {
            console.error("DEBUG: Global Supabase Fetch Failed!", {
              url,
              error: err.message,
              stack: err.stack?.split("\n")[0]
            });
            throw err;
          });
        }
      }
    }
  );
}

