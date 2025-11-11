import { NextRequest, NextResponse } from "next/server";
import { openrouter, MODELS } from "@/lib/openrouter";
import {
    RESUME_ASSISTANT_SYSTEM_PROMPT,
    ROAST_MODE_SYSTEM_PROMPT,
} from "@/lib/ai-helpers";

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

        // Check if roast mode is enabled (using the uncensored model)
        const isRoastMode =
            model ===
            "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";

        // System prompt with resume context if available
        let systemPrompt = isRoastMode
            ? ROAST_MODE_SYSTEM_PROMPT
            : RESUME_ASSISTANT_SYSTEM_PROMPT;

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

        // Call AI with streaming enabled
        const stream = await openrouter.chat.completions.create({
            model: model || MODELS.DEEPSEEK_V3_1,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
            stream: true,
        });

        // Create a ReadableStream for Server-Sent Events
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({ content })}\n\n`
                                )
                            );
                        }
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("OpenRouter API error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
