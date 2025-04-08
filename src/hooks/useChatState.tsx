
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import { generateChatResponse } from "@/services/geminiService";
import { API_KEY_STORAGE_KEY, DEFAULT_GREETING } from "@/config/constants";

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

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

  return {
    messages,
    input,
    setInput,
    isLoading,
    apiKey,
    setApiKey,
    handleSendMessage,
    handleClearChat
  };
}
