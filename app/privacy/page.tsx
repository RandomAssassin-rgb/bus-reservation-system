import { ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 min-h-screen">
      <div className="reveal-up scroll-reveal mb-16 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <ShieldCheck className="size-6" />
          <span className="text-xs font-bold uppercase tracking-[0.4em]">Data Security</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
          Privacy<br />
          <span className="premium-gradient-text">Protocol</span>
        </h1>
        <p className="text-white/40 text-xl font-medium mx-auto italic mt-6">
          Your travel data, secured with military-grade encryption. Welcome to the TransitFlow standard.
        </p>
      </div>

      <div className="scroll-reveal glass-dark border border-white/5 rounded-[3rem] p-12 lg:p-16 space-y-12">
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
               <Eye className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Information Acquisition</h2>
          </div>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            We collect personal identification, payment telemetry, and location metrics necessary exclusively for fulfilling your elite travel experiences. TransitFlow Elite operates on a strict zero-knowledge principle for all non-essential metrics.
          </p>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
               <Lock className="size-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Data Vault Security</h2>
          </div>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            All transactional data and identity documents are encrypted at rest using AES-256 protocols. Our infrastructure ensures that your itinerary remains exclusively known to you and the fleet operators tasked with your journey.
          </p>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Third-Party Affiliations</h2>
          <p className="text-white/60 leading-relaxed font-medium text-lg">
            TransitFlow Elite does not broker, sell, or trade personal data to commercial third parties. Metadata may only be shared with verified fleet operators strictly for the orchestration of your reserved capacity.
          </p>
        </section>
      </div>
    </main>
  );
}
