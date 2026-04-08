import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-700 dark:text-ink-100",
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge };
