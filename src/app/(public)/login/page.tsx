import { Metadata } from "next/types";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Biostate - Login",
  description: "Biostate Assignment project",
};

export default async function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center px-4 py-12">
      <Card className="mx-auto grid w-[350px] gap-6">
        <CardHeader className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm
            defaultValues={{
              email: "",
              password: "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
