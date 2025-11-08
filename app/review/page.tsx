"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PromptInputBox } from "@/components/ai-prompt-box";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { processPdfAction } from "@/lib/actions";

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    avatar?: {
        src?: string;
        fallback: string;
    };
};

const USER_AVATAR = {
    fallback: "US",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop",
};

const ASSISTANT_AVATAR = {
    fallback: "AI",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop",
};

const ReviewPage = () => {
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [resumeContext, setResumeContext] = React.useState<string>("");
    const [isStreaming, setIsStreaming] = React.useState(false);
    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);

    // Load initial analysis from sessionStorage when component mounts
    React.useEffect(() => {
        const storedResumeContent = sessionStorage.getItem('resumeContent');
        const pendingAnalysis = sessionStorage.getItem('pendingAnalysis');

        if (storedResumeContent) {
            setResumeContext(storedResumeContent);
        }

        // If there's a pending analysis (user just uploaded from home page)
        if (pendingAnalysis === 'true') {
            sessionStorage.removeItem('pendingAnalysis');

            // Show user message
            setMessages([{
                id: `initial-upload-${Date.now()}`,
                role: 'user',
                content: '📎 Uploaded resume from home page',
                avatar: USER_AVATAR,
            }]);

            const assistantMessageId = `initial-analysis-${Date.now()}`;

            // Add empty assistant message for streaming
            setMessages(prev => [
                ...prev,
                {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: '',
                    avatar: ASSISTANT_AVATAR,
                },
            ]);

            // Set streaming state
            setIsStreaming(true);

            // Make the AI API call with streaming
            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `I've uploaded my resume. Please analyze it and provide detailed feedback on:\n1. Overall structure and formatting\n2. Content quality and impact\n3. ATS optimization\n4. Key strengths and areas for improvement\n5. Actionable suggestions for enhancement\n\nHere's my resume content:\n\n${storedResumeContent}`,
                    resumeContext: storedResumeContent,
                }),
            })
                .then(async response => {
                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();
                    let accumulatedContent = '';

                    if (!reader) {
                        throw new Error('No reader available');
                    }

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    if (parsed.content) {
                                        accumulatedContent += parsed.content;
                                        setMessages(prev =>
                                            prev.map(msg =>
                                                msg.id === assistantMessageId
                                                    ? { ...msg, content: accumulatedContent }
                                                    : msg
                                            )
                                        );
                                    }
                                } catch {
                                    // Skip invalid JSON
                                }
                            }
                        }
                    }
                    setIsStreaming(false);
                })
                .catch(error => {
                    console.error('Error analyzing resume:', error);
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: '❌ Failed to analyze resume. Please try asking me a question!' }
                                : msg
                        )
                    );
                    setIsStreaming(false);
                });
        }
    }, []);

    React.useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (message: string, files?: File[], selectedModel?: string) => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage && (!files || files.length === 0)) {
            return;
        }

        const messageId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        // Add user message to chat
        setMessages((prev) => [
            ...prev,
            {
                id: messageId,
                role: "user",
                content: trimmedMessage || "📎 Uploaded file(s)",
                avatar: USER_AVATAR,
            },
        ]);

        // Process PDF files if uploaded
        if (files?.length) {
            for (const file of files) {
                if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const result = await processPdfAction(formData);

                        if (result.success && result.data?.content) {
                            // Store resume context
                            setResumeContext(result.data.content);

                            const assistantMessageId = `${messageId}-ai`;

                            // Add empty assistant message for streaming
                            setMessages((prev) => [
                                ...prev,
                                {
                                    id: assistantMessageId,
                                    role: "assistant",
                                    content: '',
                                    avatar: ASSISTANT_AVATAR,
                                },
                            ]);

                            // Set streaming state
                            setIsStreaming(true);

                            // Send to AI with resume context (streaming)
                            const aiResponse = await fetch('/api/chat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    message: `I've uploaded my resume. Here's the content:\n\n${result.data.content}\n\n${trimmedMessage || "Please analyze my resume."}`,
                                    model: selectedModel,
                                    resumeContext: result.data.content,
                                    conversationHistory: messages.map(m => ({
                                        role: m.role,
                                        content: m.content
                                    })),
                                }),
                            });

                            const reader = aiResponse.body?.getReader();
                            const decoder = new TextDecoder();
                            let accumulatedContent = '';

                            if (!reader) {
                                throw new Error('No reader available');
                            }

                            while (true) {
                                const { done, value } = await reader.read();
                                if (done) break;

                                const chunk = decoder.decode(value);
                                const lines = chunk.split('\n');

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        const data = line.slice(6);
                                        if (data === '[DONE]') continue;

                                        try {
                                            const parsed = JSON.parse(data);
                                            if (parsed.content) {
                                                accumulatedContent += parsed.content;
                                                setMessages((prev) =>
                                                    prev.map(msg =>
                                                        msg.id === assistantMessageId
                                                            ? { ...msg, content: accumulatedContent }
                                                            : msg
                                                    )
                                                );
                                            }
                                        } catch {
                                            // Skip invalid JSON
                                        }
                                    }
                                }
                            }
                            setIsStreaming(false);
                        } else {
                            setMessages((prev) => [
                                ...prev,
                                {
                                    id: `${messageId}-error`,
                                    role: "assistant",
                                    content: `❌ ${result.error || "Failed to process PDF"}`,
                                    avatar: ASSISTANT_AVATAR,
                                },
                            ]);
                        }
                    } catch (error) {
                        console.error("Error processing PDF:", error);
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: `${messageId}-error`,
                                role: "assistant",
                                content: `❌ ${error instanceof Error ? error.message : "Failed to process PDF"}`,
                                avatar: ASSISTANT_AVATAR,
                            },
                        ]);
                        setIsStreaming(false);
                    }
                }
            }
        }

        // Handle text-only messages
        if (trimmedMessage && !files?.length) {
            const assistantMessageId = `${messageId}-ai`;

            // Add empty assistant message for streaming
            setMessages((prev) => [
                ...prev,
                {
                    id: assistantMessageId,
                    role: "assistant",
                    content: '',
                    avatar: ASSISTANT_AVATAR,
                },
            ]);

            // Set streaming state
            setIsStreaming(true);

            try {
                const aiResponse = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: trimmedMessage,
                        model: selectedModel,
                        resumeContext: resumeContext, // Include resume context if available
                        conversationHistory: messages.map(m => ({
                            role: m.role,
                            content: m.content
                        })),
                    }),
                });

                const reader = aiResponse.body?.getReader();
                const decoder = new TextDecoder();
                let accumulatedContent = '';

                if (!reader) {
                    throw new Error('No reader available');
                }

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.content) {
                                    accumulatedContent += parsed.content;
                                    setMessages((prev) =>
                                        prev.map(msg =>
                                            msg.id === assistantMessageId
                                                ? { ...msg, content: accumulatedContent }
                                                : msg
                                        )
                                    );
                                }
                            } catch {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
                setIsStreaming(false);
            } catch (error) {
                console.error("Error getting AI response:", error);
                setMessages((prev) =>
                    prev.map(msg =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: `❌ ${error instanceof Error ? error.message : "Failed to get response"}` }
                            : msg
                    )
                );
                setIsStreaming(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center pt-24">
            <div className="flex w-full max-w-2xl flex-1 flex-col px-4 pt-8">
                <div
                    ref={chatContainerRef}
                    className="flex-1 space-y-4 overflow-y-auto pr-2"
                >
                    {messages.length === 0 && (
                        <div className="flex h-full items-center justify-center text-center">
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">Welcome to Resume Review</h2>
                                <p className="text-muted-foreground">
                                    Upload your resume to get started, or ask me anything about your job search!
                                </p>
                            </div>
                        </div>
                    )}
                    {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                            <ChatBubble
                                key={message.id}
                                variant={isUser ? "sent" : "received"}
                            >
                                <ChatBubbleAvatar
                                    fallback={message.avatar?.fallback ?? (isUser ? "US" : "AI")}
                                    src={message.avatar?.src}
                                />
                                <ChatBubbleMessage
                                    variant={isUser ? "sent" : "received"}
                                >
                                    {isUser ? (
                                        <div className="whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                                                    h4: ({ children }) => <h4 className="text-sm font-bold mb-1 mt-2">{children}</h4>,
                                                    code: ({ className, children, ...props }) => {
                                                        const isInline = !className;
                                                        return isInline ? (
                                                            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <code className={`block bg-muted p-2 rounded text-sm font-mono overflow-x-auto ${className}`} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                    pre: ({ children }) => <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-2">{children}</pre>,
                                                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic my-2">{children}</blockquote>,
                                                    hr: () => <hr className="my-4 border-border" />,
                                                    // Table components
                                                    table: ({ children }) => (
                                                        <div className="overflow-x-auto my-4">
                                                            <table className="min-w-full divide-y divide-border border border-border rounded-lg">
                                                                {children}
                                                            </table>
                                                        </div>
                                                    ),
                                                    thead: ({ children }) => (
                                                        <thead className="bg-muted">
                                                            {children}
                                                        </thead>
                                                    ),
                                                    tbody: ({ children }) => (
                                                        <tbody className="divide-y divide-border bg-background">
                                                            {children}
                                                        </tbody>
                                                    ),
                                                    tr: ({ children }) => (
                                                        <tr className="hover:bg-muted/50 transition-colors">
                                                            {children}
                                                        </tr>
                                                    ),
                                                    th: ({ children }) => (
                                                        <th className="px-4 py-3 text-left text-sm font-semibold">
                                                            {children}
                                                        </th>
                                                    ),
                                                    td: ({ children }) => (
                                                        <td className="px-4 py-3 text-sm">
                                                            {children}
                                                        </td>
                                                    ),
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        );
                    })}
                </div>
                <div className="sticky bottom-3 left-0 right-0 w-full bg-background pt-4">
                    <PromptInputBox onSend={handleSendMessage} isLoading={isStreaming} />
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;