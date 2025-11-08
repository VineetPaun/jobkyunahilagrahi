import OpenAI from "openai";

// Initialize OpenRouter client using OpenAI SDK
export const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "JobKyuNahiLagRahi",
    },
});

// Available models for the application
export const MODELS = {
    GPT_OSS_20B: "gpt-oss-20b",
    DEEPSEEK_V3_1: "deepseek/deepseek-chat-v3.1",
    GLM_4_5_AIR: "zhipuai/glm-4.5-air",
    KIMI_K2_0711: "moonshot/kimi-k2-0711",
} as const;

// Model display names and descriptions for the UI
export const MODEL_INFO = [
    {
        id: MODELS.GPT_OSS_20B,
        name: "GPT OSS 20B",
        description: "Open source model",
    },
    {
        id: MODELS.DEEPSEEK_V3_1,
        name: "DeepSeek v3.1",
        description: "Advanced reasoning model",
    },
    {
        id: MODELS.GLM_4_5_AIR,
        name: "GLM 4.5 Air",
        description: "Lightweight & efficient",
    },
    {
        id: MODELS.KIMI_K2_0711,
        name: "Kimi K2",
        description: "Long context model",
    },
] as const;

// Type for model names
export type ModelName = (typeof MODELS)[keyof typeof MODELS];

// Helper function for chat completions
export async function createChatCompletion(
    model: ModelName | string,
    messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
) {
    return openrouter.chat.completions.create({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        stream: false,
    });
}

// Helper function for streaming chat completions
export async function createStreamingChatCompletion(
    model: ModelName | string,
    messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
) {
    return openrouter.chat.completions.create({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
        stream: true,
    });
}

// Helper function for vision models (images + text)
export async function createVisionCompletion(
    model: ModelName | string,
    imageUrl: string,
    prompt: string,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
) {
    return openrouter.chat.completions.create({
        model,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url: { url: imageUrl },
                    },
                ],
            },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens,
    });
}
