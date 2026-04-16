import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const offers = [
  { code: "FESTIVE300", title: "Save up to INR 300", details: "Valid on selected AC buses till month end." },
  { code: "SUPERHIT", title: "Instant route discount", details: "Flat cashback on high-demand city routes." },
  { code: "WEEKEND50", title: "Weekend booking bonus", details: "Extra wallet cashback for weekend departures." },
  { code: "CARD250", title: "Partner card offer", details: "Save more with eligible card payments." },
];

export default function OffersPage() {
  return (
    <main className="tf-container flex-1 py-10">
      <h1 className="tf-heading">Offers</h1>
      <p className="tf-subtext mt-1">Explore active TransitFlow deals and coupon codes.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {offers.map((offer) => (
          <Card key={offer.code} className="premium-card">
            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge className="bg-[#d84e55]">{offer.code}</Badge>
              <p className="text-zinc-600">{offer.details}</p>
              <Link href="/search">
                <Button variant="outline">Use in search</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
