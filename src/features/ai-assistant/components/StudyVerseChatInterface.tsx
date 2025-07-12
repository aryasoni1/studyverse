import { useRef, useEffect } from "react";
import { StudyVerseMessageBubble } from "./StudyVerseMessageBubble";
import { ModernMessageInput } from "./ModernMessageInput";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { StudyVerseEmptyState } from "./StudyVerseEmptyState";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudyVerseChatInterfaceProps {
  activeFeature: string;
}

export const StudyVerseChatInterface: React.FC<
  StudyVerseChatInterfaceProps
> = ({ activeFeature }) => {
  const { user } = useAuthStore();
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

  // Simulate processing stages
  useEffect(() => {
    if (isStreaming) {
      const stages: Array<"thinking" | "processing" | "generating"> = [
        "thinking",
        "processing",
        "generating",
      ];
      let currentStageIndex = 0;

      const interval = setInterval(() => {
        if (currentStageIndex < stages.length - 1) {
          currentStageIndex++;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  // Map UI feature names to backend keys
  const featureMap: Record<string, string> = {
    "ai-chat": "ask",
    roadmaps: "roadmap_generation",
    notes: "notes_generation",
    summary: "summary",
    collaborate: "collaborate",
    "ai-interviewer": "interview",
    "senior-engineer": "interview", // or another backend key if needed
    // Add more mappings as needed
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    try {
      // Create session if none exists
      if (!currentSession) {
        await createSession(
          `${activeFeature} - ${new Date().toLocaleDateString()}`
        );
      }

      // Use mapped backend feature key
      const backendFeature = featureMap[activeFeature] || "ask";
      await sendMessage(content, user.id, backendFeature);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getPlaceholder = () => {
    switch (activeFeature) {
      case "ai-chat":
        return "Ask me anything about your studies... 🚀";
      case "roadmaps":
        return "What learning path would you like to create? 🗺️";
      case "ai-interviewer":
        return "Ready for your interview practice? 🎯";
      case "senior-engineer":
        return "What project guidance do you need? 👨‍💻";
      case "notes":
        return "What would you like to take notes about? 📝";
      case "group-study":
        return "How can I help with your group study? 👥";
      case "youtube-study":
        return "Share a YouTube video to analyze... 📺";
      case "courses":
        return "What course topic interests you? 🎓";
      case "resume":
        return "Let's build your professional resume... 📄";
      case "jobs":
        return "What type of job are you looking for? 💼";
      default:
        return "Welcome to StudyVerse! How can I help you learn today? ✨";
    }
  };

  const navigate = useNavigate();

  if (!currentSession && messages.length === 0) {
    return (
      <StudyVerseEmptyState
        onStartChat={handleSendMessage}
        activeFeature={activeFeature}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative bg-background text-foreground transition-colors">
      {/* Back Button and Header */}
      <div className="flex items-center px-4 py-3 border-b border-card bg-background">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        {/* Optionally, add a title or feature name here */}
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {messages.map((message, index) => {
          if ("created_at" in message) {
            const mappedMessage = {
              ...message,
              timestamp: (message as { created_at: string }).created_at,
              chat_session_id: currentSession?.id || "",
            };
            return (
              <StudyVerseMessageBubble
                key={
                  (mappedMessage as { id?: string | number }).id
                    ? String((mappedMessage as { id?: string | number }).id)
                    : String(index)
                }
                message={mappedMessage}
                activeFeature={activeFeature}
              />
            );
          } else {
            const msgWithId = message as { id?: string | number };
            return (
              <StudyVerseMessageBubble
                key={msgWithId.id ? String(msgWithId.id) : String(index)}
                message={message}
                activeFeature={activeFeature}
              />
            );
          }
        })}
        {/* Streaming Message */}
        {isStreaming && streamingContent && (
          <StudyVerseMessageBubble
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
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Area */}
      <div className="flex-shrink-0 p-6 bg-card border-t border-card transition-colors">
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
