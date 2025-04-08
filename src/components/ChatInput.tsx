
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onClearChat: () => void;
  onChangeApiKey: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  onSendMessage,
  onClearChat,
  onChangeApiKey
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
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
          onClick={onSendMessage}
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
          onClick={onChangeApiKey}
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
          onClick={onClearChat}
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
  );
};

export default ChatInput;
