import { ScrollText, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 min-h-screen">
      <div className="reveal-up scroll-reveal mb-16 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Scale className="size-6" />
          <span className="text-xs font-bold uppercase tracking-[0.4em]">Legal Framework</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
          Service<br />
          <span className="premium-gradient-text">Terms</span>
        </h1>
        <p className="text-white/40 text-xl font-medium mx-auto italic mt-6">
          The operational parameters of your luxury surface expedition.
        </p>
      </div>

      <div className="scroll-reveal glass-dark border border-white/5 rounded-[3rem] p-12 lg:p-16 space-y-12">
        <section className="space-y-4">
           <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
               <ScrollText className="size-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">1. Elite Conduct Protocol</h2>
          </div>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            TransitFlow Elite maintains an environment of supreme luxury and mutual respect. Any passenger displaying disruptive behavior will be immediately disembarked at the next secure checkpoint without refund.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">2. Reservation Integrity</h2>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            A reservation grants exclusive license to board a specific schedule. Transfer of tickets to another individual is strictly prohibited under our security manifesto. Identification matching the booking manifest is required for all passengers attempting to board.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">3. Liability Limitations</h2>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            Our liability concerning baggage damage is capped at standard operational limits unless a premium declaration value was made prior to boarding. TransitFlow Elite is not liable for schedule deviations due to acts of God or severe operational hazards.
          </p>
        </section>
      </div>
    </main>
  );
}
