import { useRef, useEffect, useState } from "react";
import { ModernMessageBubble } from "./ModernMessageBubble";
import { ModernMessageInput } from "./ModernMessageInput";
import { ProcessingIndicator } from "@/features/ai-assistant/components/ui/ProcessingIndicator";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { ModernEmptyState } from "./ModernEmptyState";
import { useThemeStore } from "@/store/themeStore";

export const ModernChatInterface: React.FC<{ activeFeature?: string }> = ({
  activeFeature = "ai-chat",
}) => {
  const { user, updateUsage } = useAuthStore();
  const {
    currentSession,
    messages,
    sendMessage,
    isStreaming,
    streamingContent,
    createSession,
  } = useChatStore();
  const { isDarkMode } = useThemeStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processingStage, setProcessingStage] = useState<
    "thinking" | "processing" | "generating"
  >("thinking");

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
          setProcessingStage(stages[currentStageIndex]);
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
    "senior-engineer": "interview",
    // Add more mappings as needed
  };
  const backendFeature = featureMap[activeFeature] || "ask";

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    try {
      // Create session if none exists
      if (!currentSession) {
        await createSession();
      }
      await sendMessage(content, user.id, backendFeature);
      await updateUsage(1);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // New quick starter prompts (always shown)
  const quickStarters = [
    {
      label: "Notes on JavaScript Closures",
      feature: "notes_generation",
      variables: { topic: "JavaScript Closures" },
    },
    {
      label: "Become a Fullstack Web Developer",
      feature: "roadmap_generation",
      variables: { goal: "Become a Fullstack Web Developer" },
    },
    {
      label: "Summarize: REST vs GraphQL",
      feature: "summary",
      variables: { input_text: "REST vs GraphQL" },
    },
    {
      label: "Break Down: Build a Personal Portfolio Website",
      feature: "collaborate",
      variables: { goal: "Build a Personal Portfolio Website" },
    },
    {
      label: "Mock Interview: Backend Engineer (Java/Spring Boot)",
      feature: "interview",
      variables: { role: "Backend Engineer (Java/Spring Boot)" },
    },
    {
      label: "Real-Time Interview: Backend Engineer (Java/Spring Boot)",
      feature: "interview_realtime",
      variables: { role: "Backend Engineer (Java/Spring Boot)" },
    },
    {
      label: "What is a Binary Search Tree?",
      feature: "ask",
      variables: { question: "What is a Binary Search Tree?" },
    },
  ];

  // Update handleSendMessage to accept feature/variables
  const handleSendQuickStarter = async (starter: (typeof quickStarters)[0]) => {
    if (!user) return;
    try {
      if (!currentSession) {
        await createSession();
      }
      // Determine the correct content to send based on feature
      let content = "";
      switch (starter.feature) {
        case "notes_generation":
          content = starter.variables.topic || "";
          break;
        case "roadmap_generation":
        case "collaborate":
          content = starter.variables.goal || "";
          break;
        case "summary":
          content = starter.variables.input_text || "";
          break;
        case "interview":
          content = starter.variables.role || "";
          break;
        case "ask":
        default:
          content = starter.variables.question || "";
          break;
      }
      await sendMessage(content, user.id, starter.feature);
      await updateUsage(1);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Always show ModernEmptyState at the top, then chat UI below
  return (
    <div className="flex-1 flex flex-col h-full relative bg-background text-foreground transition-colors">
      {/* ModernEmptyState with AI-powered prompts */}
      <ModernEmptyState onStartChat={handleSendMessage} />
      {/* Quick Starter Examples */}
      <div className="mb-4 flex flex-wrap gap-2 px-4">
        {quickStarters.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuickStarter(starter)}
            className={
              isDarkMode
                ? "px-4 py-2 rounded-full bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 transition-colors"
                : "px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
            }
          >
            {starter.label}
          </button>
        ))}
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-h-[60vh]">
        {messages.map(
          (
            message:
              | import("@/features/ai-assistant/types/aiAssistantTypes").Message
              | import("@/store/chatStore").ChatMessage
          ) => {
            if ("created_at" in message) {
              const mappedMessage: import("@/features/ai-assistant/types/aiAssistantTypes").Message =
                {
                  id: message.id,
                  content: message.content,
                  role: message.role as "user" | "assistant" | "system",
                  timestamp: String(message.created_at),
                  user_id: message.user_id,
                  chat_session_id: "",
                  type: "text",
                };
              return (
                <ModernMessageBubble key={message.id} message={mappedMessage} />
              );
            } else {
              return <ModernMessageBubble key={message.id} message={message} />;
            }
          }
        )}
        {/* Streaming Message */}
        {isStreaming && streamingContent && (
          <ModernMessageBubble
            message={{
              id: "streaming",
              user_id: user?.id || "",
              content: streamingContent,
              role: "assistant",
              timestamp: new Date().toISOString(),
              chat_session_id: currentSession?.id || "",
            }}
            isStreaming={true}
          />
        )}
        {/* Processing Indicator */}
        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <ProcessingIndicator
              stage={processingStage}
              message={
                processingStage === "thinking"
                  ? "Analyzing your question..."
                  : processingStage === "processing"
                    ? "Processing information..."
                    : "Generating response..."
              }
            />
          </div>
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
            placeholder="Ask me anything... I'm here to help! ✨"
          />
        </div>
      </div>
    </div>
  );
};
