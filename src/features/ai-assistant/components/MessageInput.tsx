import React, { useState, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  canSendMessage?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  canSendMessage = true,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // TODO: Implement speech-to-text
    } else {
      // Start recording
      setIsRecording(true);
      // TODO: Implement speech-to-text
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={
              canSendMessage
                ? "Type your message..."
                : "Upgrade to Premium to continue chatting"
            }
            disabled={disabled || !canSendMessage}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            disabled={disabled || !canSendMessage}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
              isRecording ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || disabled || !canSendMessage}
          className="px-4 py-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {!canSendMessage && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            You've reached your message limit.{" "}
            <a
              href="/upgrade"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Upgrade to Premium
            </a>{" "}
            for unlimited messages.
          </p>
        </div>
      )}
    </div>
  );
};
