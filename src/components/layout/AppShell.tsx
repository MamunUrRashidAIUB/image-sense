"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/start-survey");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center p-3 sm:p-4">
      {!hideNavbar && <Navbar />}
      <main className={`w-full text-center ${hideNavbar ? "" : "mt-4"}`}>{children}</main>
    </div>
  );
}
