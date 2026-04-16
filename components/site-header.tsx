import Link from "next/link";
import { BusFront, CircleHelp, List } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AccountPanel } from "@/components/account-panel";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-rose-600">
            <BusFront className="size-6" />
            TransitFlow
          </Link>
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/search" className="border-b-2 border-rose-600 pb-1 text-[0.95rem] font-medium text-zinc-900">
              <BusFront className="mr-1 inline size-4" />
              Bus tickets
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-zinc-600">
            <List className="mr-2 size-4" /> Bookings
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-zinc-600">
            <CircleHelp className="mr-2 size-4" /> Help
          </Button>
          {role === "admin" ? (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex text-zinc-600">
                Admin
              </Button>
            </Link>
          ) : null}
          {user ? <AccountPanel isAuthenticated /> : <AccountPanel isAuthenticated={false} />}
        </div>
      </nav>
    </header>
  );
}
