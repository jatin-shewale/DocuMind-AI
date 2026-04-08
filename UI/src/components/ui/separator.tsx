import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-px w-full bg-ink-100 dark:bg-ink-700", className)}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
