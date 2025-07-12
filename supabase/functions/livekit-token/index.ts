import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AccessToken } from "npm:livekit-server-sdk@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TokenRequest {
  room_id: string;
  participant_name?: string;
  permissions?: {
    canPublish?: boolean;
    canSubscribe?: boolean;
    canPublishData?: boolean;
    canUpdateMetadata?: boolean;
  };
}

interface TokenResponse {
  token: string;
  room_name: string;
  participant_identity: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse body for room_id, participant_name, permissions
    const {
      room_id,
      participant_name,
      permissions = {
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        canUpdateMetadata: false,
      },
    } = await req.json();

    if (!room_id) {
      return new Response(
        JSON.stringify({ error: "Missing room_id parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check room exists and user has access
    const { data: room, error: roomError } = await supabaseClient
      .from("study_rooms")
      .select("id, name, host_id, is_public, password_hash")
      .eq("id", room_id)
      .single();
    if (roomError || !room) {
      return new Response(JSON.stringify({ error: "Study room not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isHost = room.host_id === user.id;
    const canAccess = isHost || room.is_public;
    if (!canAccess) {
      return new Response(
        JSON.stringify({ error: "Access denied to this study room" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Add user as participant if not already
    const { data: participant } = await supabaseClient
      .from("study_room_participants")
      .select("id")
      .eq("room_id", room_id)
      .eq("user_id", user.id)
      .single();
    if (!participant) {
      await supabaseClient.from("study_room_participants").insert({
        room_id: room_id,
        user_id: user.id,
        is_moderator: isHost,
      });
    }

    // Get user profile for display name
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    const participantIdentity = user.id;
    const participantDisplayName =
      participant_name || profile?.full_name || "Anonymous";

    // Generate LiveKit JWT
    const apiKey = Deno.env.get("LIVEKIT_API_KEY");
    const apiSecret = Deno.env.get("LIVEKIT_API_SECRET");
    if (!apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: "LiveKit credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantDisplayName,
      // Optionally set ttl: 2 * 60 * 60, // 2 hours in seconds
    });
    token.addGrant({
      roomJoin: true,
      room: room_id,
      canPublish: permissions.canPublish,
      canSubscribe: permissions.canSubscribe,
      canPublishData: permissions.canPublishData,
    });
    const jwt = await token.toJwt();
    return new Response(
      JSON.stringify({
        token: jwt,
        room_name: room.name,
        participant_identity: participantIdentity,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate token",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
