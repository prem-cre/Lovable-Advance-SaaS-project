"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTRPCOptions } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";
import { Usage } from "./usage";
import type { Fragment } from "@prisma/client";

interface Props {
    projectId: string;
    activeFragment?: Fragment | null;
    setActiveFragment?: (fragment: Fragment | null) => void;
};

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    const trpc = useTRPCOptions();
    const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions(
            {
                projectId: projectId,
            },
            {
                refetchInterval: (query) => {
                    const lastMsg = query.state.data?.[query.state.data.length - 1];
                    return lastMsg?.role === "USER" ? 1000 : false;
                }
            }
        )
    );

    const bottomRef = useRef<HTMLDivElement>(null);
    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === "USER";

    useEffect(() => {
        const lastAssistantMessage = messages.findLast(
            (message) => message.role === "ASSISTANT"
        );

        if (lastAssistantMessage && lastAssistantMessage.fragment) {
            setActiveFragment?.(lastAssistantMessage.fragment as Fragment);
        }
    }, [messages, setActiveFragment]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, isLastMessageUser]);

    return (
        <div className="flex flex-col h-full flex-1 min-h-0 bg-slate-50/10 dark:bg-slate-950/50 glossy-mesh dark:glossy-mesh-dark overflow-hidden relative">
            <div
                className="flex-1 min-h-0 overflow-y-auto px-4 scroll-smooth"
            >
                <div className="max-w-3xl mx-auto w-full pt-6 pb-10">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message.id}
                                content={message.content}
                                role={message.role}
                                fragment={message.fragment}
                                createdAt={message.createdAt}
                                type={message.type}
                                isActiveFragment={activeFragment?.id === message.fragment?.id}
                                onFragmentClick={(fragment) => setActiveFragment?.(fragment)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 py-20">
                            <p className="text-sm font-medium">No messages in this project yet.</p>
                            <p className="text-xs">Send a message to start building!</p>
                        </div>
                    )}
                    {isLastMessageUser && <MessageLoading />}
                    <div ref={bottomRef} className="h-4" />
                </div>
            </div>

            <div className="shrink-0 relative z-20">
                <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-white/90 dark:from-slate-950/90 to-transparent pointer-events-none" />
                <Usage />
                <MessageForm
                    projectId={projectId}
                    isGenerating={isLastMessageUser}
                    onCancel={() => {
                        toast.info("Generation cancellation coming soon!", {
                            description: "The AI agent is currently working in the background."
                        });
                    }}
                />
            </div>
        </div>
    );
};
