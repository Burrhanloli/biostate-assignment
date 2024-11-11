import { Metadata } from "next/types";

import PageContainer from "@/components/page-container";

export const metadata: Metadata = {
  title: "Biostate - Longest Substring Calculation",
  description: "Biostate Assignment project",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageContainer>{children}</PageContainer>;
}
