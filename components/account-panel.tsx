"use client";

import Link from "next/link";
import { ChevronRight, UserCircle2, Ticket, CircleHelp, BadgeIndianRupee, Gift } from "lucide-react";
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
        render={<Button size="sm" variant="outline" className="border-zinc-300" />}
      >
        <UserCircle2 className="mr-2 size-4" />
        Account
      </SheetTrigger>
      <SheetContent className="w-[380px] overflow-y-auto p-0 sm:w-[430px]">
        <SheetHeader className="border-b px-6 py-5 text-left">
          <SheetTitle className="text-lg">Account</SheetTitle>
        </SheetHeader>

        <div className="space-y-7 px-6 py-6">
          {!isAuthenticated ? (
            <div className="space-y-3">
              <h3 className="text-[2.1rem] font-semibold leading-tight">Log in to manage your bookings</h3>
              <Link href="/auth/login">
                <Button className="h-11 w-full rounded-full bg-[#d84e55] hover:bg-[#c63f46]">Log in</Button>
              </Link>
              <p className="text-[0.98rem] text-zinc-600">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="font-semibold text-zinc-900 underline">
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-[1.85rem] font-semibold">Welcome to TransitFlow</h3>
              <p className="text-[0.98rem] text-zinc-600">Manage reservations, payments, and support from one place.</p>
              <form action={signOut}>
                <Button variant="outline" className="mt-2 w-full">
                  Sign out
                </Button>
              </form>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-[1.65rem] font-semibold">My details</h4>
            <Link href="/account/bookings" className="flex items-center justify-between rounded-xl border px-4 py-3 text-base hover:bg-zinc-50">
              <span className="flex items-center gap-2">
                <Ticket className="size-4" />
                Bookings
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
            <Link href="/account/personal-info" className="flex items-center justify-between rounded-xl border px-4 py-3 text-base hover:bg-zinc-50">
              <span className="flex items-center gap-2">
                <UserCircle2 className="size-4" />
                Personal information
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </div>

          <div className="space-y-2">
            <h4 className="text-[1.65rem] font-semibold">Payments</h4>
            <Link href="/account/wallet" className="flex items-center justify-between rounded-xl border px-4 py-3 text-base hover:bg-zinc-50">
              <span className="flex items-center gap-2">
                <BadgeIndianRupee className="size-4" />
                TransitFlow Wallet
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </div>

          <div className="space-y-2">
            <h4 className="text-[1.65rem] font-semibold">More</h4>
            <Link href="/offers" className="flex items-center justify-between rounded-xl border px-4 py-3 text-base hover:bg-zinc-50">
              <span className="flex items-center gap-2">
                <Gift className="size-4" />
                Offers
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
            <Link href="/help" className="flex items-center justify-between rounded-xl border px-4 py-3 text-base hover:bg-zinc-50">
              <span className="flex items-center gap-2">
                <CircleHelp className="size-4" />
                Help
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
