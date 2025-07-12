import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import type { Message } from "../types/aiAssistantTypes";
import { cn } from "@/lib/utils";

interface ModernMessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export const ModernMessageBubble: React.FC<ModernMessageBubbleProps> = ({
  message,
  isStreaming = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isUser = message.role === "user";

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    }
  };

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  return (
    <div
      className={cn(
        "group flex w-full animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={cn(
          "flex max-w-4xl w-full",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div className={cn("flex-shrink-0 relative", isUser ? "ml-4" : "mr-4")}>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200",
              isUser
                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                : "bg-gradient-to-br from-emerald-500 to-teal-600"
            )}
          >
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {!isUser && isStreaming && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn("flex-1 min-w-0", isUser ? "text-right" : "text-left")}
        >
          {/* Message Bubble */}
          <div
            className={cn(
              "relative p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl",
              isUser
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-8"
                : "bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900 mr-8"
            )}
          >
            {/* Sparkle effect for AI messages */}
            {!isUser && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-80">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Video response for interview (Tavus) */}
            {!isUser && message.videoUrl && (
              <div className="mb-4">
                <video
                  src={message.videoUrl}
                  controls
                  className="w-full max-w-md rounded-lg border border-gray-200 shadow"
                  style={{ background: "#000" }}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="text-xs text-gray-500 mt-1">
                  AI-generated video response
                </div>
              </div>
            )}
            {/* Real-time interview embed */}
            {!isUser && message.conversationUrl && (
              <div className="mt-4 relative">
                <iframe
                  ref={iframeRef}
                  src={message.conversationUrl}
                  title="AI Interview"
                  width="100%"
                  height="600"
                  allow="camera; microphone"
                  style={{
                    border: "none",
                    borderRadius: "16px",
                    minHeight: 400,
                    maxWidth: 900,
                    margin: "0 auto",
                    display: "block",
                  }}
                />
                {!isFullscreen && (
                  <button
                    onClick={handleFullscreen}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition"
                    title="Fullscreen"
                  >
                    Fullscreen
                  </button>
                )}
                {isFullscreen && (
                  <button
                    onClick={handleExitFullscreen}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition z-50"
                    title="Exit Fullscreen"
                  >
                    Exit Fullscreen
                  </button>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  This is a live AI interview. Please allow camera and
                  microphone access.
                </div>
              </div>
            )}

            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            ) : (
              <div className="prose prose-sm max-w-none prose-gray">
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
                          className="rounded-lg border border-blue-500/20"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-blue-100 px-2 py-1 rounded text-sm font-mono border border-blue-500/20"
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
              </div>
            )}

            {/* Streaming indicator */}
            {isStreaming && !isUser && (
              <div className="flex items-center mt-3 space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-xs text-gray-500">AI is typing...</span>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div
            className={cn(
              "flex items-center mt-2 space-x-2 transition-all duration-200",
              isUser ? "justify-end" : "justify-start",
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            )}
          >
            <span className="text-xs text-gray-500">
              {(() => {
                const dateValue = message.timestamp;
                if (!dateValue) return "";
                let formatted = "";
                try {
                  const dateObj = new Date(dateValue);
                  if (!isNaN(dateObj.getTime())) {
                    formatted = format(dateObj, "HH:mm");
                  }
                } catch {
                  formatted = "";
                }
                return formatted;
              })()}
            </span>

            {!isUser && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Copy message"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setIsDisliked(false);
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isLiked
                      ? "text-green-600 bg-green-50"
                      : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                  )}
                  title="Like response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setIsDisliked(!isDisliked);
                    setIsLiked(false);
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isDisliked
                      ? "text-red-600 bg-red-50"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  )}
                  title="Dislike response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    /* Handle share */
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Share response"
                >
                  <Share className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
