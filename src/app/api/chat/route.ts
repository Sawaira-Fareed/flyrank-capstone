import { createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage } from "ai";
import {
  ELSA_SYSTEM_PROMPT,
  PROJECT_MENTOR_PROMPT,
  CONTINUE_PROMPT,
  FEATURES_PROMPT,
  SKILL_MAP_REQUEST_PROMPT,
} from "@/lib/prompts";

export const maxDuration = 60;

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://flyrank-capstone-rosy.vercel.app",
    "X-Title": "BloomLab",
  },
});

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;

  // Extract last user message text — support both formats
  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
  const lastText = lastUserMsg?.content || 
    lastUserMsg?.parts?.find((p: any) => p.type === "text")?.text || "";

  let systemPrompt = ELSA_SYSTEM_PROMPT;
  let isSkillMapRequest = false;
  let isAICertificateRequest = false;

  // Check for [SKILL_MAP_REQUEST] first
  if (lastText.includes("[SKILL_MAP_REQUEST]")) {
    systemPrompt += "\n\n" + SKILL_MAP_REQUEST_PROMPT;
    isSkillMapRequest = true;
  } else if (lastText.includes("Generate a 3-line description")) {
    // Certificate AI suggestion
    isAICertificateRequest = true;
  } else if (
    lastText.match(/want to (build|create|make|start)/i) ||
    lastText.match(/wanna (build|create|make)/i) ||
    lastText.match(/i want (a|an|to)/i)
  ) {
    systemPrompt += "\n\n" + PROJECT_MENTOR_PROMPT;
  } else if (lastText.match(/continue|go on|next|proceed|resume/i)) {
    systemPrompt += "\n\n" + CONTINUE_PROMPT;
  } else if (lastText.match(/feature|suggest|what (else|can|should)/i)) {
    systemPrompt += "\n\n" + FEATURES_PROMPT;
  }

  // For skill map AND certificate requests — use non-streaming with plain format
  if (isSkillMapRequest || isAICertificateRequest) {
    const userContent = isSkillMapRequest 
      ? lastText.replace("[SKILL_MAP_REQUEST]", "").trim()
      : lastText;

    const providers = [
      { name: "openrouter", model: openrouter("openai/gpt-4o-mini") },
      { name: "gemini", model: google("gemini-2.0-flash") },
      { name: "groq", model: groq("llama-3.3-70b-versatile") },
    ];

    for (const provider of providers) {
      try {
        const result = streamText({
          model: provider.model,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
        });

        let fullText = "";
        for await (const chunk of result.textStream) {
          fullText += chunk;
        }

        return new Response(fullText, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      } catch (error) {
        console.error(`${provider.name} failed:`, error);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: "All AI providers unavailable." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  // Regular chat — check if messages are already in ModelMessage format
  const isUIMessageFormat = messages.every((m: any) => m.parts && Array.isArray(m.parts));
  
  let convertedMessages;
  if (isUIMessageFormat) {
    convertedMessages = await convertToModelMessages(messages as UIMessage[]);
  } else {
    // Already plain format — use directly
    convertedMessages = messages.map((m: any) => ({ role: m.role, content: m.content || "" }));
  }

  const providers = [
    {
      name: "openrouter",
      fn: () => streamText({ model: openrouter("openai/gpt-4o-mini"), system: systemPrompt, messages: convertedMessages }),
    },
    {
      name: "gemini",
      fn: () => streamText({ model: google("gemini-2.0-flash"), system: systemPrompt, messages: convertedMessages }),
    },
    {
      name: "groq",
      fn: () => streamText({ model: groq("llama-3.3-70b-versatile"), system: systemPrompt, messages: convertedMessages }),
    },
  ];

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
    } catch (error) {
      console.log(`${provider.name} failed, trying next...`);
      continue;
    }
  }

  return new Response(
    JSON.stringify({ error: "All AI providers unavailable." }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}