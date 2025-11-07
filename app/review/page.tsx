"use client";

import React from "react";
import { PromptInputBox } from "@/components/ai-prompt-box";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat-bubble";

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

    const handleSendMessage = (message: string, files?: File[]) => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            return;
        }

        const messageId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setMessages((prev) => [
            ...prev,
            {
                id: messageId,
                role: "user",
                content: trimmedMessage,
                avatar: USER_AVATAR,
            },
        ]);

        console.log("Message:", trimmedMessage);
        if (files?.length) {
            console.log("Files:", files);
        }

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