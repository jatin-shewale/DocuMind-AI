import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/FileUpload";
import { Progress } from "@/components/ui/progress";

export interface DocumentItem {
  name: string;
  status: "processed" | "pending" | "error";
  progress: number;
}

interface SidebarProps {
  documents: DocumentItem[];
  recentChats: string[];
  onUpload: (files: File[]) => void;
  onDelete: (docName: string) => void;
  uploading: boolean;
}

export function Sidebar({
  documents,
  recentChats,
  onUpload,
  onDelete,
  uploading,
}: SidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-6 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-ink-700 dark:bg-ink-800/80">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
          <FileText size={20} />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">DocuMind AI Pro</p>
          <p className="text-xs text-ink-200">Documents Workspace</p>
        </div>
      </div>

      <FileUpload onUpload={onUpload} uploading={uploading} />

      <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-200">
            Documents
          </p>
          <Badge>{documents.length}</Badge>
        </div>
        <div className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-sm text-ink-200">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.name}
                className="space-y-2 rounded-2xl border border-ink-100 bg-white px-3 py-2 text-sm shadow-soft dark:border-ink-700 dark:bg-ink-900/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-900 dark:text-ink-100">
                      {doc.name}
                    </p>
                    <p className="text-xs text-ink-200">
                      {doc.status === "processed"
                        ? "Processed"
                        : doc.status === "pending"
                        ? "Processing"
                        : "Error"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => onDelete(doc.name)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                {doc.status === "pending" ? (
                  <Progress value={doc.progress} />
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-200">
          Recent Chats
        </p>
        <div className="space-y-2">
          {recentChats.length === 0 ? (
            <p className="text-sm text-ink-200">No recent chats yet.</p>
          ) : (
            recentChats.map((chat, idx) => (
              <Button
                key={`${chat}-${idx}`}
                variant="ghost"
                className="w-full justify-start rounded-2xl text-left"
              >
                {chat}
              </Button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
