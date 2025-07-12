import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
}) => {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex max-w-3xl flex-row space-x-3">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1 text-left">
          <div className="inline-block p-4 rounded-lg bg-white border border-gray-200 text-gray-900">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
