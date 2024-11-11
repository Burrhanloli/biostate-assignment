import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BinaryTreePathSelectSchema } from "@/db/schema/binary-tree-path";
import { toast } from "@/utils/toast";

import { fetchResult } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data: BinaryTreePathSelectSchema | null = await fetchResult(id);

  if (!data) {
    toast({
      message: "result not found, redirecting!",
      success: false,
    });
    redirect("/binary-tree-path");
  }

  const { maxLeafToNode, maxNodeToNode } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {maxLeafToNode && (
            <div className="rounded bg-green-100 p-2 text-primary-foreground">
              <div className="font-semibold text-primary-foreground">
                Max Leaf-to-Node Path Sum:{" "}
                <strong className="text-2xl">{maxLeafToNode.sum}</strong>
              </div>
              <div className="mt-1 text-xl text-primary-foreground">
                Path: {maxLeafToNode.path.join(" → ")}
              </div>
            </div>
          )}
          {maxNodeToNode && (
            <div className="rounded bg-orange-100 p-2">
              <div className="font-semibold text-primary-foreground">
                Max Node-to-Node Path Sum:{" "}
                <strong className="text-2xl">{maxNodeToNode.sum}</strong>
              </div>
              <div className="mt-1 text-xl text-primary-foreground">
                Path: {maxNodeToNode.path.join(" → ")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
