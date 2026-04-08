import { useEffect, useMemo, useRef, useState } from "react";
import { ChatWindow, Message } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar, DocumentItem } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

type ApiSource =
  | string
  | { file?: string; filename?: string; page?: number; source?: string };

function parseSources(sources: ApiSource[] | ApiSource | undefined) {
  if (!sources) return [];
  const array = Array.isArray(sources) ? sources : [sources];
  return array
    .map((item) => {
      if (typeof item === "string") {
        return { file: item };
      }
      return {
        file: item.file ?? item.filename ?? item.source ?? "source",
        page: item.page,
      };
    })
    .filter((item) => item.file);
}

function NeuralBackground({ darkMode }: { darkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    const points: { x: number; y: number; vx: number; vy: number }[] = [];
    const count = 70;
    const maxDist = 140;

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i += 1) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = 1 - dist / maxDist;
            ctx.strokeStyle = darkMode
              ? `rgba(96, 165, 250, ${alpha})`
              : `rgba(30, 64, 175, ${alpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of points) {
        ctx.fillStyle = darkMode
          ? "rgba(236, 253, 245, 0.9)"
          : "rgba(30, 64, 175, 0.6)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}

export default function App() {
  const [view, setView] = useState<"landing" | "dashboard">(() => {
    const saved = localStorage.getItem("documind-view");
    return saved === "dashboard" ? "dashboard" : "landing";
  });
  const [darkMode, setDarkMode] = useState(true);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("documind-theme");
    const isDark = saved ? saved === "dark" : true;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("documind-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("documind-view", view);
  }, [view]);

  useEffect(() => {
    if (view !== "dashboard") return;
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE}/documents`);
        if (!response.ok) return;
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.documents ?? [];
        const docs: DocumentItem[] = list.map((name: string) => ({
          name,
          status: "processed",
          progress: 100,
        }));
        setDocuments(docs);
      } catch {
        // ignore for now
      }
    };

    fetchDocuments();
  }, [view]);

  const recentChats = useMemo(() => {
    return messages
      .filter((message) => message.role === "user")
      .slice(-5)
      .map((message) => message.content);
  }, [messages]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);

    const newDocs: DocumentItem[] = files.map((file) => ({
      name: file.name,
      status: "pending",
      progress: 0,
    }));
    setDocuments((prev) => [...newDocs, ...prev]);

    await Promise.all(
      files.map((file) => {
        return new Promise<void>((resolve) => {
          const xhr = new XMLHttpRequest();
          const form = new FormData();
          form.append("files", file);

          xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            const progress = Math.round((event.loaded / event.total) * 100);
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.name === file.name ? { ...doc, progress } : doc
              )
            );
          };

          xhr.onload = () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.name === file.name
                  ? {
                      ...doc,
                      status: xhr.status < 400 ? "processed" : "error",
                      progress: 100,
                    }
                  : doc
              )
            );
            resolve();
          };

          xhr.onerror = () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.name === file.name ? { ...doc, status: "error" } : doc
              )
            );
            resolve();
          };

          xhr.open("POST", `${API_BASE}/upload`, true);
          xhr.send(form);
        });
      })
    );

    setUploading(false);
  };

  const deleteDocument = async (name: string) => {
    try {
      const response = await fetch(`${API_BASE}/documents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) return;
      setDocuments((prev) => prev.filter((doc) => doc.name !== name));
    } catch {
      // ignore
    }
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: content }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();
      const answer =
        data.answer ?? data.response ?? data.result ?? data.output ?? "No response.";
      const sources = parseSources(data.sources ?? data.source ?? data.citations);
      const highlights = Array.isArray(data.highlights)
        ? data.highlights
        : undefined;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        sources,
        highlights,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I ran into an error connecting to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setToast("Copied to clipboard");
    window.setTimeout(() => setToast(null), 1400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-mist-50 text-ink-900 dark:bg-ink-900 dark:text-ink-100">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-200/50 via-mist-50 to-purple-200/50 dark:from-blue-900/40 dark:via-ink-900 dark:to-purple-900/40" />
      <NeuralBackground darkMode={darkMode} />

      {view === "landing" ? (
        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink-100/60 bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink-600 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-ink-200">
            DocuMind AI Pro
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Chat with your documents using AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-700 dark:text-ink-200">
            An intelligent Q&A workspace that brings your PDFs to life with neural
            retrieval, grounded answers, and beautiful collaboration-ready insights.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={() => setView("dashboard")}>Get Started</Button>
            <Button
              variant="secondary"
              className="border-ink-100/60 bg-white/60 text-ink-900 dark:border-white/20 dark:bg-white/10 dark:text-ink-100"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Multi-PDF Intelligence",
                text: "Upload files in seconds and let DocuMind connect the dots across every page.",
              },
              {
                title: "Grounded Answers",
                text: "Every response is backed by citations, so you can trust what you read.",
              },
              {
                title: "Team Ready",
                text: "Share insights, export notes, and keep all knowledge in one elegant hub.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="rounded-3xl border border-ink-100/60 bg-white/70 text-left text-ink-900 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-ink-100"
              >
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-ink-700 dark:text-ink-200">
                  {item.text}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs text-ink-600 dark:text-ink-200">
            <span className="h-2 w-2 rounded-full bg-mint-400 shadow-glow" />
            Live indexing + secure local processing
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs text-ink-600 dark:text-ink-200">
            <Button
              variant="ghost"
              className="text-ink-600 dark:text-ink-200"
              onClick={() => setDarkMode(!darkMode)}
            >
              Toggle Ambient Mode
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto flex h-screen w-full flex-col px-3 py-4 md:px-6 lg:px-8 lg:py-8">
          <TopBar darkMode={darkMode} onToggleDarkMode={setDarkMode} />
          <div className="mt-6 grid flex-1 min-h-0 gap-6 lg:grid-cols-[320px_1fr]">
            <Sidebar
              documents={documents}
              recentChats={recentChats}
              onUpload={uploadFiles}
              onDelete={deleteDocument}
              uploading={uploading}
            />
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="min-h-0 flex-1 overflow-hidden">
                <ChatWindow messages={messages} loading={loading} onCopy={handleCopy} />
              </div>
              <ChatInput onSend={sendMessage} disabled={loading} />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button variant="ghost" onClick={() => setView("landing")}>
              Back to Landing
            </Button>
          </div>
          {toast ? (
            <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-ink-100/60 bg-white/80 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft backdrop-blur dark:border-white/20 dark:bg-ink-800/80 dark:text-ink-100">
              {toast}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
