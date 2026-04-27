import Link from "next/link";
import { Search, Mail, Phone, MessageSquare, ChevronRight, BusFront, ShieldCheck, Ticket, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Elite Boarding & Baggage",
    questions: [
      { q: "What is the baggage allowance for Elite class?", a: "Each passenger is permitted two checked premium bags (up to 25kg total) and one personal cabin bag." },
      { q: "How early should I arrive for boarding?", a: "We request our distinguished travelers to arrive at least 20 minutes prior to departure for seamless priority boarding." },
    ]
  },
  {
    category: "Cancellations & Concierge",
    questions: [
      { q: "What is the cancellation protocol?", a: "Elite reservations can be cancelled up to 4 hours before departure with a 90% refund credit to your Elite wallet or original payment method." },
      { q: "How can I contact the on-board concierge?", a: "Every Elite coach is equipped with an inter-cabin communication terminal. Alternatively, use the TransitFlow mobile app during your journey." },
    ]
  }
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-24 min-h-screen">
      {/* Cinematic Header */}
      <div className="reveal-up scroll-reveal mb-16 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <CircleHelp className="size-6" />
          <span className="text-xs font-bold uppercase tracking-[0.4em]">Priority Intel & Support</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
          Command<br />
          <span className="premium-gradient-text">Center Help</span>
        </h1>
        <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic mt-6">
          Uncompromised assistance for our distinguished travelers. How may we orchestrate your journey today?
        </p>
      </div>

      {/* Search Bar */}
      <div className="reveal-up scroll-reveal max-w-3xl mx-auto mb-20 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass h-20 rounded-full flex items-center px-8 border border-white/10">
          <Search className="size-6 text-white/40" />
          <input 
            type="text" 
            placeholder="Search operational protocols, policies, or destinations..." 
            className="w-full bg-transparent border-none outline-none text-white px-6 text-lg placeholder:text-white/20 italic"
          />
          <Button variant="premium" className="h-12 px-8 rounded-full shadow-xl">
            Search
          </Button>
        </div>
      </div>

      {/* Support Categories grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-24">
        {[
          { icon: Ticket, title: "Booking Archives", desc: "Manage current and past reservations" },
          { icon: BusFront, title: "Fleet & On-Board", desc: "Amenities, seating, and live tracking" },
          { icon: ShieldCheck, title: "Security & Terms", desc: "Our commitment to your safety" },
        ].map((cat, i) => (
          <div key={i} className="reveal-up scroll-reveal glass-darker border border-white/5 rounded-[2.5rem] p-10 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500 group cursor-pointer">
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
               <cat.icon className="size-8 text-white group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{cat.title}</h3>
            <p className="text-white/40 font-medium mb-8 leading-relaxed">{cat.desc}</p>
            <div className="text-accent text-sm font-bold uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform">
              Explore Protocol <ChevronRight className="ml-2 size-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Priority Intel Section (FAQ) */}
      <div className="scroll-reveal glass-dark border border-white/5 rounded-[3rem] p-12 lg:p-16 mb-24 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-12 relative z-10">Frequently Demanded Intel</h2>
        
        <div className="space-y-12 relative z-10">
          {faqs.map((section, idx) => (
             <div key={idx} className="space-y-6">
                <h3 className="text-primary text-sm font-bold uppercase tracking-[0.3em]">{section.category}</h3>
                <div className="space-y-4">
                   {section.questions.map((q, qIdx) => (
                      <div key={qIdx} className="glass-darker border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
                         <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{q.q}</h4>
                         <p className="text-white/50 leading-relaxed font-medium">{q.a}</p>
                      </div>
                   ))}
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Contact Direct Line */}
      <div className="reveal-up scroll-reveal text-center space-y-10 border-t border-white/5 pt-20">
         <div className="space-y-4">
           <p className="text-accent text-xs font-bold uppercase tracking-[0.4em]">Still require assistance?</p>
           <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase relative inline-block">
             Initiate Contact
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
           </h2>
         </div>
         
         <div className="flex flex-wrap items-center justify-center gap-6">
           <Button variant="outline" className="h-16 px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white gap-4 shadow-xl">
             <Phone className="size-5 text-primary" /> +91 1800-ELITE-FLOW
           </Button>
           <Button variant="outline" className="h-16 px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white gap-4 shadow-xl">
             <Mail className="size-5 text-accent" /> concierge@transitflow.elite
           </Button>
           <Button variant="premium" className="h-16 px-8 rounded-2xl gap-4 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]">
             <MessageSquare className="size-5" /> Live Support Uplink
           </Button>
         </div>
      </div>
    </main>
  );
}
