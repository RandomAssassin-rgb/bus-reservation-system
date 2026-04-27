import Link from "next/link";
import { BusFront, CircleHelp, Ticket, ShieldCheck, Search, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AccountPanel } from "@/components/account-panel";

export async function SiteHeader() {
  let user = null;
  let role: string | null = null;
  
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    
    if (user) {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      role = data?.role ?? null;
    }
  } catch (err) {
    console.warn("[SiteHeader] Connectivity issue, rendering in guest mode:", err);
  }

  return (
    <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-4rem)] max-w-7xl h-24 bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] flex items-center justify-between px-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] group overflow-hidden">
      {/* Dynamic Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-4 group/logo">
          <div className="flex size-14 items-center justify-center rounded-[1.5rem] bg-primary shadow-[0_15px_35px_rgba(var(--primary-rgb),0.5)] group-hover/logo:scale-110 transition-all duration-700">
            <BusFront className="size-8 text-white" />
          </div>
          <div className="flex flex-col -space-y-2">
            <span className="text-3xl font-black text-white tracking-tighter uppercase italic">Transit</span>
            <span className="text-xs font-black text-primary tracking-[0.4em] uppercase ml-1 opacity-80">Flow Elite</span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" className="h-12 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest transition-all group/nav">
              <Search className="mr-3 size-4 group-hover/nav:text-primary transition-colors" /> Expeditions
            </Button>
          </Link>
          <Link href="/offers">
            <Button variant="ghost" className="h-12 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest transition-all group/nav">
              <Sparkles className="mr-3 size-4 group-hover/nav:text-accent transition-colors" /> Benefits
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <Link href="/my-bookings">
              <Button variant="ghost" className="h-12 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl px-6 text-xs font-black uppercase tracking-widest transition-all">
                <Ticket className="mr-3 size-4 opacity-50" /> Archives
              </Button>
            </Link>
          )}
          
          <Link href="/help">
            <Button variant="ghost" className="h-12 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl px-6 text-xs font-black uppercase tracking-widest transition-all">
              <CircleHelp className="mr-3 size-4 opacity-50" /> Intel
            </Button>
          </Link>

          {role === "admin" && (
            <Link href="/admin">
              <Button variant="ghost" className="h-12 bg-accent/10 text-accent hover:bg-accent/20 rounded-2xl px-6 text-xs font-black uppercase tracking-[0.2em] transition-all">
                <ShieldCheck className="mr-3 size-4" /> Command Center
              </Button>
            </Link>
          )}
        </div>

        <div className="h-10 w-[1px] bg-white/5 mx-2 hidden sm:block" />
        
        <AccountPanel isAuthenticated={!!user} />
      </div>
    </header>
  );
}
