
import React from "react";
import { cn } from "@/lib/utils";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white rounded-full shadow-sm w-[70px] animate-pulse">
      <div className="w-2 h-2 bg-lanka-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-lanka-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-lanka-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  );
};

export default TypingIndicator;
