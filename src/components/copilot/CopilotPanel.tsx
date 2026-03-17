import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
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

const API_URL = "http://127.0.0.1:8000/chat";

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

  const sessionId = "vinay-session";

  // ---------------- STREAMING FUNCTION ----------------
  const sendMessageToBackend = async (userText: string) => {
    const aiMessageId = Date.now() + 1;

    // add empty AI message first
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: "ai", content: "" },
    ]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        // update AI message live
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: fullText }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  "⚠️ Failed to connect to AI server. Please check backend.",
              }
            : msg
        )
      );
    }
  };

  // ---------------- SEND HANDLER ----------------
  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const userText = input;
    setInput("");

    sendMessageToBackend(userText);
  }, [input]);

  // ---------------- EXISTING UI LOGIC (UNCHANGED) ----------------
  useEffect(() => {
    const rootEl = document.getElementById("root") || document.body;
    const navEl = document.querySelector("nav");

    if (open) {
      if (side === "right") {
        rootEl.style.marginRight = `${width}px`;
      } else {
        rootEl.style.marginLeft = `${width}px`;
      }
    } else {
      rootEl.style.marginRight = "";
      rootEl.style.marginLeft = "";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openDocViewer = (errorLine?: number) => {
    setViewerErrorLine(errorLine);
    setShowViewer(true);
  };

  const isRight = side === "right";

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className={`fixed top-1/2 z-50 ${
              isRight ? "right-0" : "left-0"
            }`}
          >
            <Bot />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: isRight ? 400 : -400 }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? 400 : -400 }}
            className={`fixed top-0 ${
              isRight ? "right-0" : "left-0"
            } h-full bg-card`}
            style={{ width }}
          >
            {/* Messages */}
            <div className="p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border px-2"
              />
              <button onClick={handleSend}>
                <Send />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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