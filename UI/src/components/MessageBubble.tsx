import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SourceItem {
  file: string;
  page?: number;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
  highlights?: string[];
  onCopy?: () => void;
}

export function MessageBubble({
  role,
  content,
  sources,
  highlights,
  onCopy,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={[
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[85%] space-y-3 rounded-3xl px-5 py-4 text-sm shadow-soft",
          isUser
            ? "bg-brand-600 text-white"
            : "bg-white text-ink-900 dark:bg-ink-800 dark:text-ink-100",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>

        {!isUser && (
          <div className="space-y-2">
            {sources && sources.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs">
                {sources.map((source, idx) => (
                  <Badge key={`${source.file}-${idx}`}>
                    {source.file}
                    {source.page ? ` · p.${source.page}` : ""}
                  </Badge>
                ))}
              </div>
            ) : null}

            {highlights && highlights.length > 0 ? (
              <div className="rounded-2xl border border-ink-100 bg-mist-100/60 p-3 text-xs text-ink-700 dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-200">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-200">
                  <Sparkles size={12} />
                  Key Points
                </div>
                <ul className="list-disc space-y-1 pl-4">
                  {highlights.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-8 px-3 text-xs"
                onClick={onCopy}
              >
                <Copy size={14} />
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
