import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-xs font-semibold text-white",
        className
      )}
      {...props}
    />
  )
);

Avatar.displayName = "Avatar";

export { Avatar };
