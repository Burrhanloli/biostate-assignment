import Link from "next/link";

import { UrlObject } from "url";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ERROR_PAGE_STATICS = {
  title: "404",
  message: "Oops, it looks like the page you're looking for doesn't exist.",
  action: {
    href: "/dashboard",
    text: "Go to Homepage",
  },
};

export default function Component() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
            {ERROR_PAGE_STATICS.title}
          </h1>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-lg text-muted-foreground">
            {ERROR_PAGE_STATICS.message}
          </p>
          <div className="mt-6">
            <Link
              href={ERROR_PAGE_STATICS.action.href as unknown as UrlObject}
              className={buttonVariants({
                variant: "default",
              })}
              prefetch={false}
            >
              {ERROR_PAGE_STATICS.action.text}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
