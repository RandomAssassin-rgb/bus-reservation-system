import Link from "next/link";
import { ChevronRight, UserCircle2, Ticket, CircleHelp, BadgeIndianRupee, Gift, LogOut } from "lucide-react";
import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  isAuthenticated: boolean;
};

export function AccountPanel({ isAuthenticated }: Props) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button size="sm" variant="glow" />}
      >
        <UserCircle2 className="mr-2 size-4" />
        Account
      </SheetTrigger>
      <SheetContent className="w-[380px] overflow-y-auto p-0 sm:w-[430px] glass-darker border-white/5 text-white">
        <SheetHeader className="border-b border-white/10 px-6 py-8 text-left">
          <SheetTitle className="text-2xl font-bold premium-gradient-text">Member Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-10 px-6 py-8">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <h3 className="text-3xl font-bold leading-tight">Elevate your travel experience</h3>
              <p className="text-white/40 text-sm">Join the Elite tiers for priority boarding and exclusive lounge access.</p>
              <div className="pt-2 space-y-3">
                <Link href="/auth/login" className="block">
                  <Button variant="premium" className="w-full">Log in</Button>
                </Link>
                <p className="text-sm text-white/40 text-center">
                  New to TransitFlow?{" "}
                  <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                    Create Elite Account
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCircle2 className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Elite Member</h3>
                  <p className="text-xs text-primary font-medium tracking-widest uppercase">Verified Traveler</p>
                </div>
              </div>
              <form action={signOut} className="pt-2">
                <Button variant="outline" className="w-full border-white/5 text-white/50 hover:text-destructive">
                  <LogOut className="mr-2 size-4" /> Sign out
                </Button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">Personal Dashboard</h4>
            <Link href="/account/bookings" className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 px-4 py-4 transition-all hover:bg-white/10 hover:border-primary/30">
              <span className="flex items-center gap-3">
                <Ticket className="size-5 text-primary" />
                <span className="font-medium">My Expeditions</span>
              </span>
              <ChevronRight className="size-4 text-white/20" />
            </Link>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">Finances</h4>
            <Link href="/account/wallet" className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 px-4 py-4 transition-all hover:bg-white/10 hover:border-primary/30">
              <span className="flex items-center gap-3">
                <BadgeIndianRupee className="size-5 text-primary" />
                <span className="font-medium">Obsidian Wallet</span>
              </span>
              <ChevronRight className="size-4 text-white/20" />
            </Link>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">Concierge</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/offers" className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-primary/30">
                <Gift className="size-6 text-primary" />
                <span className="font-medium">Elite Offers</span>
              </Link>
              <Link href="/help" className="flex flex-col gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-primary/30">
                <CircleHelp className="size-6 text-primary" />
                <span className="font-medium">Support</span>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
