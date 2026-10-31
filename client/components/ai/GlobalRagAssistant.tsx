"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  FileText,
  ShieldCheck,
  BrainCircuit,
  ExternalLink,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import {
  queryRagEngine,
  ScholarPersona,
  RagResponse,
  RagCitation,
} from "@/lib/ai/rag-engine";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  persona?: ScholarPersona;
  citations?: RagCitation[];
  timestamp: string;
  source?: "gemini-flash" | "offline-grounded-rag";
  modelUsed?: string;
}

export function GlobalRagAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePersona, setActivePersona] = useState<ScholarPersona>("General Assistant");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      persona: "General Assistant",
      text: "Welcome to **Cambium Scholarly RAG Copilot**. I am grounded in your active research opportunities, preprints, IRB compliance protocols, and FAIR data standards. How may I assist your scholarship today?",
      citations: [
        {
          chunkId: "kb-plat-1",
          title: "Cambium Enterprise Research OS Architecture",
          section: "§1 Modular Architecture",
          page: 1,
          line: "L1-L25",
          snippet: "Next.js 15, React 19, NestJS 10, PostgreSQL 16 pgvector...",
          similarity: 0.95,
        },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, isMinimized, messages]);

  // Listen for custom trigger event
  useEffect(() => {
    const handleTrigger = (e: CustomEvent<{ query?: string; persona?: ScholarPersona }>) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail?.persona) {
        setActivePersona(e.detail.persona);
      }
      if (e.detail?.query) {
        setQuery(e.detail.query);
        setTimeout(() => handleSend(e.detail.query), 50);
      }
    };

    window.addEventListener("open-cambium-rag" as any, handleTrigger);
    return () => window.removeEventListener("open-cambium-rag" as any, handleTrigger);
  }, []);

  const handleSend = async (customQuery?: string) => {
    const q = (customQuery || query).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const ragRes: RagResponse = await queryRagEngine({
        query: q,
        persona: activePersona,
        topK: 3,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        persona: activePersona,
        text: ragRes.answer,
        citations: ragRes.citations,
        source: ragRes.source,
        modelUsed: ragRes.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          persona: activePersona,
          text: "An error occurred while synthesizing grounded research response. Please rephrase or try another scholarly query.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="Cambium Scholarly RAG Copilot">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Cambium Scholarly RAG Copilot"
          aria-label="Open Cambium Scholarly RAG Copilot"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3E6248] text-white shadow-xl hover:bg-[#204033] hover:scale-105 transition-all duration-200 border border-[#FAF7F0]/20 cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
          <span className="font-sans text-xs font-semibold tracking-wide">Ask Cambium RAG AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-emerald-300" />
        </button>
      )}

      {/* Floating RAG Modal Window */}
      {isOpen && (
        <div
          role="region"
          aria-label="Cambium RAG Copilot Chat Window"
          className={`fixed right-6 z-50 bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized
              ? "bottom-6 w-80 h-14"
              : "bottom-6 w-[420px] max-w-[94vw] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#3E6248] text-white select-none shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Bot className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="min-w-0">
                <span className="font-serif text-sm font-semibold truncate block">
                  Cambium RAG Copilot
                </span>
                <span className="font-mono text-[10px] text-emerald-200 truncate block">
                  {activePersona} · Grounded Vector Index
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize RAG chat window" : "Minimize RAG chat window"}
                className="p-1 rounded text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close RAG chat window"
                className="p-1 rounded text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Persona Selector Strip */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F2EBDD] border-b border-[#E4DCCB] overflow-x-auto text-[11px] shrink-0 font-sans">
                {(
                  [
                    "General Assistant",
                    "Methodology Auditor",
                    "Statistical Rigor",
                    "Reproducibility Engine",
                  ] as ScholarPersona[]
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePersona(p)}
                    className={`px-2.5 py-0.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      activePersona === p
                        ? "bg-[#3E6248] text-white font-semibold"
                        : "bg-white text-[#62685E] hover:text-[#202920] border border-[#E4DCCB]"
                    }`}
                  >
                    {p.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs bg-[#FAF7F0]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-xl ${
                        m.sender === "user"
                          ? "bg-[#3E6248] text-white rounded-br-none"
                          : "bg-white text-[#202920] border border-[#E4DCCB] rounded-bl-none shadow-2xs"
                      }`}
                    >
                      {/* Persona tag for AI message */}
                      {m.sender === "ai" && (
                        <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#E4DCCB]/60 text-[10px] font-mono text-[#62685E]">
                          <span className="font-semibold text-[#3E6248]">{m.persona}</span>
                          <span>{m.timestamp}</span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap leading-relaxed font-sans">
                        {m.text}
                      </div>

                      {/* Evidence Citations */}
                      {m.citations && m.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-[#E4DCCB]/60 space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#62685E] font-bold block">
                            Grounded Line Citations:
                          </span>
                          {m.citations.map((c, i) => (
                            <div
                              key={i}
                              className="p-1.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] font-mono text-[10px] text-[#202920]"
                            >
                              <span className="font-semibold text-[#3E6248]">
                                [{c.section}, p. {c.page}, {c.line}]
                              </span>{" "}
                              <span className="text-[#62685E]">{c.title}</span>
                              <div className="text-[9px] text-[#85877B] truncate mt-0.5">
                                &ldquo;{c.snippet}&rdquo;
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Source attribution */}
                      {m.modelUsed && (
                        <div className="mt-1 text-[9px] font-mono text-[#85877B]">
                          Model: {m.modelUsed} ({m.source})
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-[#E4DCCB] rounded-xl text-xs text-[#62685E] shadow-2xs w-fit">
                    <RefreshCw className="w-3.5 h-3.5 text-[#3E6248] animate-spin" />
                    <span>Synthesizing grounded scholarly response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Query Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 p-2.5 bg-white border-t border-[#E4DCCB] shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Ask ${activePersona.split(" ")[0]} (grants, proofs, IRB, FAIR)...`}
                  className="flex-1 px-3 py-2 bg-[#FAF7F0] border border-[#E4DCCB] rounded-lg text-xs font-sans text-[#202920] placeholder:text-[#85877B] outline-none focus:border-[#3E6248]"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  aria-label="Send message to RAG Copilot"
                  className="p-2 rounded-lg bg-[#3E6248] text-white hover:bg-[#204033] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
