"use client";

import * as React from "react";

import { CheckIcon, ClipboardIcon } from "lucide-react";

import { Button, ButtonProps } from "./ui/button";

interface CopyButtonProps extends ButtonProps {
  value: string;
  color: "red" | "blue" | "green" | "orange" | "amber";
}

export async function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({ value, color, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  const colorVariants = {
    red: "bg-red-500/15 text-red-500 border-red-500 hover:bg-red-700/30 hover:text-red-700 hover:border-red-700",
    blue: "bg-blue-500/15 text-blue-500 border-blue-500 hover:bg-blue-700/30 hover:text-blue-700 hover:border-blue-700",
    green:
      "bg-green-500/15 text-green-500 border-green-500 hover:bg-green-700/30 hover:text-green-700 hover:border-green-700",
    amber:
      "bg-amber-500/15 text-amber-500 border-amber-500 hover:bg-amber-700/30 hover:text-amber-700 hover:border-amber-700",
    orange:
      "bg-orange-500/15 text-orange-500 border-orange-500 hover:bg-orange-700/30 hover:text-orange-700 hover:border-orange-700",
  };

  return (
    <Button
      asChild
      onClick={() => {
        copyToClipboardWithMeta(value);
        setHasCopied(true);
      }}
      {...props}
      variant={"ghost"}
    >
      <div
        className={`flex flex-row items-center justify-between gap-1 rounded-md border-2 ${colorVariants[color]}`}
      >
        {value}
        {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
      </div>
    </Button>
  );
}
