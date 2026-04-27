import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { ScrollEffects } from "@/components/scroll-effects";
import { BusFront, Share2, Send, Globe, ArrowUpRight } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransitFlow Elite | Premium Bus Expeditions",
  description: "Experience the next generation of bus travel. Secure, seamless, and sophisticated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </head>
      <body className="min-h-full flex flex-col bg-background relative overflow-x-hidden">
        <ScrollEffects />
        
        {/* Global Cinematic Overlays */}
        <div className="pointer-events-none fixed -top-[10%] -left-[10%] size-[50%] rounded-full bg-primary/10 blur-[150px] opacity-20" />
        <div className="pointer-events-none fixed top-[30%] left-[60%] size-[40%] rounded-full bg-accent/5 blur-[120px] opacity-10" />
        
        <SiteHeader />
        <main className="flex-1 w-full">
          {children}
        </main>
        
        <footer className="mt-40 border-t border-white/5 bg-black/40 pt-32 pb-16 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="mx-auto max-w-7xl px-12 grid gap-16 md:grid-cols-4">
            <div className="col-span-2 space-y-10">
              <Link href="/" className="flex items-center gap-5 group">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <BusFront className="size-8 text-white" />
                </div>
                <span className="text-4xl font-black text-white tracking-tighter uppercase italic">Transit<span className="text-primary">Flow</span></span>
              </Link>
              <p className="max-w-md text-xl text-white/30 leading-relaxed font-medium italic">
                Redefining the standards of surface mobility. Experience luxury expeditions across the nation with unprecedented sophistication.
              </p>
              <div className="flex items-center gap-8">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/20 hover:text-primary transition-all hover:scale-125"><Send className="size-6" /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/20 hover:text-accent transition-all hover:scale-125"><Share2 className="size-6" /></a>
                <a href="https://transitflow.elite" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-all hover:scale-125"><Globe className="size-6" /></a>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Navigation</h4>
              <ul className="space-y-6 text-base font-bold italic uppercase tracking-tighter">
                <li><Link href="/search" className="text-white/40 hover:text-white transition-colors flex items-center group">Routes <ArrowUpRight className="ml-2 size-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                <li><Link href="/offers" className="text-white/40 hover:text-white transition-colors flex items-center group">Elite Deals <ArrowUpRight className="ml-2 size-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                <li><Link href="/my-bookings" className="text-white/40 hover:text-white transition-colors flex items-center group">Archives <ArrowUpRight className="ml-2 size-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
                <li><Link href="/offers" className="text-white/40 hover:text-white transition-colors flex items-center group">Privileges <ArrowUpRight className="ml-2 size-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Headquarters</h4>
              <div className="space-y-6 text-base font-medium text-white/30">
                <p className="italic">12th Floor, Obsidian Tower<br />Tech Enclave, Sector V, 700091</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Priority Intel</p>
                  <p className="text-white font-black text-2xl tracking-tighter">1800-ELITE-FLOW</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-12 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
              © {new Date().getFullYear()} TransitFlow Elite. Crafted for the Distinguished Traveler.
            </p>
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Service Terms</Link>
            </div>
          </div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

