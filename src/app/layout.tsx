
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Finance Dashboard",
  description: "Track your financial activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#e8f1ff_0%,#f5f7fb_40%,#edf1f8_100%)] text-slate-800">
        <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center p-3 sm:p-4">
          <Navbar />
          <main className="mt-4 w-full text-center">{children}</main>
        </div>
      </body>
    </html>
  );
}