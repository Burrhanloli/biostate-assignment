import { redirect } from "next/navigation";

import { Separator } from "@radix-ui/react-separator";

import { CopyButton } from "@/components/copy-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/utils/toast";
import { getColorBasedOnLength } from "@/utils/color";

import { fetchResult } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await fetchResult(id);

  if (!data) {
    toast({
      message: "result not found, redirecting!",
      success: false,
    });
    redirect("/longest-substring");
  }

  return (
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
  );
}
