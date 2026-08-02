import { createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage } from "ai";
import {
  ELSA_SYSTEM_PROMPT,
  PROJECT_MENTOR_PROMPT,
  CONTINUE_PROMPT,
  FEATURES_PROMPT,
} from "@/lib/prompts";

export const maxDuration = 60;

// OpenRouter (GPT-4o Mini) — Primary
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://flyrank-capstone-rosy.vercel.app",
    "X-Title": "BloomLab",
  },
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Detect user intent
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const lastText = (lastUserMsg?.parts?.find((p: any) => p.type === "text") as any)?.text || "";

  let systemPrompt = ELSA_SYSTEM_PROMPT;

  if (
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

  const convertedMessages = await convertToModelMessages(messages);

  // Try providers in order: OpenRouter → Groq → Gemini
  const providers = [
    {
      name: "openrouter",
      fn: () =>
        streamText({
          model: openrouter("openai/gpt-4o-mini"),
          system: systemPrompt,
          messages: convertedMessages,
         
        }),
    },
    {
      name: "gemini",
      fn: () =>
        streamText({
          model: google("gemini-2.0-flash"),
          system: systemPrompt,
          messages: convertedMessages,
          
        }),
    },
    {
      name: "groq",
      fn: () =>
        streamText({
          model: groq("llama-3.3-70b-versatile"),
          system: systemPrompt,
          messages: convertedMessages,
        
        }),
    },
    
  ];

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
      });
    } catch (error) {
      console.log(`${provider.name} failed, trying next...`);
      continue;
    }
  }

  // All failed
  return new Response(
    JSON.stringify({ error: "All AI providers unavailable. Please try again later." }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}