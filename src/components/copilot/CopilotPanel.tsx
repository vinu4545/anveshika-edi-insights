import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  PanelRightClose,
  PanelLeftClose,
  ArrowRightLeft,
  Send,
  FileSearch,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react";
import EDIDocumentViewer from "./EDIDocumentViewer";

const placeholders = [
  "Explain error E102…",
  "Why was this claim rejected…",
  "Fix NM108 segment issue…",
  "Analyze this EDI file…",
  "What does CLM02 mean…",
  "Show me all Loop 2300 errors…",
];

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: string;
  hasViewDoc?: boolean;
  errorLine?: number;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "ai",
    content:
      "👋 Hi! I'm your EDI Copilot. I can help you analyze healthcare EDI files, explain segments, detect errors, and suggest fixes. How can I help?",
  },
  {
    id: 2,
    role: "user",
    content: "Analyze the uploaded 837 file for errors.",
  },
  {
    id: 3,
    role: "ai",
    content:
      "I found **3 errors** in `sample_837_claim.edi`:\n\n1. **CLM02** – Claim amount is non-numeric (`ABC`). Should be `1500.00`.\n2. **N403** – ZIP code `9410` is invalid. Expected 5 digits → `94102`.\n3. **SV102** – Missing procedure code modifier. Add modifier `25`.",
    hasViewDoc: true,
    errorLine: 11,
  },
];

const CopilotPanel = () => {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"right" | "left">("right");
  const [width, setWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [mode, setMode] = useState<"ask" | "auto">("ask");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerErrorLine, setViewerErrorLine] = useState<number | undefined>();

  // Keep container margin in sync with open state for split-page effect
  useEffect(() => {
    const rootEl = document.getElementById("root") || document.body;
    const navEl = document.querySelector("nav");

    const setMargins = (margin: string) => {
      rootEl.style.marginLeft = "";
      rootEl.style.marginRight = "";
      navEl?.style?.setProperty("margin-left", "");
      navEl?.style?.setProperty("margin-right", "");

      if (margin === "left") {
        rootEl.style.marginLeft = `${width}px`;
        navEl?.style?.setProperty("margin-left", `${width}px`);
      } else if (margin === "right") {
        rootEl.style.marginRight = `${width}px`;
        navEl?.style?.setProperty("margin-right", `${width}px`);
      }
    };

    if (open) {
      setMargins(side);
    } else {
      setMargins("");
    }

    return () => {
      rootEl.style.marginLeft = "";
      rootEl.style.marginRight = "";
      if (navEl) {
        navEl.style.marginLeft = "";
        navEl.style.marginRight = "";
      }
    };
  }, [open, side, width]);

  // Resize drag behavior
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const newWidth = side === "right" ? window.innerWidth - event.clientX : event.clientX;
      setWidth(Math.min(600, Math.max(320, newWidth)));
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, side]);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        content:
          "Based on the EDI specification, this segment requires a valid numeric value. I recommend reviewing the **Implementation Guide 005010X222A1** for the correct format.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  }, [input]);

  const openDocViewer = (errorLine?: number) => {
    setViewerErrorLine(errorLine);
    setShowViewer(true);
  };

  const isRight = side === "right";

  return (
    <>
      {/* Collapsed bar */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="collapsed-bar"
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRight ? 20 : -20 }}
            onClick={() => setOpen(true)}
            className={`fixed top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 py-4 px-1.5 rounded-lg glass-card cursor-pointer hover:border-primary/40 transition-colors ${
              isRight ? "right-0 rounded-r-none" : "left-0 rounded-l-none"
            }`}
          >
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-muted-foreground [writing-mode:vertical-lr] rotate-180">
              Copilot
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="copilot-panel"
            initial={{ x: isRight ? 400 : -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRight ? 400 : -400, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`fixed top-0 ${isRight ? "right-0" : "left-0"} z-50 h-full max-w-[90vw] flex flex-col border-border/50 ${
              isRight ? "border-l" : "border-r"
            } text-foreground bg-card`}
            style={{
              width: width,
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Resizer track */}
            <div
              onMouseDown={() => setIsResizing(true)}
              className={`absolute top-0 bottom-0 ${isRight ? "left-0" : "right-0"} w-2 cursor-col-resize z-50`}
              style={{ touchAction: "none" }}
            />
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold" style={{ color: "#0f172a" }}>
                  Copilot
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: "linear-gradient(90deg, hsl(204, 86%, 53%), hsl(164, 72%, 50%))", color: "white" }}>
                  AI
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSide(isRight ? "left" : "right")}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Switch side"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title="Collapse"
                >
                  {isRight ? (
                    <PanelRightClose className="w-3.5 h-3.5" />
                  ) : (
                    <PanelLeftClose className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-100 border border-slate-200 text-slate-900"
                        : "bg-white border border-border/50 text-slate-800"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-medium text-primary">
                          Copilot
                        </span>
                      </div>
                    )}
                    {/* Simple markdown-like rendering */}
                    <div className="whitespace-pre-wrap">
                      {msg.content.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**"))
                          return (
                            <strong key={i} className="text-foreground font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        if (part.startsWith("`") && part.endsWith("`"))
                          return (
                            <code
                              key={i}
                              className="px-1 py-0.5 rounded bg-muted text-accent font-mono text-xs"
                            >
                              {part.slice(1, -1)}
                            </code>
                          );
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                    {msg.hasViewDoc && (
                      <button
                        onClick={() => openDocViewer(msg.errorLine)}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm text-slate-900 transition-all"
                        style={{
                          background: "linear-gradient(90deg, #eff6ff, #d1fae5)",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                          border: "1px solid #a5f3fc",
                        }}
                      >
                        <FileSearch className="w-3 h-3 text-slate-700" />
                        View Documentation
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mode selector + Input */}
            <div className="px-4 pb-4 pt-2 border-t border-border/50">
              {/* Mode tabs */}
              <div className="flex gap-1 mb-3">
                {([
                  { key: "ask" as const, label: "Ask", icon: MessageSquare },
                  { key: "auto" as const, label: "Auto", icon: Zap },
                ] as const).map((m) => {
                  const isActive = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-700"
                      }`}
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, #dbeafe, #d1fae5)"
                          : "linear-gradient(90deg, #f8fafc, #ecfdf5)",
                        border: "1px solid #a5f3fc",
                        boxShadow: isActive ? "0 3px 8px rgba(59,130,246,0.18)" : "0 2px 6px rgba(15,23,42,0.08)",
                      }}
                    >
                      <m.icon className="w-3 h-3" />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all"
                  />
                  {/* Animated placeholder */}
                  {!input && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={placeholderIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 0.5, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none"
                      >
                        {placeholders[placeholderIdx]}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                <button
                  onClick={handleSend}
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(90deg, #c7d2fe, #a7f3d0)",
                    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.18)",
                    border: "1px solid #7c3aed"
                  }}
                >
                  <Send className="w-4 h-4 text-slate-900" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDI Document Viewer Modal */}
      <AnimatePresence>
        {showViewer && (
          <EDIDocumentViewer
            onClose={() => setShowViewer(false)}
            errorLine={viewerErrorLine}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CopilotPanel;
