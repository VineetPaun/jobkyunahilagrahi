import { NextRequest, NextResponse } from "next/server";
import { createVisionCompletion, MODELS } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
    try {
        const { imageUrl, prompt, model } = await req.json();

        if (!imageUrl || !prompt) {
            return NextResponse.json(
                { error: "Image URL and prompt are required" },
                { status: 400 }
            );
        }

        // Use vision-capable model (only certain models support vision)
        const completion = await createVisionCompletion(
            model || MODELS.DEEPSEEK_V3_1,
            imageUrl,
            prompt
        );

        const responseMessage = completion.choices[0]?.message?.content;

        return NextResponse.json({
            message: responseMessage,
            model: completion.model,
            usage: completion.usage,
        });
    } catch (error) {
        console.error("OpenRouter Vision API error:", error);
        return NextResponse.json(
            { error: "Failed to analyze image" },
            { status: 500 }
        );
    }
}
