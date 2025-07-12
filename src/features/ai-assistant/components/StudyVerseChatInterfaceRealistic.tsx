import { useRef, useEffect } from "react";
import { StudyVerseMessageBubbleRealistic } from "./StudyVerseMessageBubbleRealistic";
import { ModernMessageInput } from "./ModernMessageInput";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { StudyVerseEmptyStateRealistic } from "./StudyVerseEmptyStateRealistic";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

interface StudyVerseChatInterfaceRealisticProps {
  activeFeature: string;
}

export const StudyVerseChatInterfaceRealistic: React.FC<
  StudyVerseChatInterfaceRealisticProps
> = ({ activeFeature }) => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const {
    currentSession,
    messages,
    sendMessage,
    isStreaming,
    streamingContent,
    createSession,
  } = useChatStore();

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
        await createSession(
          `${activeFeature} - ${new Date().toLocaleDateString()}`
        );
      }

      await sendMessage(content, user.id, activeFeature);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getPlaceholder = () => {
    switch (activeFeature) {
      case "notes-summary":
        return "Paste your notes here for AI summarization... 📝";
      case "mock-interview":
        return "Ready for your interview practice? Let's begin! 🎯";
      case "roadmap-generation":
        return "What learning path would you like to create? 🗺️";
      default:
        return "How can StudyVerse AI help you today? ✨";
    }
  };

  if (!currentSession && messages.length === 0) {
    return (
      <StudyVerseEmptyStateRealistic
        onStartChat={handleSendMessage}
        activeFeature={activeFeature}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* Loading skeleton for initial load */}
        {/* isLoading && messages.length === 0 && (
          <div className="space-y-6">
            <SkeletonLoader variant="message" />
            <SkeletonLoader variant="message" />
          </div>
        )} */}

        {messages.map((message, index) => {
          // Map ChatMessage to Message
          const mappedMessage = {
            ...message,
            timestamp: message.created_at,
            chat_session_id: currentSession?.id || "",
          };
          return (
            <div
              key={message.id}
              className="animate-bloom"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StudyVerseMessageBubbleRealistic
                message={mappedMessage}
                activeFeature={activeFeature}
              />
            </div>
          );
        })}

        {/* Streaming Message */}
        {isStreaming && streamingContent && (
          <div className="animate-bloom">
            <StudyVerseMessageBubbleRealistic
              message={{
                id: "streaming",
                user_id: user?.id || "",
                content: streamingContent,
                role: "assistant",
                timestamp: new Date().toISOString(),
                chat_session_id: currentSession?.id || "",
              }}
              isStreaming={true}
              activeFeature={activeFeature}
            />
          </div>
        )}

        {/* Processing Indicator */}
        {/* isStreaming && !streamingContent && (
          <div className="flex justify-start animate-fade-in">
            <ProcessingIndicatorRealistic
              stage={processingStage}
              message={getProcessingMessage()}
            />
          </div>
        )} */}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with enhanced glassmorphism */}
      <div
        className={cn(
          "flex-shrink-0 p-6 border-t backdrop-blur-xl glass-morphism",
          isDarkMode
            ? "bg-gradient-to-t from-slate-900/60 to-transparent border-slate-700/30"
            : "bg-gradient-to-t from-white/60 to-transparent border-slate-200/30"
        )}
      >
        <div className="max-w-4xl mx-auto">
          <ModernMessageInput
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            canSendMessage={true}
            placeholder={getPlaceholder()}
          />
        </div>
      </div>
    </div>
  );
};
