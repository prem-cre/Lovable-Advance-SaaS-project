"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessages = () => {
    const messages = [
        "Thinking about your request...",
        "Gathering context and resources...",
        "Generating code fragments...",
        "Optimizing the response...",
        "Polishing the final output...",
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className="size-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="size-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="size-1.5 rounded-full bg-blue-500 animate-bounce" />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-1 duration-500">
                {messages[currentMessageIndex]}
            </span>
        </div>
    );
};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col gap-y-3 py-6 px-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-x-2.5">
                <div className="size-8 flex items-center justify-center shrink-0">
                    <Image
                        src="/vibe-logo.png"
                        alt="Vibe"
                        width={28}
                        height={28}
                    />
                </div>
                <span className="text-sm font-semibold text-[#B94B2E]">Vibe</span>
            </div>
            <div className="pl-9">
                <ShimmerMessages />
            </div>
        </div>
    );
};
