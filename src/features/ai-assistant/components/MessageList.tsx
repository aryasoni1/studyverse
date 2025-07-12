import { MessageBubble } from "./MessageBubble";
import { StreamingMessage } from "./StreamingMessage";
import type { Message } from "../types/aiAssistantTypes";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  streamingContent,
}) => {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {messages.map((message) => {
        if ("created_at" in message) {
          const mappedMessage: Message = {
            id: message.id,
            content: message.content,
            role: message.role as "user" | "assistant" | "system",
            timestamp: String(message.created_at),
            user_id: message.user_id,
            chat_session_id: "",
            type: "text",
          };
          return <MessageBubble key={message.id} message={mappedMessage} />;
        } else {
          return <MessageBubble key={message.id} message={message} />;
        }
      })}

      {isStreaming && <StreamingMessage content={streamingContent} />}
    </div>
  );
};
