import { redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getMyPayments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WalletPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const payments = await getMyPayments();
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <main className="tf-container flex-1 py-10">
      <div className="space-y-4">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-3xl">TransitFlow Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-zinc-600">Total successful payments</p>
            <p className="mt-1 text-3xl font-bold text-[#d84e55]">INR {totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>

        {payments.map((p) => (
          <Card key={p.id} className="premium-card">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Reservation {p.reservation_id}</p>
                <p className="text-sm text-zinc-500">
                  {p.method} · {p.paid_at ? format(new Date(p.paid_at), "dd MMM yyyy, hh:mm a") : "Pending"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">INR {p.amount}</p>
                <Badge>{p.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 ? (
          <Card className="premium-card">
            <CardContent className="p-6 text-zinc-600">No wallet transactions yet.</CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
