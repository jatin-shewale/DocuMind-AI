import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { file: string; page?: number }[];
  highlights?: string[];
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  onCopy: (content: string) => void;
}

export function ChatWindow({ messages, loading, onCopy }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Card className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold">Chat with Documents</p>
          <p className="text-sm text-ink-200">Contextual answers with citations</p>
        </div>
        <Badge>RAG Assistant</Badge>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-200">
            <p className="text-sm uppercase tracking-[0.2em]">Empty State</p>
            <p className="text-lg font-semibold text-ink-900 dark:text-ink-100">
              Upload documents and start asking questions
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              sources={message.sources}
              highlights={message.highlights}
              onCopy={() => onCopy(message.content)}
            />
          ))
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-ink-200">
            <Loader2 className="animate-spin" size={16} />
            DocuMind is thinking...
          </div>
        ) : null}

        <div ref={endRef} />
      </div>
    </Card>
  );
}
