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

interface CopilotPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: "right" | "left";
  setSide: (side: "right" | "left") => void;
}

const CopilotPanel = ({ open, setOpen, side, setSide }: CopilotPanelProps) => {
  const [mode, setMode] = useState<"ask" | "auto">("ask");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerErrorLine, setViewerErrorLine] = useState<number | undefined>();

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-2 py-4 px-1.5 cursor-pointer hover:border-primary/40 transition-colors border-border/50 bg-card/80 backdrop-blur-md"
            style={{ borderLeft: isRight ? '1px solid hsl(var(--border))' : 'none', borderRight: !isRight ? '1px solid hsl(var(--border))' : 'none' }}
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
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`h-screen flex flex-col border-border/50 shrink-0 overflow-hidden ${
              isRight ? "border-l" : "border-r"
            }`}
            style={{
              background:
                "linear-gradient(180deg, hsl(222 47% 8% / 0.95) 0%, hsl(250 30% 10% / 0.95) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Copilot
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
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
                        ? "bg-primary/15 border border-primary/20 text-foreground"
                        : "glass-card text-muted-foreground"
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
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <FileSearch className="w-3 h-3" />
                        View Document
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
                ] as const).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      mode === m.key
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <m.icon className="w-3 h-3" />
                    {m.label}
                  </button>
                ))}
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
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Send className="w-4 h-4" />
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
