import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect user to specified redirect URL or root of app
      // Check for forwarded host from Vercel/etc
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalHost = request.url.includes("localhost");
      
      if (isLocalHost) {
        return NextResponse.redirect(`${request.nextUrl.origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${request.nextUrl.origin}${next}`);
      }
    }
  }

  // Redirect to error page or login with an error
  return NextResponse.redirect(`${request.nextUrl.origin}/auth/login?error=Invalid%20or%20expired%20confirmation%20link`);
}
