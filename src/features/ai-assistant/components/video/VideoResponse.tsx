import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { tavusService } from "@/lib/tavus"; // Temporarily commented out, fix path if needed

interface VideoResponseProps {
  // messageContent: string; // Unused until tavusService is implemented
  onClose: () => void;
}

export const VideoResponse: React.FC<VideoResponseProps> = ({
  // messageContent, // Unused until tavusService is implemented
  onClose,
}) => {
  // const [status, setStatus] = useState<"generating" | "completed" | "failed">(
  //   "generating"
  // );
  // const [videoUrl, setVideoUrl] = useState<string>(""); // Unused until tavusService is implemented
  // const [progress, setProgress] = useState(0); // Unused until tavusService is implemented

  useEffect(() => {
    generateVideo();
  }, []);

  const generateVideo = async () => {
    try {
      // TODO: Implement video generation logic when tavusService is available
      // const { video_id } = await tavusService.generateVideo(messageContent);

      // Polling for video status is disabled until tavusService is implemented

      // Cleanup logic for polling will be added when tavusService is implemented
      return () => {};
    } catch (error) {
      console.error("Error generating video:", error);
      // setStatus("failed");
    }
  };

  // TODO: Re-enable video response UI when tavusService is implemented
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Video Response</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Video responses are not currently available. Please check back later.
        </p>
      </div>
    </div>
  );
};
