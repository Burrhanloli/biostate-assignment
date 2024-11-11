import { redirect } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getColorBasedOnLength } from "@/utils/color";
import { toast } from "@/utils/toast";

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
          Longest String is{" "}
          <strong className="text-2xl">{data.result.length}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-start gap-4">
          <CopyButton value={data.result} color="green" />
        </div>
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
