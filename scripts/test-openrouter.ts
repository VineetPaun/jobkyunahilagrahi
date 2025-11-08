/**
 * Quick test script to verify OpenRouter setup
 * Run with: npx tsx scripts/test-openrouter.ts
 */

import { createChatCompletion, MODELS } from "../lib/openrouter";

async function testOpenRouter() {
    console.log("🧪 Testing OpenRouter setup...\n");

    try {
        console.log("📡 Sending request to DeepSeek v3.1...");

        const response = await createChatCompletion(
            MODELS.DEEPSEEK_V3_1,
            [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant. Keep responses brief.",
                },
                {
                    role: "user",
                    content:
                        'Say "Hello! OpenRouter is working!" in a creative way.',
                },
            ],
            {
                temperature: 0.7,
                maxTokens: 100,
            }
        );

        console.log("\n✅ Success!\n");
        console.log("Model:", response.model);
        console.log("Response:", response.choices[0].message.content);
        console.log("\nUsage:");
        console.log("  - Prompt tokens:", response.usage?.prompt_tokens);
        console.log(
            "  - Completion tokens:",
            response.usage?.completion_tokens
        );
        console.log("  - Total tokens:", response.usage?.total_tokens);
    } catch (error: any) {
        console.error("\n❌ Error:", error.message);

        if (error.message.includes("OPENROUTER_API_KEY")) {
            console.log(
                "\n💡 Tip: Make sure you have set OPENROUTER_API_KEY in .env.local"
            );
            console.log("   Get your key from: https://openrouter.ai/keys");
        }
    }
}

testOpenRouter();
