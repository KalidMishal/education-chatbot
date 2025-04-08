
import React from "react";
import { Separator } from "@/components/ui/separator";
import ApiKeyForm from "./ApiKeyForm";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useChatState } from "@/hooks/useChatState";

const Chat: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    apiKey,
    setApiKey,
    handleSendMessage,
    handleClearChat
  } = useChatState();

  // If no API key, show the API key form
  if (!apiKey) {
    return <ApiKeyForm onKeySubmit={setApiKey} initialKey="" />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} isLoading={isLoading} />
      
      <Separator />
      
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        onChangeApiKey={() => setApiKey("")}
      />
    </div>
  );
};

export default Chat;
