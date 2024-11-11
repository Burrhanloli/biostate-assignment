"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { CopyButton } from "@/components/copy-button";
import { Input } from "@/components/form-controllers/input";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LongestSubstringQuerySchema,
  LongestSubstringSelectSchema,
  longestSubstringQuerySchema,
} from "@/db/schema/longest-substring";
import { getColorBasedOnLength } from "@/utils/color";
import { toast } from "@/utils/toast";

import { fetchHistory, getLongestSubString, saveResult } from "./actions";

export default function Page() {
  const { data: session } = useSession({
    required: true,
  });

  const [data, setData] = useState<{
    query: string;
    result: string;
    data: string[];
  } | null>(null);

  const [historyData, setHistoryData] = useState<
    LongestSubstringSelectSchema[] | null
  >(null);

  const defaultValues: LongestSubstringQuerySchema = { query: "" };
  const form = useForm<LongestSubstringQuerySchema>({
    resolver: zodResolver(longestSubstringQuerySchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<LongestSubstringQuerySchema> = async (data) => {
    const response = await getLongestSubString(data);
    if (!response) {
      toast({
        message: "error occurred while calculating the longest substring",
        success: false,
      });
    } else {
      toast({
        message: "Calculated",
        success: true,
      });
      setData(response);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSave = async () => {
    if (!data) {
      toast({ message: "invalid data present", success: false });
      return;
    }
    const response = await saveResult({ ...data, userId: session!.user!.id! });
    toast(response);
    fetchHistory().then((value) => {
      setHistoryData(value);
    });
  };

  useEffect(() => {
    fetchHistory().then((value) => {
      setHistoryData(value);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Longest Substring Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Input
                control={form.control}
                name="query"
                type="text"
                placeholder="please enter the string..."
              />
              <Button type="submit" disabled={form.formState.isLoading}>
                <Icons.search />
                Find
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardContent>
          <div className="flex items-end justify-end">
            <Sheet>
              <SheetTrigger className="hover:text-accent-foregroundinline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                History
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Previous Calculations</SheetTitle>
                  <SheetDescription>
                    View all your previour calculations
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <ScrollArea className="h-[calc(100dvh-120px)]">
                  <div className="flex flex-col gap-2">
                    {historyData?.map((value, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <CardTitle className="text-xl">
                              {value.query}
                            </CardTitle>
                            <Button asChild variant="link" size="sm">
                              <Link href={`/longest-substring/${value.id}`}>
                                View Calculation
                              </Link>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          Longest String was {value.query.length}
                        </CardContent>
                        <CardFooter className="text-muted-foreground">
                          {/* @ts-expect-error user.email is custom property */}
                          {value.user.email}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Result for {data.query}</CardTitle>
            <CardDescription>
              <div className="flex flex-col items-start justify-start gap-4 py-2">
                <strong className="text-lg font-bold">
                  Longest String is{" "}
                  <span className="text-2xl">{data.result.length}</span>
                </strong>
                <CopyButton value={data.result} color="green" />
                <Button onClick={onSave}>Save Result</Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              {data.data.map((value, index) => (
                <CopyButton
                  key={index}
                  color={getColorBasedOnLength(value)}
                  value={value}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
