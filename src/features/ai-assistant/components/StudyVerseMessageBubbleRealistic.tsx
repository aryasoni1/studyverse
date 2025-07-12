import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { format } from "date-fns";
import type { Message } from "../types/aiAssistantTypes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Video,
  Share,
} from "lucide-react";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface StudyVerseMessageBubbleRealisticProps {
  message: Message;
  isStreaming?: boolean;
  activeFeature: string;
}

export const StudyVerseMessageBubbleRealistic: React.FC<
  StudyVerseMessageBubbleRealisticProps
> = ({ message, isStreaming = false, activeFeature }) => {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
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
      activeFeature === "mock-interview"
    ) {
      setShowVideoResponse(true);
    } else {
      alert(
        "Video responses are available for Premium users in Mock Interview feature!"
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
                ? isDarkMode
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500/50"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/50"
                : isDarkMode
                  ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600/50"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300/50"
            )}
          >
            {isUser ? (
              <User className="w-6 h-6 text-white" />
            ) : (
              <Bot
                className={cn(
                  "w-6 h-6",
                  isDarkMode ? "text-blue-400" : "text-slate-600"
                )}
              />
            )}
          </div>

          {!isUser && isStreaming && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2",
                isDarkMode
                  ? "bg-green-500 border-slate-900"
                  : "bg-green-500 border-white"
              )}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}

          {/* Subtle glow for AI */}
          {!isUser && (
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-lg animate-pulse",
                isDarkMode ? "bg-blue-500/20" : "bg-blue-500/10"
              )}
            />
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
                ? isDarkMode
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white ml-8 border-blue-500/50 shadow-blue-500/25"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-8 border-blue-400/50 shadow-blue-500/20"
                : isDarkMode
                  ? "bg-slate-800/80 backdrop-blur-sm border-slate-700/50 text-slate-100 mr-8 shadow-slate-900/10"
                  : "bg-white/80 backdrop-blur-sm border-slate-200/50 text-slate-900 mr-8 shadow-slate-900/5"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed text-lg">
                {message.content}
              </p>
            ) : (
              <div
                className={cn(
                  "prose prose-lg max-w-none",
                  isDarkMode ? "prose-invert prose-blue" : "prose-slate"
                )}
              >
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          style={
                            (isDarkMode ? oneDark : oneLight) as {
                              [key: string]: React.CSSProperties;
                            }
                          }
                          language={match[1]}
                          className={cn(
                            "rounded-lg border",
                            isDarkMode
                              ? "border-slate-600/20"
                              : "border-slate-300/20"
                          )}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className={cn(
                            "px-2 py-1 rounded text-sm font-mono border",
                            isDarkMode
                              ? "bg-slate-700 border-slate-600/20"
                              : "bg-slate-100 border-slate-300/20"
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1
                        className={cn(
                          "border-b",
                          isDarkMode
                            ? "text-blue-300 border-blue-500/30"
                            : "text-blue-600 border-blue-300/30"
                        )}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        className={cn(
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        )}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        className={cn(
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        )}
                      >
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        className={cn(
                          "border-l-4 rounded-r-lg py-2",
                          isDarkMode
                            ? "border-blue-500 bg-slate-700/50"
                            : "border-blue-400 bg-blue-50/50"
                        )}
                      >
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
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      isDarkMode ? "bg-blue-400" : "bg-blue-500"
                    )}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      isDarkMode ? "bg-blue-400" : "bg-blue-500"
                    )}
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full animate-bounce",
                      isDarkMode ? "bg-blue-400" : "bg-blue-500"
                    )}
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-blue-300" : "text-blue-600"
                  )}
                >
                  StudyVerse AI is thinking...
                </span>
              </div>
            )}

            {/* Video Response Section */}
            {showVideoResponse && !isUser && (
              <div
                className={cn(
                  "mt-4 p-4 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-700/50 border-slate-600/20"
                    : "bg-slate-50/50 border-slate-200/20"
                )}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Video
                    className={cn(
                      "w-5 h-5",
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    )}
                  >
                    Video Response
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-lg p-4 text-center",
                    isDarkMode ? "bg-slate-900" : "bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-600 to-indigo-700"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    )}
                  >
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-blue-300" : "text-blue-600"
                    )}
                  >
                    Generating video response...
                  </p>
                  <div
                    className={cn(
                      "w-full rounded-full h-2 mt-3",
                      isDarkMode ? "bg-slate-700" : "bg-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "h-2 rounded-full animate-pulse",
                        isDarkMode
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600"
                      )}
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
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
            <span
              className={cn(
                "text-xs",
                isDarkMode ? "text-slate-500" : "text-slate-400"
              )}
            >
              {format(new Date(message.timestamp), "HH:mm")}
            </span>

            {!isUser && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 border",
                    isDarkMode
                      ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 border-transparent hover:border-slate-600/20"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-transparent hover:border-slate-200"
                  )}
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
                    "p-1.5 rounded-lg transition-all duration-200 border",
                    isLiked
                      ? isDarkMode
                        ? "text-green-400 bg-green-500/10 border-green-500/20"
                        : "text-green-600 bg-green-50 border-green-200"
                      : isDarkMode
                        ? "text-slate-400 hover:text-green-400 hover:bg-green-500/10 border-transparent hover:border-green-500/20"
                        : "text-slate-400 hover:text-green-600 hover:bg-green-50 border-transparent hover:border-green-200"
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
                    "p-1.5 rounded-lg transition-all duration-200 border",
                    isDisliked
                      ? isDarkMode
                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                        : "text-red-600 bg-red-50 border-red-200"
                      : isDarkMode
                        ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/20"
                        : "text-slate-400 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-200"
                  )}
                  title="Dislike response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {/* Video Response Button for mock interview */}
                {activeFeature === "mock-interview" && (
                  <button
                    onClick={handleGenerateVideo}
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-200 border",
                      isDarkMode
                        ? "text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border-transparent hover:border-blue-500/20"
                        : "text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200"
                    )}
                    title="Generate video response"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    /* Handle share */
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 border",
                    isDarkMode
                      ? "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border-transparent hover:border-indigo-500/20"
                      : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-200"
                  )}
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
