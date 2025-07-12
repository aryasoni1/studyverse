import { useState, useRef } from "react";
import { Send, Mic, MicOff, Paperclip, Smile, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernMessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  canSendMessage?: boolean;
  placeholder?: string;
}

export const ModernMessageInput: React.FC<ModernMessageInputProps> = ({
  onSendMessage,
  disabled = false,
  canSendMessage = true,
  placeholder = "Ask me anything...",
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && canSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement speech-to-text
  };

  return (
    <div className="relative">
      {/* Main Input Container */}
      <div
        className={cn(
          "relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-all duration-300",
          isFocused && "shadow-xl border-blue-200 bg-white/90",
          !canSendMessage && "opacity-60"
        )}
      >
        <form onSubmit={handleSubmit} className="flex items-end p-4 space-x-3">
          {/* Attachment Button */}
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            disabled={disabled || !canSendMessage}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                canSendMessage ? placeholder : "Upgrade to continue chatting"
              }
              disabled={disabled || !canSendMessage}
              className="w-full bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 text-base leading-relaxed"
              rows={1}
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Emoji Button */}
            <button
              type="button"
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              disabled={disabled || !canSendMessage}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || !canSendMessage}
              className={cn(
                "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                isRecording
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || !canSendMessage}
              className={cn(
                "flex-shrink-0 p-2 rounded-lg transition-all duration-200 group",
                message.trim() && canSendMessage && !disabled
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {message.trim() && canSendMessage && !disabled ? (
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Usage Limit Warning */}
        {!canSendMessage && (
          <div className="px-4 pb-3">
            <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                You've reached your message limit.{" "}
                <button className="font-semibold text-orange-600 hover:text-orange-700 underline">
                  Upgrade to Premium
                </button>{" "}
                for unlimited conversations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
          🎤 Recording... Tap to stop
        </div>
      )}
    </div>
  );
};
