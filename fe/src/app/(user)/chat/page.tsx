"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "@/features/LocalStorage/localStorageHelper";

interface ChatMessage {
  type: "user" | "bot" | "error";
  message: string;
}

export default function Page() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const storedKey = await getLocalStorageData("chat_api_key");
      const storedMessages = (await getLocalStorageData("chat_messages")) || [];
      if (storedKey) setApiKey(storedKey);
      setMessages(storedMessages);
      setIsInitialized(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isInitialized) {
      setLocalStorageData("chat_messages", messages);
    }
  }, [messages, isInitialized]);

  const handleSetApiKey = async () => {
    if (!input.trim()) return toast.error("API key cannot be empty");
    setApiKey(input.trim());
    await setLocalStorageData("chat_api_key", input.trim());
    toast.success("API key saved!");
    setInput("");
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) return toast.error("Please set your API key first.");

    setIsLoading(true);
    const question = input.trim();
    const userMsg: ChatMessage = { type: "user", message: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/query/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ question }),
        },
      );

      const data = await res.json();

      if (data.status) {
        const botMsg: ChatMessage = { type: "bot", message: data.data.answer };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || data.message || "Unknown error");
      }
    } catch (err: unknown) {
      const error = err as Error;
      const errMsg = error?.message || "Something went wrong.";
      const errMsgObj: ChatMessage = { type: "error", message: errMsg };
      setMessages((prev) => [...prev, errMsgObj]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl w-full mx-auto flex flex-col h-screen">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[var(--foreground)]/10">
          <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
        </div>

        {/* API Key Input */}
        {!apiKey && (
          <div className="px-6 py-4 bg-[var(--foreground)]/5 border-b border-[var(--foreground)]/10">
            <div className="flex gap-3">
              <TextField
                label="Enter API Key"
                variant="outlined"
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                placeholder="sk-..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--background)",
                    "& fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.2,
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.3,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.5,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--foreground)",
                    opacity: 0.6,
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--foreground)",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSetApiKey}
                sx={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  "&:hover": {
                    backgroundColor: "var(--foreground)",
                    opacity: 0.9,
                  },
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {messages.length === 0 && apiKey && (
              <div className="text-center py-12 text-[var(--foreground)]/40">
                <p className="text-lg">Start a conversation</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] break-words ${
                    msg.type === "user"
                      ? "bg-[var(--foreground)] text-[var(--background)] rounded-br-sm"
                      : msg.type === "bot"
                        ? "bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-bl-sm"
                        : "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-bl-sm"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing animation */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-[var(--foreground)]/10 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--foreground)]/60 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--foreground)]/60 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--foreground)]/60 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Box */}
        {apiKey && (
          <div className="px-6 py-4 border-t border-[var(--foreground)]/10 bg-[var(--background)]">
            <div className="max-w-4xl mx-auto flex gap-3">
              <TextField
                label="Type your question..."
                variant="outlined"
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--background)",
                    "& fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.2,
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.3,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--foreground)",
                      borderOpacity: 0.5,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "var(--foreground)",
                    opacity: 0.6,
                  },
                  "& .MuiInputBase-input": {
                    color: "var(--foreground)",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={isLoading}
                sx={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "80px",
                  "&:hover": {
                    backgroundColor: "var(--foreground)",
                    opacity: 0.9,
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "var(--foreground)",
                    opacity: 0.5,
                    color: "var(--background)",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "var(--background)" }}
                  />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
