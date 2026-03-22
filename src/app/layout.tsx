import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/ui/top-nav";

export const metadata: Metadata = {
  title: "Personal Knowledge Flashcards",
  description: "Notes to flashcards with daily active recall."
};

const inter = Inter({
  subsets: ["latin"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI"],
  variable: "--font-inter"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] antialiased">
        <div className="min-h-screen">
          <TopNav />
          {children}
        </div>
      </body>
    </html>
  );
}

