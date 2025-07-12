const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
const TAVUS_BASE_URL = "https://tavusapi.com/v2";

export class TavusService {
  private apiKey: string;

  constructor() {
    if (!TAVUS_API_KEY) {
      throw new Error("Missing Tavus API key");
    }
    this.apiKey = TAVUS_API_KEY;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${TAVUS_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Tavus API error: ${response.statusText}`);
    }

    return response.json();
  }

  async generateVideo(
    text: string,
    avatarId?: string
  ): Promise<{ video_id: string }> {
    try {
      const response = await this.makeRequest("/videos", {
        method: "POST",
        body: JSON.stringify({
          script: text,
          replica_id: avatarId || "default-avatar",
          video_name: `AI Response ${Date.now()}`,
          background_url: null,
        }),
      });

      return response;
    } catch (error) {
      console.error("Tavus video generation error:", error);
      throw new Error("Failed to generate video");
    }
  }

  async getVideoStatus(videoId: string): Promise<{
    status: "queued" | "generating" | "completed" | "failed";
    download_url?: string;
    thumbnail_url?: string;
  }> {
    try {
      const response = await this.makeRequest(`/videos/${videoId}`);
      return response;
    } catch (error) {
      console.error("Tavus video status error:", error);
      throw new Error("Failed to get video status");
    }
  }

  async listAvatars(): Promise<
    Array<{
      replica_id: string;
      name: string;
      thumbnail_url: string;
    }>
  > {
    try {
      const response = await this.makeRequest("/replicas");
      return response.data || [];
    } catch (error) {
      console.error("Tavus avatars list error:", error);
      throw new Error("Failed to list avatars");
    }
  }
}

export const tavusService = new TavusService();