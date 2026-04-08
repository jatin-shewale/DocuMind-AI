import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-ink-700 dark:bg-ink-800/80",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export { Card };
