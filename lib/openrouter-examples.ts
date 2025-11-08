/**
 * OpenRouter Quick Reference
 *
 * This file shows quick examples for common use cases.
 */

// ============================================================================
// BASIC USAGE
// ============================================================================

import { createChatCompletion, MODELS } from "@/lib/openrouter";

// Simple chat
const response = await createChatCompletion(MODELS.DEEPSEEK_V3_1, [
    { role: "user", content: "Hello!" },
]);

// ============================================================================
// DIFFERENT MODELS
// ============================================================================

// GPT OSS 20B
await createChatCompletion(MODELS.GPT_OSS_20B, [
    { role: "user", content: "Hello" },
]);

// DeepSeek v3.1 (best for reasoning)
await createChatCompletion(MODELS.DEEPSEEK_V3_1, [
    { role: "user", content: "Hello" },
]);

// GLM 4.5 Air (fast and efficient)
await createChatCompletion(MODELS.GLM_4_5_AIR, [
    { role: "user", content: "Hello" },
]);

// Kimi K2 (great for long context)
await createChatCompletion(MODELS.KIMI_K2_0711, [
    { role: "user", content: "Hello" },
]);

// ============================================================================
// API ROUTES
// ============================================================================

// Basic chat: POST /api/chat
fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        message: "Hello",
        model: "deepseek/deepseek-chat-v3.1",
    }),
});

// Image analysis: POST /api/analyze-image
fetch("/api/analyze-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        imageUrl: "https://example.com/image.jpg",
        prompt: "What is this?",
        model: "zhipuai/glm-4.5-air",
    }),
});

// AI Review: POST /api/ai-review
fetch("/api/ai-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        action: "review", // or 'optimize', 'compare', 'summarize', 'extract-skills'
        resumeText: "...",
        jobDescription: "...", // optional, depends on action
    }),
});

// ============================================================================
// JOB APPLICATION HELPERS
// ============================================================================

import {
    reviewResume,
    optimizeForATS,
    compareWithJob,
    summarizeJobDescription,
    extractSkills,
    generateCoverLetter,
    prepareInterviewAnswers,
    analyzeResumeImage,
} from "@/lib/ai-helpers";

// Review resume
await reviewResume("My resume text here...");

// Optimize for ATS
await optimizeForATS("Resume text...", "Job description...");

// Compare with job
await compareWithJob("Resume text...", "Job description...");

// Summarize job
await summarizeJobDescription("Job description...");

// Extract skills
await extractSkills("Job description...");

// Generate cover letter
await generateCoverLetter(
    "Job description...",
    "Resume summary...",
    "Company Name"
);

// Prepare interview answers
await prepareInterviewAnswers("Job description...", "My background...");

// Analyze resume image
await analyzeResumeImage("https://example.com/resume.jpg");

// ============================================================================
// TESTING
// ============================================================================

// Test the setup
// npx tsx scripts/test-openrouter.ts
