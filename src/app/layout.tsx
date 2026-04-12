
import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";

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
      <body className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#e8f1ff_0%,#f5f7fb_40%,#edf1f8_100%)] text-slate-800">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}