import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function SiteContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-5 md:px-12", className)}
      {...props}
    />
  );
}
