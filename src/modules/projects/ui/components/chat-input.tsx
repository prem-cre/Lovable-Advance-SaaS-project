"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPCOptions } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SendHorizontal } from "lucide-react";

interface Props {
    projectId: string;
}

export const ChatInput = ({ projectId }: Props) => {
    const [value, setValue] = useState("");
    const trpc = useTRPCOptions();
    const queryClient = useQueryClient();

    const createMessage = useMutation(
        trpc.messages.create.mutationOptions({
            onSuccess: () => {
                setValue("");
                // Invalidate messages to trigger a refetch in MessagesContainer
                queryClient.invalidateQueries({
                    queryKey: trpc.messages.getMany.queryOptions({ projectId }).queryKey
                });
            },
            onError: (error) => {
                toast.error("Failed to send message");
                console.error(error);
            },
        })
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        createMessage.mutate({
            value: value.trim(),
            projectId,
        });
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ask me to build something..."
                    className="flex-1 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    disabled={createMessage.isPending}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    disabled={createMessage.isPending || !value.trim()}
                >
                    <SendHorizontal className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
};
