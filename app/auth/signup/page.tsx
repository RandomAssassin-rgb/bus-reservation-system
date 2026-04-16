import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signUp } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <main className="tf-container flex flex-1 items-center py-12">
      <div className="grid w-full gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <Card className="reveal-up premium-card border-0 shadow-xl md:order-1">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-4xl">Create account</CardTitle>
            <p className="text-base text-zinc-500">Start booking with faster checkout and booking history.</p>
          </CardHeader>
          <CardContent className="space-y-5 px-8 pb-8">
            {params.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-base text-red-700">{params.error}</p> : null}
            <form action={signUp} className="space-y-4">
              <Label className="text-base">Email</Label>
              <Input name="email" type="email" className="h-12 text-base" required />
              <Label className="text-base">Password</Label>
              <Input name="password" type="password" className="h-12 text-base" minLength={6} required />
              <SubmitButton pendingLabel="Creating account..." className="mt-2 h-12 w-full bg-[#d84e55] text-lg hover:bg-[#c63f46]">
                Create account
              </SubmitButton>
            </form>
            <p className="text-base text-zinc-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-[#d84e55]">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <section className="reveal-up premium-card relative overflow-hidden md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1400&q=80"
            alt="Premium booking experience"
            width={1400}
            height={900}
            className="parallax-bg h-full min-h-[620px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
          <div className="absolute bottom-0 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Join Now</p>
            <h1 className="mt-2 max-w-md text-5xl font-bold leading-tight">Create your account and unlock premium travel benefits.</h1>
          </div>
        </section>
      </div>
    </main>
  );
}
