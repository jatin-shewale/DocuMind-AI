import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ChatInputProps {
  onSend: (value: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-end gap-3 rounded-3xl border border-white/70 bg-white/80 p-3 shadow-soft backdrop-blur dark:border-ink-700 dark:bg-ink-800/80">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask your documents anything..."
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
      />
      <Button
        onClick={handleSend}
        disabled={disabled}
        className="h-11 w-11 rounded-2xl p-0"
      >
        <SendHorizonal size={18} />
      </Button>
    </div>
  );
}
