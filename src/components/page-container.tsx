import React from "react";

import Header from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AppSidebar } from "./app-sidebar";
import { SidebarInset } from "./ui/sidebar";

export default function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <main>
          <Header />
          <ScrollArea className="container h-[calc(100dvh-60px)] px-4 py-8">
            {children}
          </ScrollArea>
        </main>
      </SidebarInset>
    </>
  );
}
