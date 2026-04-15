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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-start px-3 py-4 sm:px-4 sm:py-6">
      {!hideNavbar && <Navbar />}
      <main className={`w-full text-center ${hideNavbar ? "" : "mt-4 sm:mt-6"}`}>{children}</main>
    </div>
  );
}
