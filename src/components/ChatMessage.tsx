
import React from "react";
import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[80%] md:max-w-[70%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className={cn(
          "h-8 w-8 border",
          isUser ? "bg-lanka-blue text-white" : "bg-lanka-light border-lanka-gold"
        )}>
          <span className="text-sm font-semibold">
            {isUser ? "You" : "AI"}
          </span>
        </Avatar>

        <Card
          className={cn(
            "py-3 px-4 shadow-sm",
            isUser
              ? "bg-lanka-blue text-white"
              : "bg-white border-lanka-light"
          )}
        >
          <div className="whitespace-pre-wrap text-sm md:text-base">
            {message.content}
          </div>
          <div
            className={cn(
              "text-[10px] mt-1 text-right opacity-70",
              isUser ? "text-white/70" : "text-gray-500"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
