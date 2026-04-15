
import "./globals.css";
import type { Metadata } from "next";
import { Sora, Fraunces } from "next/font/google";
import AppShell from "@/components/layout/AppShell";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Image Perception Survey",
  description: "A survey to understand how people perceive images and their attributes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable} app-root min-h-screen text-slate-800`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}