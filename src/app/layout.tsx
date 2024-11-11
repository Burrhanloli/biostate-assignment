import { Open_Sans } from "next/font/google";
import { Suspense } from "react";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const overpass = Open_Sans({
  style: "normal",
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${overpass.className} h-screen w-screen overflow-hidden bg-[url(/bg.svg)] bg-repeat dark:bg-[url(/bg.svg)]`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Toaster />
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
