import { Metadata } from "next/dist/types";

import PageContainer from "@/components/page-container";

export const metadata: Metadata = {
  title: "Biostate - Binary Tree Path",
  description: "Biostate Assignment project",
};
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageContainer>{children}</PageContainer>;
}
