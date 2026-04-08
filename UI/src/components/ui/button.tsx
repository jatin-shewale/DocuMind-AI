import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-500 active:bg-brand-600",
  secondary:
    "bg-white text-ink-900 border border-ink-100 shadow-soft hover:border-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:border-ink-700",
  ghost:
    "bg-transparent text-ink-700 hover:bg-mist-100 dark:text-ink-200 dark:hover:bg-ink-800",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
