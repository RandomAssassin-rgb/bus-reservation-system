import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signUp } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { UserPlus, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";

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
    <main className="mx-auto max-w-6xl px-4 py-24 min-h-[90vh] flex items-center justify-center">
      <div className="grid w-full gap-8 md:grid-cols-[0.9fr_1.1fr] items-center">
        {/* Form Section */}
        <div className="reveal-up scroll-reveal md:order-1">
          <Card className="glass-darker border-white/5 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 p-8 opacity-5">
              <UserPlus className="size-24" />
            </div>
            
            <CardHeader className="px-8 pt-10 text-center md:text-left">
              <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Registration</p>
              <CardTitle className="text-4xl font-bold">New Explorer</CardTitle>
              <p className="text-white/30 text-sm mt-3">Start your journey with elite travel privileges.</p>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-12 pt-4">
              {params.error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  <AlertCircle className="size-4" /> {params.error}
                </div>
              )}

              <form action={signUp} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</Label>
                  <Input name="full_name" placeholder="John Doe" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all px-4" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Domain</Label>
                  <Input name="email" type="email" placeholder="explorer@travel.com" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all px-4" required />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Secret Access Key</Label>
                  <Input name="password" type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all px-4" minLength={6} required />
                </div>

                <SubmitButton pendingLabel="Creating Elite Profile..." className="mt-4 h-14 w-full rounded-2xl text-lg font-bold shadow-[0_10px_30px_rgba(var(--accent-rgb),0.3)] bg-accent hover:bg-accent/80">
                  Create Account
                </SubmitButton>
              </form>

              <div className="pt-4 text-center">
                <p className="text-sm text-white/40">
                  Registered explorer?{" "}
                  <Link href="/auth/login" className="text-accent font-bold hover:underline">
                    Sign in to portal
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual Section */}
        <section className="reveal-up scroll-reveal relative h-[700px] rounded-[3rem] overflow-hidden border border-white/5 md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1400&q=80"
            alt="Premium booking experience"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-12 space-y-4">
            <div className="size-12 rounded-2xl bg-accent/20 backdrop-blur-xl border border-accent/30 flex items-center justify-center">
              <Sparkles className="size-6 text-accent" />
            </div>
            <h1 className="text-5xl font-bold leading-tight premium-gradient-text from-white to-accent">Join the Elite.</h1>
            <p className="text-white/40 text-lg max-w-sm">From luxury fleet access to priority support, your premium journey starts here.</p>
          </div>
          
          <div className="absolute top-12 right-12">
            <div className="glass p-4 rounded-2xl flex items-center gap-3 border-white/10">
              <ShieldCheck className="size-5 text-accent" />
              <p className="text-xs font-bold text-white/80">Certified Secure</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
