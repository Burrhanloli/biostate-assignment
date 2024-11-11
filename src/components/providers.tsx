"use client";

import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { SidebarProvider } from "./ui/sidebar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
