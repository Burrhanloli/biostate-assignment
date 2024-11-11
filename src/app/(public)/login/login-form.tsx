"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Input } from "@/components/form-controllers/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserLoginSchema, userLoginSchema } from "@/db/schema/user";
import { toast } from "@/utils/toast";

import { signIn } from "./actions";

type Props = {
  defaultValues: UserLoginSchema;
};

export function LoginForm({ defaultValues }: Props) {
  const form = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<UserLoginSchema> = async (data) => {
    const response = await signIn(data);

    toast(response);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-96 space-y-6"
      >
        <Input control={form.control} name="email" label="Email" type="email" />
        <Input
          control={form.control}
          name="password"
          label="Password"
          type="password"
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <div className="flex items-center justify-end">
        <Button asChild variant="link">
          <Link prefetch href="/register">Register</Link>
        </Button>
      </div>
    </Form>
  );
}
