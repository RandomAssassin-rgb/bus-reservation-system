import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransitFlow",
  description: "Premium full-stack bus reservation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="darkreader-lock" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50">
        <SiteHeader />
        {children}
        <footer className="mt-auto border-t bg-white">
          <div className="tf-container py-6 text-sm text-zinc-600">© {new Date().getFullYear()} TransitFlow. Built for reliable intercity travel.</div>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
