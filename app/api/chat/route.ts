import { NextRequest, NextResponse } from "next/server";
import { openrouter, MODELS } from "@/lib/openrouter";
import { RESUME_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai-helpers";

export async function POST(req: NextRequest) {
    try {
        const { message, model, resumeContext, conversationHistory } =
            await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build messages array with context
        const messages: Array<{
            role: "system" | "user" | "assistant";
            content: string;
        }> = [];

        // System prompt with resume context if available
        let systemPrompt = RESUME_ASSISTANT_SYSTEM_PROMPT;

        if (resumeContext) {
            systemPrompt += `\n\n## USER'S RESUME CONTEXT:\n${resumeContext}\n\nUse this resume to provide personalized, specific advice. Reference actual content from their resume when answering questions.`;
        }

        messages.push({
            role: "system",
            content: systemPrompt,
        });

        // Add conversation history if available (keep last 10 messages for context)
        if (conversationHistory && Array.isArray(conversationHistory)) {
            const recentHistory = conversationHistory.slice(-10);
            recentHistory.forEach((msg: { role: string; content: string }) => {
                if (msg.role === "user" || msg.role === "assistant") {
                    messages.push({
                        role: msg.role,
                        content: msg.content,
                    });
                }
            });
        }

        // Add current message
        messages.push({
            role: "user",
            content: message,
        });

        // Call AI
        const completion = await openrouter.chat.completions.create({
            model: model || MODELS.DEEPSEEK_V3_1,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            stream: false,
        });

        const responseMessage = completion.choices[0]?.message?.content;

        return NextResponse.json({
            message: responseMessage,
            model: completion.model,
            usage: completion.usage,
        });
    } catch (error) {
        console.error("OpenRouter API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
