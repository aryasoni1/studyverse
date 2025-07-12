import { MessageSquare, Zap, Video, Shield } from "lucide-react";

interface EmptyStateProps {
  onStartChat: (message: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onStartChat }) => {
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "Help me plan a weekend trip to Paris",
    "What are the latest trends in web development?",
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Smart Conversations",
      description:
        "Engage in natural, context-aware conversations with advanced AI",
    },
    {
      icon: Zap,
      title: "Real-time Responses",
      description:
        "Get instant, streaming responses for a seamless chat experience",
    },
    {
      icon: Video,
      title: "Video Avatars",
      description: "Premium users can generate video responses with AI avatars",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and stored securely",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your intelligent companion for conversations, coding, creative
          writing, and more. Start a conversation below or try one of our
          suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-4xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <feature.icon className="w-6 h-6 text-primary-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Try these conversation starters:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onStartChat(suggestion)}
              className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200 group"
            >
              <span className="text-gray-700 group-hover:text-primary-600">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
