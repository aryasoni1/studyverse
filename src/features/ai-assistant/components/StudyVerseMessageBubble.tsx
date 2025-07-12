import { useState } from "react";
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
  Video,
  Rocket,
} from "lucide-react";
import { format } from "date-fns";
import type { Message } from "../types/aiAssistantTypes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface StudyVerseMessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  activeFeature: string;
}

export const StudyVerseMessageBubble: React.FC<
  StudyVerseMessageBubbleProps
> = ({ message, isStreaming = false, activeFeature }) => {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showVideoResponse, setShowVideoResponse] = useState(false);

  const isUser = message.role === "user";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleGenerateVideo = () => {
    if (
      user?.subscription_tier === "premium" &&
      (activeFeature === "ai-interviewer" ||
        activeFeature === "senior-engineer")
    ) {
      setShowVideoResponse(true);
    } else {
      alert(
        "Video responses are available for Premium users in AI Interviewer and Senior Engineer features!"
      );
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
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-2",
              isUser
                ? "bg-gradient-to-br from-purple-500 to-pink-600 border-purple-400/50"
                : "bg-gradient-to-br from-slate-700 to-slate-800 border-purple-500/30"
            )}
          >
            {isUser ? (
              <User className="w-6 h-6 text-white" />
            ) : (
              <Bot className="w-6 h-6 text-purple-400" />
            )}
          </div>

          {!isUser && isStreaming && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-900">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}

          {/* Cosmic glow for AI */}
          {!isUser && (
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg animate-pulse" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn("flex-1 min-w-0", isUser ? "text-right" : "text-left")}
        >
          {/* Message Bubble */}
          <div
            className={cn(
              "relative p-5 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl border",
              isUser
                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white ml-8 border-purple-400/50 shadow-purple-500/25"
                : "bg-slate-800/80 backdrop-blur-sm border-purple-500/20 text-slate-100 mr-8 shadow-purple-500/10"
            )}
          >
            {/* StudyVerse AI indicator */}
            {!isUser && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Rocket className="w-4 h-4 text-white" />
              </div>
            )}

            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed text-lg">
                {message.content}
              </p>
            ) : (
              <div className="prose prose-lg max-w-none prose-invert prose-purple">
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
                    h1: ({ children }) => (
                      <h1 className="text-purple-300 border-b border-purple-500/30">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-purple-300">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-purple-300">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 bg-slate-700/50 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Streaming indicator */}
            {isStreaming && !isUser && (
              <div className="flex items-center mt-4 space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm text-purple-300">
                  StudyVerse AI is thinking...
                </span>
              </div>
            )}

            {/* Video Response Section */}
            {showVideoResponse && !isUser && (
              <div className="mt-4 p-4 bg-slate-700/50 rounded-xl border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Video Response
                  </span>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <p className="text-purple-300 text-sm">
                    Generating video response...
                  </p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Video Response Display */}
            {message.videoUrl && !isUser && (
              <div className="mt-4">
                <video
                  controls
                  src={message.videoUrl}
                  style={{ maxWidth: 400 }}
                />
                <a
                  href={message.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-purple-400 underline"
                >
                  Watch AI Interview Video
                </a>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div
            className={cn(
              "flex items-center mt-3 space-x-3 transition-all duration-200",
              isUser ? "justify-end" : "justify-start",
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1"
            )}
          >
            <span className="text-xs text-slate-500">
              {format(new Date(message.timestamp), "HH:mm")}
            </span>

            {!isUser && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-500/20"
                  title="Copy message"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setIsDisliked(false);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 border",
                    isLiked
                      ? "text-green-400 bg-green-500/10 border-green-500/20"
                      : "text-slate-400 hover:text-green-400 hover:bg-green-500/10 border-transparent hover:border-green-500/20"
                  )}
                  title="Like response"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsDisliked(!isDisliked);
                    setIsLiked(false);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 border",
                    isDisliked
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/20"
                  )}
                  title="Dislike response"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>

                {/* Video Response Button for specific features */}
                {(activeFeature === "ai-interviewer" ||
                  activeFeature === "senior-engineer") && (
                  <button
                    onClick={handleGenerateVideo}
                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-500/20"
                    title="Generate video response"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    /* Handle share */
                  }}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/20"
                  title="Share response"
                >
                  <Share className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
