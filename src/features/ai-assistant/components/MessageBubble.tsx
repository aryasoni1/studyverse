import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Bot, Copy, Video } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "@/features/ai-assistant/types/aiAssistantTypes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { VideoResponse } from "./video/VideoResponse";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuthStore();
  const [showVideo, setShowVideo] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleGenerateVideo = () => {
    if (user?.subscription_tier === "premium") {
      setShowVideo(true);
    } else {
      // Show upgrade prompt
      alert(
        "Video responses are available for Premium users only. Upgrade to access this feature!"
      );
    }
  };

  const isUser = message.role === "user";

  console.log("MessageBubble props:", message);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
    >
      <div
        className={`flex max-w-3xl ${isUser ? "flex-row-reverse" : "flex-row"} space-x-3`}
      >
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-primary-500" : "bg-gray-600"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block p-4 rounded-lg ${
              isUser
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          style={
                            oneDark as { [key: string]: React.CSSProperties }
                          }
                          language={match[1]}
                          className="rounded-lg border border-purple-500/20"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-slate-700 px-2 py-1 rounded text-sm font-mono border border-purple-500/20"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {/* Real-time interview button */}
                {message.conversationUrl && (
                  <div className="mt-4">
                    <a
                      href={message.conversationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      Join Real-Time AI Interview
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className={`flex items-center mt-2 space-x-2 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-gray-500">
              {format(new Date(message.timestamp), "HH:mm")}
            </span>

            {!isUser && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateVideo}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Video className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {showVideo && !isUser && (
            <div className="mt-4">
              <VideoResponse onClose={() => setShowVideo(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
