import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  uploading: boolean;
}

export function FileUpload({ onUpload, uploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onUpload(Array.from(files));
  };

  return (
    <div className="space-y-3">
      <div
        className={[
          "relative flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-4 py-6 text-center transition",
          dragActive
            ? "border-brand-500 bg-brand-500/10"
            : "border-ink-100 bg-white/70 dark:border-ink-700 dark:bg-ink-900/30",
        ].join(" ")}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <UploadCloud className="text-brand-500" />
        <div>
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">
            Drag & drop PDFs
          </p>
          <p className="text-xs text-ink-200">or browse files on your device</p>
        </div>
        <Button
          variant="secondary"
          className="relative"
          disabled={uploading}
        >
          Upload PDFs
          <input
            className="absolute inset-0 cursor-pointer opacity-0"
            type="file"
            accept=".pdf"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
          />
        </Button>
      </div>
      {uploading ? (
        <p className="text-xs text-ink-200">Uploading and processing...</p>
      ) : null}
    </div>
  );
}
