import { createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage, tool } from "ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
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

// ─── FE-07: getLearningContext Tool ───
const getLearningContextTool = tool({
  description: "ONLY call this tool when the user explicitly asks to see their learning summary, progress, stats, streak, XP, or achievements. Do NOT call for lesson questions or regular chat.",
  inputSchema: z.object({
    userId: z.string().describe("The user's Supabase UUID. If unknown, send empty string."),
  }),
  execute: async ({ userId }) => {
    // If userId is empty, get from auth
    let actualUserId = userId;
    if (!actualUserId || actualUserId.trim() === "") {
      const supabaseServer = await createClient();
      const { data: { user } } = await supabaseServer.auth.getUser();
      actualUserId = user?.id || "";
    }
    
    if (!actualUserId) {
      return { error: "User not authenticated" };
    }
    
    const supabase = await createClient();
    
    // Fetch projects
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", actualUserId)
      .order("created_at", { ascending: false })
      .limit(5);
    
    // Fetch skills
    const projectIds = (projects || []).map(p => p.id);
    let skills: any[] = [];
    if (projectIds.length > 0) {
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .in("project_id", projectIds);
      skills = skillsData || [];
    }
    
    // Fetch user stats
    const { data: userData } = await supabase
      .from("users")
      .select("streak, xp")
      .eq("id", actualUserId)
      .single();
    
    // Fetch badges
    const { data: badges } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", actualUserId)
      .order("earned_at", { ascending: false })
      .limit(5);
    
    // Fetch recent lessons
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("user_id", actualUserId)
      .eq("completed", true)
      .order("completed_at", { ascending: false })
      .limit(5);
    
    const completedSkills = skills.filter(s => s.status === "completed");
    const activeSkills = skills.filter(s => s.status === "active");
    
    return {
      projects: (projects || []).map(p => ({
        title: p.title,
        progress: p.progress || 0,
        status: p.status,
      })),
      totalSkills: skills.length,
      completedSkills: completedSkills.length,
      activeSkill: activeSkills[0]?.name || null,
      streak: userData?.streak || 0,
      xp: userData?.xp || 0,
      badges: (badges || []).map(b => b.badge_name),
      recentLessons: (lessons || []).map(l => l.title || "Lesson"),
    };
  },
});

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;

  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
  const lastText = lastUserMsg?.content || 
    lastUserMsg?.parts?.find((p: any) => p.type === "text")?.text || "";

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let systemPrompt = ELSA_SYSTEM_PROMPT;
  
  // Tool usage rule
  systemPrompt += "\n\nIMPORTANT TOOL RULE: Only use the getLearningContext tool when the user explicitly asks about their progress, stats, learning summary, streak, XP, or achievements. For lesson questions, project help, or regular chat, respond with text only. Do NOT call the tool unless the user asks for their data.";
  
  let isSkillMapRequest = false;
  let isAICertificateRequest = false;

  if (lastText.includes("[SKILL_MAP_REQUEST]")) {
    systemPrompt += "\n\n" + SKILL_MAP_REQUEST_PROMPT;
    isSkillMapRequest = true;
  } else if (lastText.includes("Generate a 3-line description")) {
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

  const isUIMessageFormat = messages.every((m: any) => m.parts && Array.isArray(m.parts));
  
  let convertedMessages;
  if (isUIMessageFormat) {
    convertedMessages = await convertToModelMessages(messages as UIMessage[]);
  } else {
    convertedMessages = messages.map((m: any) => ({ role: m.role, content: m.content || "" }));
  }

  const providers = [
    {
      name: "openrouter",
      fn: () => streamText({ 
        model: openrouter("openai/gpt-4o-mini"), 
        system: systemPrompt, 
        messages: convertedMessages,
        tools: authUser ? { getLearningContext: getLearningContextTool } : undefined,
      }),
    },
    {
      name: "gemini",
      fn: () => streamText({ 
        model: google("gemini-2.0-flash"), 
        system: systemPrompt, 
        messages: convertedMessages,
        tools: authUser ? { getLearningContext: getLearningContextTool } : undefined,
      }),
    },
    {
      name: "groq",
      fn: () => streamText({ 
        model: groq("llama-3.3-70b-versatile"), 
        system: systemPrompt, 
        messages: convertedMessages,
        tools: authUser ? { getLearningContext: getLearningContextTool } : undefined,
      }),
    },
  ];

  for (const provider of providers) {
    try {
      const result = await provider.fn();
      return createUIMessageStreamResponse({ 
        stream: toUIMessageStream({ stream: result.stream }) 
      });
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