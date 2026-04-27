import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

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
    <main className="mx-auto max-w-6xl px-4 py-24 min-h-[90vh] flex items-center justify-center">
      <div className="grid w-full gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
        {/* Visual Section */}
        <section className="reveal-up scroll-reveal relative h-[700px] rounded-[3rem] overflow-hidden border border-white/5">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80"
            alt="Premium travel"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-12 space-y-4">
            <div className="size-12 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
              <Sparkles className="size-6 text-primary" />
            </div>
            <h1 className="text-5xl font-bold leading-tight premium-gradient-text">Unlock Elite Travel.</h1>
            <p className="text-white/40 text-lg max-w-sm">Sign in to access priority bookings, premium fleet updates, and member-only pricing.</p>
          </div>
        </section>

        {/* Form Section */}
        <div className="reveal-up scroll-reveal">
          <Card className="glass-darker border-white/5 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="size-24" />
            </div>
            
            <CardHeader className="px-8 pt-10 text-center md:text-left">
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Member Portal</p>
              <CardTitle className="text-4xl font-bold">Welcome Back</CardTitle>
              <p className="text-white/30 text-sm mt-3">Enter your credentials to manage your expeditions.</p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-12 pt-4">
              {params.error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  <AlertCircle className="size-4" /> {params.error}
                </div>
              )}
              {params.success && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <CheckCircle2 className="size-4" /> {params.success}
                </div>
              )}

              <form action={signIn} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Domain</Label>
                  <Input name="email" type="email" placeholder="explorer@travel.com" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all px-4" required />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Access Key</Label>
                  <Input name="password" type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all px-4" required />
                </div>

                <SubmitButton pendingLabel="Verifying Elite Access..." className="mt-4 h-14 w-full rounded-2xl text-lg font-bold shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]">
                  Sign In
                </SubmitButton>
              </form>

              <div className="pt-4 text-center">
                <p className="text-sm text-white/40">
                  New explorer?{" "}
                  <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                    Create elite account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
