"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Input } from "@/components/form-controllers/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  UserInsertSchema,
  UserLoginSchema,
  userLoginSchema,
} from "@/db/schema/user";
import { toast } from "@/utils/toast";

import { register } from "../register/actions";

type Props = {
  defaultValues: UserLoginSchema;
};

export function RegisterForm({ defaultValues }: Props) {
  const form = useForm<UserInsertSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<UserInsertSchema> = async (data) => {
    const response = await register(data);

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
          Register
        </Button>
      </form>
      <div className="flex items-center justify-end">
        <Button asChild variant="link">
          <Link prefetch href="/login">Login</Link>
        </Button>
      </div>
    </Form>
  );
}
