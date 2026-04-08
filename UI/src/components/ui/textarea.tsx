import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[3rem] w-full resize-none rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-900 shadow-soft placeholder:text-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:placeholder:text-ink-200/60",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export { Textarea };
