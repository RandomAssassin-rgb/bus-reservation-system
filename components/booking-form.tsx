"use client";

import { useState, useTransition } from "react";
import { createReservation } from "@/app/actions";
import { SeatSelector } from "@/components/seat-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  return (
    <Card className="premium-card border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Book seats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SeatSelector totalSeats={totalSeats} bookedSeats={bookedSeats} onChange={setSelectedSeats} />
        <div className="space-y-2">
          <Label>Payment method</Label>
          <Select value={method} onValueChange={(value) => setMethod(value ?? "upi")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="net_banking">Net banking</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="rounded-lg bg-zinc-50 px-3 py-2 text-base text-zinc-700">Estimated amount: INR {selectedSeats.length * price}</p>
        <div className="rounded-lg border bg-zinc-50 p-3 text-sm text-zinc-700">
          <p className="font-medium">Booking summary</p>
          <p>Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None selected"}</p>
          <p>Payment: {method}</p>
          <p>Total: INR {selectedSeats.length * price}</p>
          <label className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            I have reviewed the booking details.
          </label>
        </div>
        <Button
          disabled={pending || selectedSeats.length === 0 || !reviewed}
          className="w-full bg-[#d84e55] hover:bg-[#c63f46]"
          onClick={() =>
            startTransition(async () => {
              const form = new FormData();
              form.set("scheduleId", scheduleId);
              form.set("seatNumbers", selectedSeats.join(","));
              form.set("paymentMethod", method);
              const result = await createReservation(form);
              setMessage(result?.error ?? result?.success ?? "Done");
            })
          }
        >
          {pending ? "Processing..." : "Confirm booking"}
        </Button>
        {message ? (
          <p
            className={`rounded-lg px-3 py-2 text-base ${
              message.toLowerCase().includes("error") || message.toLowerCase().includes("not")
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
