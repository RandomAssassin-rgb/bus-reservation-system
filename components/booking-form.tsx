"use client";

import { useState, useTransition } from "react";
import { createReservation } from "@/app/actions";
import { cn } from "@/lib/utils";
import { SeatSelector } from "@/components/seat-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Wallet, Smartphone, ShieldCheck, IndianRupee } from "lucide-react";

type Props = {
  scheduleId: string;
  totalSeats: number;
  bookedSeats: number[];
  price: number;
};

export function BookingForm({ scheduleId, totalSeats, bookedSeats, price }: Props) {
  const [pending, startTransition] = useTransition();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [method, setMethod] = useState("upi");
  const [message, setMessage] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const calculateTotal = () => {
    const base = selectedSeats.length * price;
    return Math.max(0, base - appliedDiscount);
  };

  const applyPromo = () => {
    setPromoError("");
    const code = promoCode.toUpperCase();
    const baseTotal = selectedSeats.length * price;
    
    if (baseTotal === 0) {
      setPromoError("Select seats first");
      return;
    }

    if (code === "ELITE300") {
      setAppliedDiscount(300);
    } else if (code === "METROVIP") {
      setAppliedDiscount(Math.floor(baseTotal * 0.15));
    } else if (code === "WEEKENDER") {
      setAppliedDiscount(150);
    } else if (code === "BLACKCARD") {
      setAppliedDiscount(Math.floor(baseTotal * 0.20));
    } else {
      setPromoError("Invalid code");
      setAppliedDiscount(0);
    }
  };

  return (
    <Card className="glass-darker border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck className="size-32" />
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold premium-gradient-text">Complete Booking</CardTitle>
        <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Secure Checkout</p>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10">
        <SeatSelector totalSeats={totalSeats} bookedSeats={bookedSeats} onChange={(seats) => {
          setSelectedSeats(seats);
          setAppliedDiscount(0); // Reset discount on seat change for accuracy
        }} />
        
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Preferred Method</Label>
          <Select value={method} onValueChange={(value) => setMethod(value ?? "upi")}>
            <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-darker border-white/10 text-white">
              <SelectItem value="upi"><div className="flex items-center gap-2"><Smartphone className="size-4" /> UPI Instant</div></SelectItem>
              <SelectItem value="card"><div className="flex items-center gap-2"><CreditCard className="size-4" /> Credit/Debit Card</div></SelectItem>
              <SelectItem value="net_banking"><div className="flex items-center gap-2"><CreditCard className="size-4" /> Net Banking</div></SelectItem>
              <SelectItem value="wallet"><div className="flex items-center gap-2"><Wallet className="size-4" /> Obsidian Wallet</div></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code Section */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Promo Code</Label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ENTER CODE" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm uppercase tracking-widest text-white focus:bg-white/10 outline-none transition-all"
            />
            <Button 
              type="button" 
              variant="glow" 
              onClick={applyPromo}
              className="h-12 px-6 rounded-xl text-xs font-bold uppercase"
            >
              Apply
            </Button>
          </div>
          {promoError && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{promoError}</p>}
          {appliedDiscount > 0 && <p className="text-[10px] text-accent font-bold uppercase ml-1">Success: ₹{appliedDiscount} Discount Applied</p>}
        </div>

        <div className="rounded-[2rem] bg-white/5 border border-white/5 p-6 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-1">Total Fair</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="size-5 text-primary" />
                <p className="text-4xl font-bold text-white tracking-tighter">
                  {calculateTotal()}
                </p>
                {appliedDiscount > 0 && (
                  <span className="text-sm text-white/20 line-through ml-2">₹{selectedSeats.length * price}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
            </div>
          </div>
          
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
            <input 
              type="checkbox" 
              checked={reviewed} 
              onChange={(e) => setReviewed(e.target.checked)} 
              className="mt-1 size-4 rounded-sm border-white/20 bg-transparent text-primary focus:ring-offset-0"
            />
            <span className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
              I agree to the <span className="text-primary underline">premium travel terms</span> and cancellation policy.
            </span>
          </label>
        </div>

        <Button
          disabled={pending || selectedSeats.length === 0 || !reviewed}
          variant="premium"
          size="lg"
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] btn-premium"
          onClick={() =>
            startTransition(async () => {
              const form = new FormData();
              form.set("scheduleId", scheduleId);
              form.set("seatNumbers", selectedSeats.join(","));
              form.set("paymentMethod", method);
              form.set("discountApplied", appliedDiscount.toString()); // Pass discount to server if needed
              const result = await createReservation(form);
              setMessage(result?.error ?? result?.success ?? "Done");
            })
          }
        >
          {pending ? "Securing Seats..." : "Confirm & Pay Now"}
        </Button>

        {message && (
          <div className={cn(
            "p-4 rounded-2xl border text-sm font-medium animate-in fade-in slide-in-from-top-2",
            message.toLowerCase().includes("error") 
              ? "bg-destructive/10 border-destructive/20 text-destructive" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
