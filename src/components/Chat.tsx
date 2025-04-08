
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ApiKeyForm from "./ApiKeyForm";
import { API_KEY_STORAGE_KEY, DEFAULT_GREETING } from "@/config/constants";
import { generateChatResponse } from "@/services/geminiService";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    setApiKey(savedApiKey);
    
    // Add default assistant greeting if we have a key
    if (savedApiKey) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: DEFAULT_GREETING,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    if (!apiKey) {
      toast.error("Please enter your Gemini API key first");
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateChatResponse([...messages, userMessage], apiKey);
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      
      let errorMessage = "Failed to generate response";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("API key")) {
        toast.error("Invalid API key. Please check your Gemini API key.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: DEFAULT_GREETING,
        timestamp: new Date(),
      },
    ]);
  };

  // If no API key, show the API key form
  if (!apiKey) {
    return <ApiKeyForm onKeySubmit={setApiKey} initialKey="" />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow px-4 py-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>
      </div>

      <Separator />
      
      <div className="p-4 bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Ask about education in Sri Lanka..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="pr-10 bg-white border-lanka-blue/30 focus-visible:ring-lanka-blue"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-lanka-blue hover:bg-lanka-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            <span className="sr-only">Send</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setApiKey("")}
            className="border-lanka-blue/30 text-lanka-blue hover:bg-lanka-blue/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <span className="sr-only">Change API Key</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleClearChat}
            className="border-lanka-blue/30 text-lanka-blue hover:bg-lanka-blue/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="sr-only">Clear Chat</span>
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-gray-500">
          Powered by Google Gemini AI • Your API key is stored locally
        </div>
      </div>
    </div>
  );
};

export default Chat;
