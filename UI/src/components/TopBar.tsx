import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";

interface TopBarProps {
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export function TopBar({ darkMode, onToggleDarkMode }: TopBarProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-5 py-3 shadow-soft backdrop-blur dark:border-ink-700 dark:bg-ink-800/80">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-200">DocuMind AI Pro</p>
        <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-100">
          AI Document Q & A Workspace
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
          <Sun size={16} />
          <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
          <Moon size={16} />
        </div>
        <Avatar>JD</Avatar>
      </div>
    </div>
  );
}
