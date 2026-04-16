import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <main className="tf-container flex-1 py-10">
      <h1 className="tf-heading">Help & Support</h1>
      <p className="tf-subtext mt-1">Need assistance with bookings or payments? We are here to help.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="premium-card">
          <CardHeader><CardTitle>Booking support</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-zinc-600">
            <p>Email: support@transitflow.app</p>
            <p>Hours: 24/7 support desk</p>
            <p>Include your reservation ID for faster resolution.</p>
          </CardContent>
        </Card>
        <Card className="premium-card">
          <CardHeader><CardTitle>Payments & refunds</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-zinc-600">
            <p>Refunds are processed to original payment source.</p>
            <p>Track payment/refund status in Wallet and My Bookings.</p>
            <p>For urgent issues, contact support with transaction reference.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
