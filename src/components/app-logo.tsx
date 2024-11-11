"use client";

import Image from "next/image";

export default function AppLogo() {
  return (
    <div className="relative h-8 w-8">
      <Image
        src="/biostate-app-logo.png"
        alt="logo"
        fill
        priority
        sizes="max-width: 2rem"
        className="object-contain"
      />
    </div>
  );
}
