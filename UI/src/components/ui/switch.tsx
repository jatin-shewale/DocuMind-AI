import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        checked ? "bg-brand-600" : "bg-ink-200 dark:bg-ink-700"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}
