import React from "react";
import { Loader2, Brain, Zap, Sparkles } from "lucide-react";

interface ProcessingIndicatorProps {
  stage: "thinking" | "processing" | "generating";
  message: string;
}

const stageConfig = {
  thinking: {
    icon: Brain,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  processing: {
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  generating: {
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  stage,
  message,
}) => {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} max-w-md`}
    >
      <div className="flex items-center gap-2">
        <Loader2 className={`w-4 h-4 animate-spin ${config.color}`} />
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{message}</p>
        <div className="flex gap-1 mt-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
          <div
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
};
