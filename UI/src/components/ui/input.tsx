import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-ink-100 bg-white px-4 text-sm text-ink-900 shadow-soft placeholder:text-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:placeholder:text-ink-200/60",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
