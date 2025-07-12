import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Inline prompt config for Deno
const prompts = {
  roadmap_generation: {
    system_prompt:
      "You are an expert learning path designer helping students achieve their goals step-by-step, personalized to their skill level.",
    user_prompt:
      "Create a detailed, step-by-step learning roadmap for achieving the following goal: {{goal}}. Include milestones, resources, and estimated timelines for each stage. Make it tailored for a self-learner. Limit the roadmap to 10 concise bullet points or steps.",
  },
  notes_generation: {
    system_prompt:
      "You are a top educator skilled in turning complex concepts into clear, structured notes.",
    user_prompt:
      "Generate clear, concise notes on: {{topic}}. Break the content into headings, bullet points, and examples. Use simple language and make it suitable for revision. Limit the notes to 8 key bullet points or sections.",
  },
  summary: {
    system_prompt:
      "You are an AI summarization assistant who condenses content without losing meaning.",
    user_prompt:
      "Summarize the following text while preserving key points and examples. Keep it short, clear, and ideal for quick revision. Limit the summary to 5 sentences:\n\n{{input_text}}",
  },
  collaborate: {
    system_prompt:
      "You are a smart collaborator that breaks large goals into achievable technical tasks and timelines.",
    user_prompt:
      "Help me break down this big goal into smaller tasks and assign rough deadlines and dependencies. Goal: {{goal}}. Output in bullet format or a Kanban-style column format (To-Do, In Progress, Done). Limit the output to 8 concise tasks or bullet points.",
  },
  interview: {
    system_prompt:
      "You are a mock interviewer helping candidates prepare with realistic, role-specific Q&A.",
    user_prompt:
      "Generate an AI mock interview with 5–7 high-quality questions and suggested answers for this role: {{role}}. Focus on key skills, behavioral questions, and one system design question if applicable. Keep each answer concise.",
  },
  ask: {
    system_prompt:
      "You're a helpful and knowledgeable AI tutor for learners at all levels.",
    user_prompt:
      "Answer the following question clearly and thoroughly, using bullet points or code examples if needed: {{question}}. Limit your answer to 5–7 concise sentences or bullets.",
  },
};

function fillPrompt(template, variables) {
  return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || "");
}

function getMaxOutputTokens(feature) {
  switch (feature) {
    case "roadmap_generation":
      return 350;
    case "notes_generation":
      return 300;
    case "summary":
      return 180;
    case "collaborate":
      return 250;
    case "interview":
      return 350;
    case "ask":
    default:
      return 180;
  }
}

async function callGemini(systemPrompt, userPrompt, feature) {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
  const model = "gemini-1.5-flash";
  const prompt = `${systemPrompt}\n\n${userPrompt}`;
  const request = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: getMaxOutputTokens(feature),
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Gemini API error: " + (await res.text()));
  const data = await res.json();
  if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text)
    throw new Error("No Gemini response");
  return data.candidates[0].content.parts[0].text;
}

async function callTavus(text) {
  const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
  const TAVUS_BASE_URL = "https://tavusapi.com/v2";
  // 1. Create video
  const createRes = await fetch(`${TAVUS_BASE_URL}/videos`, {
    method: "POST",
    headers: { "x-api-key": TAVUS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      script: text,
      replica_id: "rbfadb437a1e",
      video_name: `AI Interview ${Date.now()}`,
    }),
  });
  if (!createRes.ok)
    throw new Error("Tavus API error: " + (await createRes.text()));
  const createData = await createRes.json();
  const videoId = createData.video_id;
  // 2. Poll for completion (simple version, production should use webhook or async)
  let status = "queued",
    videoUrl = null,
    tries = 0;
  while (status !== "completed" && tries < 20) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(`${TAVUS_BASE_URL}/videos/${videoId}`, {
      headers: { "x-api-key": TAVUS_API_KEY },
    });
    const statusData = await statusRes.json();
    status = statusData.status;
    if (status === "completed") videoUrl = statusData.download_url;
    tries++;
  }
  if (!videoUrl) throw new Error("Tavus video not ready");
  return videoUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { feature, variables, session_id } = await req.json();
    if (!feature || !variables) {
      return new Response(
        JSON.stringify({
          error: "feature and variables are required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Handle interview_realtime before promptConfig check
    if (feature === "interview_realtime") {
      const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
      const TAVUS_BASE_URL = "https://tavusapi.com/v2";
      const personaId = "p94627966799";
      const replicaId = "rb17cf590e15";
      const context = variables.role || "General Interview";
      const res = await fetch(`${TAVUS_BASE_URL}/conversations`, {
        method: "POST",
        headers: {
          "x-api-key": TAVUS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          conversation_name: "AI Interview",
          conversational_context: context,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Tavus Conversation API error: " + errText);
      }
      const data = await res.json();
      return new Response(
        JSON.stringify({
          conversationUrl: data.conversation_url,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Now check promptConfig for all other features
    const promptConfig = prompts[feature];
    if (!promptConfig) {
      return new Response(
        JSON.stringify({
          error: "Invalid feature",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const userPrompt = fillPrompt(promptConfig.user_prompt, variables);
    const systemPrompt = promptConfig.system_prompt;
    let responseText = "",
      videoUrl = null;
    if (feature === "interview") {
      responseText = await callGemini(systemPrompt, userPrompt, feature);
      videoUrl = await callTavus(responseText);
    } else {
      responseText = await callGemini(systemPrompt, userPrompt, feature);
    }
    const sessionId = session_id || crypto.randomUUID();
    await supabaseClient.from("ai_chat_history").insert({
      user_id: user.id,
      session_id: sessionId,
      feature,
      variables,
      response: responseText,
      video_url: videoUrl,
      model_used: "gemini-1.5-flash",
      tokens_used: responseText.length,
      response_time: 0,
    });
    return new Response(JSON.stringify({ response: responseText, videoUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/* TODO: Production Implementation
 *
 * 1. Integrate with OpenAI API:
 *    - Add OPENAI_API_KEY to environment variables
 *    - Use OpenAI SDK to generate responses
 *    - Implement proper prompt engineering for educational context
 *
 * 2. Add rate limiting:
 *    - Check user's plan limits
 *    - Track usage in usage_tracking table
 *    - Return appropriate errors when limits exceeded
 *
 * 3. Enhance context awareness:
 *    - Fetch user's learning history
 *    - Include relevant notes and progress
 *    - Personalize responses based on user level
 *
 * 4. Add conversation memory:
 *    - Maintain conversation context across messages
 *    - Reference previous messages in the session
 *
 * 5. Implement safety measures:
 *    - Content filtering
 *    - Inappropriate content detection
 *    - Educational focus enforcement
 *
 * Example OpenAI integration:
 *
 * const openai = new OpenAI({
 *   apiKey: Deno.env.get('OPENAI_API_KEY'),
 * });
 *
 * const completion = await openai.chat.completions.create({
 *   model: "gpt-4",
 *   messages: [
 *     {
 *       role: "system",
 *       content: "You are an AI learning assistant for SkillForge..."
 *     },
 *     {
 *       role: "user",
 *       content: message
 *     }
 *   ],
 * });
 */
