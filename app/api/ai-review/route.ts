import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/ai-helpers";

export async function POST(req: NextRequest) {
    try {
        const { resumeText, model } = await req.json();

        if (!resumeText) {
            return NextResponse.json(
                { error: "Resume text is required" },
                { status: 400 }
            );
        }

        const result = await analyzeResume(resumeText, model);
        const responseMessage = result.choices[0]?.message?.content;

        return NextResponse.json({
            message: responseMessage,
            model: result.model,
            usage: result.usage,
        });
    } catch (error) {
        console.error("AI Helper API error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
