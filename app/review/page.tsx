"use client";

import React from "react";
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
    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (message: string, files?: File[]) => {
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

        console.log("Message:", trimmedMessage);

        // Process PDF files if uploaded
        if (files?.length) {
            console.log("Files:", files);

            for (const file of files) {
                if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
                    console.log(`Processing PDF: ${file.name}`);

                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                        const result = await processPdfAction(formData);

                        if (result.success) {
                            console.log("✅ PDF processed successfully in chat!");
                            console.log("PDF Data:", result.data);

                            // Add assistant response with PDF info
                            setTimeout(() => {
                                setMessages((prev) => {
                                    const assistantId = `${messageId}-pdf-info`;
                                    if (prev.some((entry) => entry.id === assistantId)) {
                                        return prev;
                                    }

                                    const index = prev.findIndex((entry) => entry.id === messageId);
                                    if (index === -1) {
                                        return prev;
                                    }

                                    const nextMessages = [...prev];
                                    nextMessages.splice(index + 1, 0, {
                                        id: assistantId,
                                        role: "assistant",
                                        content: `I've received your PDF "${result.data?.fileName}" (${result.data?.totalPages} pages, ${Math.round((result.data?.fileSize || 0) / 1024)}KB).`,
                                        avatar: ASSISTANT_AVATAR,
                                    });
                                    return nextMessages;
                                });
                            }, 600);
                        } else {
                            console.error("❌ PDF processing failed:", result.error);

                            // Add error message to chat
                            setTimeout(() => {
                                setMessages((prev) => {
                                    const errorId = `${messageId}-error`;
                                    if (prev.some((entry) => entry.id === errorId)) {
                                        return prev;
                                    }

                                    const index = prev.findIndex((entry) => entry.id === messageId);
                                    if (index === -1) {
                                        return prev;
                                    }

                                    const nextMessages = [...prev];
                                    nextMessages.splice(index + 1, 0, {
                                        id: errorId,
                                        role: "assistant",
                                        content: `❌ ${result.error || "Failed to process PDF"}`,
                                        avatar: ASSISTANT_AVATAR,
                                    });
                                    return nextMessages;
                                });
                            }, 600);
                        }
                    } catch (error) {
                        console.error("❌ Error processing PDF:", error);

                        // Add error message to chat with helpful details
                        setTimeout(() => {
                            setMessages((prev) => {
                                const errorId = `${messageId}-catch-error`;
                                if (prev.some((entry) => entry.id === errorId)) {
                                    return prev;
                                }

                                const index = prev.findIndex((entry) => entry.id === messageId);
                                if (index === -1) {
                                    return prev;
                                }

                                const errorMessage = error instanceof Error
                                    ? error.message
                                    : "Unable to process PDF. Please ensure it's a valid PDF file with max 2 pages.";

                                const nextMessages = [...prev];
                                nextMessages.splice(index + 1, 0, {
                                    id: errorId,
                                    role: "assistant",
                                    content: `❌ ${errorMessage}`,
                                    avatar: ASSISTANT_AVATAR,
                                });
                                return nextMessages;
                            });
                        }, 600);
                    }
                } else {
                    console.log(`Skipping non-PDF file: ${file.name}`);
                }
            }
        }

        // Add a generic assistant response if there's a text message
        if (trimmedMessage) {
            setTimeout(() => {
                setMessages((prev) => {
                    const assistantId = `${messageId}-ai`;
                    if (prev.some((entry) => entry.id === assistantId)) {
                        return prev;
                    }

                    const index = prev.findIndex((entry) => entry.id === messageId);
                    if (index === -1) {
                        return prev;
                    }

                    const nextMessages = [...prev];
                    nextMessages.splice(index + 1, 0, {
                        id: assistantId,
                        role: "assistant",
                        content: `Thanks for sharing: "${trimmedMessage}"`,
                        avatar: ASSISTANT_AVATAR,
                    });
                    return nextMessages;
                });
            }, 600);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center pt-24">
            <div className="flex w-full max-w-2xl flex-1 flex-col px-4 pt-8">
                <div
                    ref={chatContainerRef}
                    className="flex-1 space-y-4 overflow-y-auto pr-2"
                >
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
                                    {message.content}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        );
                    })}
                </div>
                <div className="sticky bottom-3 left-0 right-0 w-full bg-background pt-4">
                    <PromptInputBox onSend={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;