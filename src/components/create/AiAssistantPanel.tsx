"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Bot,
  Settings,
  Sparkles,
  Pencil,
  Lightbulb,
  Send,
  Check,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCreateStore, type AiMessage } from "@/stores/useCreateStore";
import { useAIContinue, useAIInspire, useAIRewrite, useAIStream } from "@/hooks/useAI";
import { cn } from "@/lib/utils";

interface SuggestionOption {
  label: string;
  title: string;
  description: string;
}

interface SuggestionMap {
  [messageId: string]: {
    options: SuggestionOption[];
    accepted?: string;
  };
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
    </div>
  );
}

function AiAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
      <Bot className="h-4 w-4 text-primary-foreground" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent">
      <span className="text-xs font-bold text-accent-foreground">我</span>
    </div>
  );
}

function parseSuggestionOptions(text: string): SuggestionOption[] {
  const regex = /([A-Z])\.\s*\*{0,2}([^*\n]+)\*{0,2}\s*\n([\s\S]*?)(?=(?:\n[A-Z]\.\s)|$)/g;
  const options: SuggestionOption[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    options.push({
      label: match[1],
      title: match[2].trim(),
      description: match[3].trim(),
    });
  }
  return options;
}

export function AiAssistantPanel() {
  const t = useTranslations("create");

  const aiMessages = useCreateStore((s) => s.aiMessages);
  const aiActiveTab = useCreateStore((s) => s.aiActiveTab);
  const aiGenerating = useCreateStore((s) => s.aiGenerating);
  const addAiMessage = useCreateStore((s) => s.addAiMessage);
  const setAiActiveTab = useCreateStore((s) => s.setAiActiveTab);
  const setAiGenerating = useCreateStore((s) => s.setAiGenerating);
  const setEditorContent = useCreateStore((s) => s.setEditorContent);
  const editorContent = useCreateStore((s) => s.editorContent);

  const aiContinue = useAIContinue();
  const aiInspire = useAIInspire();
  const aiRewrite = useAIRewrite();
  const aiStream = useAIStream();

  const [inputValue, setInputValue] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionMap>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingMsgIdRef = useRef<string | null>(null);

  const tabs = [
    { key: "continue" as const, label: t("smartContinue"), icon: Sparkles },
    { key: "inspire" as const, label: t("inspiration"), icon: Lightbulb },
    { key: "polish" as const, label: t("polish"), icon: Pencil },
  ];

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages.length, showTyping, aiStream.chunks]);

  // Monitor inspire result (non-streaming)
  useEffect(() => {
    if (aiInspire.result) {
      const now = new Date().toISOString();
      const msgId = `ai-${Date.now()}`;
      addAiMessage({
        id: msgId,
        role: "assistant",
        content: aiInspire.result,
        timestamp: now,
        actions: ["accept", "regenerate", "copy"],
      });

      // Parse suggestion options from result text
      const options = parseSuggestionOptions(aiInspire.result);
      if (options.length > 0) {
        setSuggestions((prev) => ({
          ...prev,
          [msgId]: { options },
        }));
      }

      setAiGenerating(false);
    }
  }, [aiInspire.result, addAiMessage, setAiGenerating]);

  // Monitor stream completion
  useEffect(() => {
    if (!aiStream.loading && aiStream.chunks && streamingMsgIdRef.current) {
      const now = new Date().toISOString();
      addAiMessage({
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: aiStream.chunks,
        timestamp: now,
        actions: ["accept", "regenerate", "copy"],
      });
      streamingMsgIdRef.current = null;
      setAiGenerating(false);
    }
  }, [aiStream.loading, aiStream.chunks, addAiMessage, setAiGenerating]);

  // Monitor errors
  useEffect(() => {
    const error = aiContinue.error || aiInspire.error || aiRewrite.error || aiStream.error;
    if (error) {
      let errorMsg: string;
      if (error.includes("额度")) {
        errorMsg = "今日AI使用额度已用完，请明天再试或升级套餐";
      } else if (error.includes("规范")) {
        errorMsg = "生成内容不符合规范";
      } else {
        errorMsg = error;
      }
      addAiMessage({
        id: `error-${Date.now()}`,
        role: "assistant",
        content: errorMsg,
        timestamp: new Date().toISOString(),
      });
      streamingMsgIdRef.current = null;
      setAiGenerating(false);
    }
  }, [aiContinue.error, aiInspire.error, aiRewrite.error, aiStream.error, addAiMessage, setAiGenerating]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || aiGenerating) return;

    const now = new Date().toISOString();

    addAiMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: now,
    });

    setInputValue("");
    setAiGenerating(true);
    setShowTyping(true);

    if (aiActiveTab === "continue") {
      streamingMsgIdRef.current = null;
      aiStream.startStream({ action: "continue", context: editorContent });
    } else if (aiActiveTab === "inspire") {
      aiInspire.generate({ chapterContent: editorContent });
    } else {
      streamingMsgIdRef.current = null;
      aiStream.startStream({ action: "rewrite", text: editorContent, mode: "vivid" });
    }
  }, [
    inputValue,
    aiGenerating,
    aiActiveTab,
    addAiMessage,
    setAiGenerating,
    aiStream,
    aiInspire,
    editorContent,
  ]);

  const handleAccept = useCallback(
    (message: AiMessage) => {
      setEditorContent(message.content);
    },
    [setEditorContent]
  );

  const handleCopy = useCallback(async (message: AiMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      // fallback: do nothing
    }
  }, []);

  const handleRegenerate = useCallback(
    () => {
      setAiGenerating(true);
      setShowTyping(true);

      if (aiActiveTab === "inspire") {
        aiInspire.generate({ chapterContent: editorContent });
      } else if (aiActiveTab === "polish") {
        streamingMsgIdRef.current = null;
        aiStream.stopStream();
        aiStream.startStream({ action: "rewrite", text: editorContent, mode: "vivid" });
      } else {
        streamingMsgIdRef.current = null;
        aiStream.stopStream();
        aiStream.startStream({ action: "continue", context: editorContent });
      }
    },
    [aiActiveTab, setAiGenerating, aiInspire, aiStream, editorContent]
  );

  const handleAcceptSuggestion = useCallback(
    (messageId: string, option: SuggestionOption) => {
      setSuggestions((prev) => ({
        ...prev,
        [messageId]: { ...prev[messageId], accepted: option.label },
      }));

      const content = `${option.title}：${option.description}`;
      setEditorContent(content);
    },
    [setEditorContent]
  );

  const handleQuickAction = useCallback(
    (action: "continue" | "polish" | "inspire") => {
      if (aiGenerating) return;

      setAiActiveTab(action);
      setInputValue("");
      setAiGenerating(true);
      setShowTyping(true);

      const now = new Date().toISOString();

      const actionLabels: Record<string, string> = {
        continue: t("generateNext"),
        polish: t("polishParagraph"),
        inspire: t("plotInspiration"),
      };

      addAiMessage({
        id: `user-${Date.now()}`,
        role: "user",
        content: actionLabels[action],
        timestamp: now,
      });

      if (action === "continue") {
        streamingMsgIdRef.current = null;
        aiStream.startStream({ action: "continue", context: editorContent });
      } else if (action === "inspire") {
        aiInspire.generate({ chapterContent: editorContent });
      } else {
        streamingMsgIdRef.current = null;
        aiStream.startStream({ action: "rewrite", text: editorContent, mode: "vivid" });
      }
    },
    [aiGenerating, setAiActiveTab, addAiMessage, setAiGenerating, t, aiStream, aiInspire, editorContent]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t("aiAssistant")}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] text-muted-foreground">
                {t("online")}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" title={t("settings")}>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b px-3 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = aiActiveTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAiActiveTab(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="flex flex-col gap-4 p-3">
          {aiMessages.length === 0 && !showTyping && !aiStream.loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-6 w-6 text-primary/60" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {t("aiWelcome")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("aiWelcomeDesc")}
              </p>
            </div>
          )}

          {aiMessages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "assistant" ? (
                <div className="flex gap-2">
                  <AiAvatar />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        AI
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="mt-1 rounded-lg rounded-tl-sm bg-muted/60 px-3 py-2">
                      <p className="text-sm leading-relaxed text-foreground">
                        {msg.content}
                      </p>
                    </div>

                    {/* Suggestion cards */}
                    {suggestions[msg.id] && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {suggestions[msg.id].options.map((option) => {
                          const isAccepted =
                            suggestions[msg.id].accepted === option.label;
                          return (
                            <button
                              key={option.label}
                              onClick={() =>
                                handleAcceptSuggestion(msg.id, option)
                              }
                              className={cn(
                                "flex items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                                isAccepted
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/40 hover:bg-muted/40"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                  isAccepted
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {option.label}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground">
                                  {option.title}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                                  {option.description}
                                </p>
                              </div>
                              {isAccepted && (
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Action buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleAccept(msg)}
                          title={t("accept")}
                        >
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRegenerate()}
                          disabled={aiGenerating}
                          title={t("regenerate")}
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleCopy(msg)}
                          title={t("copy")}
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-end">
                  <div className="min-w-0 max-w-[80%]">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {t("me")}
                      </span>
                    </div>
                    <div className="mt-1 rounded-lg rounded-tr-sm bg-primary/10 px-3 py-2">
                      <p className="text-sm leading-relaxed text-foreground">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                  <UserAvatar />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message bubble - shows partial content during streaming */}
          {aiStream.loading && aiStream.chunks && (
            <div className="flex gap-2">
              <AiAvatar />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    AI
                  </span>
                </div>
                <div className="mt-1 rounded-lg rounded-tl-sm bg-muted/60 px-3 py-2">
                  <p className="text-sm leading-relaxed text-foreground">
                    {aiStream.chunks}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {showTyping && !(aiStream.loading && aiStream.chunks) && (
            <div className="flex gap-2">
              <AiAvatar />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    AI
                  </span>
                </div>
                <div className="mt-1 rounded-lg rounded-tl-sm bg-muted/60 px-3 py-2">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <Separator />
      <div className="flex gap-1.5 px-3 py-2">
        <Button
          variant="outline"
          size="xs"
          className="flex-1"
          onClick={() => handleQuickAction("continue")}
          disabled={aiGenerating}
        >
          <Sparkles className="h-3 w-3" />
          {t("generateNext")}
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="flex-1"
          onClick={() => handleQuickAction("polish")}
          disabled={aiGenerating}
        >
          <Pencil className="h-3 w-3" />
          {t("polishParagraph")}
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="flex-1"
          onClick={() => handleQuickAction("inspire")}
          disabled={aiGenerating}
        >
          <Lightbulb className="h-3 w-3" />
          {t("plotInspiration")}
        </Button>
      </div>

      {/* Input Area */}
      <Separator />
      <div className="flex items-center gap-2 px-3 py-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPrompt")}
          disabled={aiGenerating}
          className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:opacity-50"
        />
        <Button
          size="icon-sm"
          onClick={handleSend}
          disabled={!inputValue.trim() || aiGenerating}
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
