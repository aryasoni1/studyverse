import { useRef, useEffect } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { EmptyState } from "./EmptyState";

export const ChatInterface: React.FC = () => {
  const { user, updateUsage } = useAuthStore();
  const {
    currentSession,
    messages,
    sendMessage,
    isStreaming,
    streamingContent,
    createSession,
  } = useChatStore();
  const activeFeature = "ai-chat";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    try {
      // Create session if none exists
      if (!currentSession) {
        await createSession();
      }

      await sendMessage(content, user.id, activeFeature || "general");
      await updateUsage(1);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!currentSession && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <EmptyState onStartChat={handleSendMessage} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages.map((message) =>
            "created_at" in message
              ? {
                  ...message,
                  timestamp: message.created_at,
                  chat_session_id: "",
                }
              : message
          )}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
          canSendMessage={true}
        />
      </div>
    </div>
  );
};
