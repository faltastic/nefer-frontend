import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Nefer - Creative Professionals Platform",
  description: "Connect with photographers, models, and brands.",
};

import { UserProvider } from "@/lib/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", nunitoSans.variable)}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen flex flex-col">
        <UserProvider>
          <TopNav />
          <main className="flex-1">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
