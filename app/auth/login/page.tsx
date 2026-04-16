import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="tf-container flex flex-1 items-center py-12">
      <div className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <section className="reveal-up premium-card relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80"
            alt="Premium travel"
            width={1400}
            height={900}
            className="parallax-bg h-full min-h-[620px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
          <div className="absolute bottom-0 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Welcome Back</p>
            <h1 className="mt-2 max-w-md text-5xl font-bold leading-tight">Sign in to continue your premium booking experience.</h1>
          </div>
        </section>

        <Card className="reveal-up premium-card border-0 shadow-xl">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-4xl">Login</CardTitle>
            <p className="text-base text-zinc-500">Use your account to manage bookings and payments.</p>
          </CardHeader>
          <CardContent className="space-y-5 px-8 pb-8">
            {params.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-base text-red-700">{params.error}</p> : null}
            {params.success ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-base text-green-700">{params.success}</p> : null}
            <form action={signIn} className="space-y-4">
              <Label className="text-base">Email</Label>
              <Input name="email" type="email" className="h-12 text-base" required />
              <Label className="text-base">Password</Label>
              <Input name="password" type="password" className="h-12 text-base" required />
              <SubmitButton pendingLabel="Signing in..." className="mt-2 h-12 w-full bg-[#d84e55] text-lg hover:bg-[#c63f46]">
                Sign in
              </SubmitButton>
            </form>
            <p className="text-base text-zinc-600">
              New here?{" "}
              <Link href="/auth/signup" className="font-semibold text-[#d84e55]">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
