"use client";

import { PromptInputBox } from "@/components/ai-prompt-box";

const ReviewPage = () => {
    const handleSendMessage = (message: string, files?: File[]) => {
        console.log("Message:", message);
        console.log("Files:", files);
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-end pb-8">
            <div className="w-[500px] p-4">
                <PromptInputBox onSend={handleSendMessage} />
            </div>
        </div>
    );
};

export default ReviewPage;