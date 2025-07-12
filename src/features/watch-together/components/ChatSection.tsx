import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { WatchRoomMessage } from "../types/watchTogetherTypes";

interface ChatSectionProps {
  messages: WatchRoomMessage[];
  onSendMessage: (message: string) => void;
  darkMode?: boolean;
}

export function ChatSection({
  messages,
  onSendMessage,
  darkMode = false,
}: ChatSectionProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        darkMode && "bg-gray-900 text-white"
      )}
    >
      {/* Messages */}
      <ScrollArea
        className={cn("flex-1 p-4", darkMode && "scrollbar-thumb-gray-600")}
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p
                className={cn(
                  "text-muted-foreground",
                  darkMode && "text-gray-400"
                )}
              >
                No messages yet.
              </p>
              <p
                className={cn(
                  "text-sm text-muted-foreground mt-1",
                  darkMode && "text-gray-500"
                )}
              >
                Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user?.avatar_url} />
                  <AvatarFallback
                    className={darkMode ? "bg-gray-700 text-white" : undefined}
                  >
                    {message.user?.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        darkMode && "text-gray-200"
                      )}
                    >
                      {message.user?.full_name || "Unknown User"}
                    </span>
                    <span
                      className={cn(
                        "text-xs text-muted-foreground",
                        darkMode && "text-gray-500"
                      )}
                    >
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "text-sm",
                      message.message_type === "system"
                        ? "text-muted-foreground italic"
                        : "text-foreground",
                      darkMode && message.message_type === "system"
                        ? "text-gray-400 italic"
                        : darkMode && "text-gray-100"
                    )}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className={cn("p-4 border-t", darkMode && "border-gray-800")}>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className={cn(
              "flex-1",
              darkMode &&
                "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            )}
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={
              darkMode ? "bg-purple-600 hover:bg-purple-700" : undefined
            }
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
