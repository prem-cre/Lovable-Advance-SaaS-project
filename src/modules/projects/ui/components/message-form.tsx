"use client";

import React, { useState, useEffect } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTRPCOptions } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUpIcon, Loader2Icon, SquareIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Usage } from "./usage";

const formSchema = z.object({
    value: z.string()
        .min(1, { message: "Value is required" })
        .max(10000, { message: "Value is too long" }),
})

interface Props {
    projectId: string;
    isGenerating?: boolean;
    onCancel?: () => void;
}

export const MessageForm = ({ projectId, isGenerating, onCancel }: Props) => {
    const trpc = useTRPCOptions();
    const queryClient = useQueryClient();
    const { data: usage } = useQuery(trpc.usage.status.queryOptions());

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
        mode: "onChange",
    });

    const createMessage = useMutation(
        trpc.messages.create.mutationOptions({
            onSuccess: () => {
                form.reset();
                queryClient.invalidateQueries({
                    queryKey: trpc.messages.getMany.queryOptions({ projectId }).queryKey
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.usage.status.queryOptions().queryKey
                });
            },
            onError: (error) => {
                // Check if it's an out of credits error
                if (error.message?.includes("out of credits") || error.message?.includes("Insufficient credits")) {
                    toast.error("You've run out of credits!", {
                        description: "Upgrade to Pro to get 100 more credits per month",
                        action: {
                            label: "Upgrade Now",
                            onClick: () => window.location.href = "/home/pricing"
                        },
                        duration: 10000,
                    });
                } else {
                    toast.error("Failed to send message", {
                        description: error.message || "Please try again"
                    });
                }
                console.error(error);
            },
        })
    );

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId,
        });
    };

    const [isFocused, setIsFocused] = useState(false);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isPending = createMessage.isPending;
    const isDisabled = (isPending || !form.formState.isValid) && !isGenerating;
    const isCancelable = isGenerating;
    const showUsage = mounted && !!usage;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
        }
    };

    return (
        <div className="p-4 pb-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-3xl mx-auto">
                {showUsage && (
                    <Usage
                        points={usage.points}
                        remainingPoints={usage.remainingPoints}
                    />
                )}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn(
                            "relative group border rounded-xl bg-[#F8F9FA] dark:bg-slate-900 transition-all duration-200",
                            showUsage && "rounded-t-none border-t-0",
                            isFocused && "shadow-lg border-primary/50 ring-2 ring-primary/5 shadow-primary/5"
                        )}
                    >
                        <div className="absolute left-4 top-3 overflow-hidden rounded-full border bg-background flex items-center justify-center size-8 shadow-sm group-focus-within:border-primary transition-colors z-10">
                            <span className="text-[10px] font-bold text-gray-400">V</span>
                        </div>

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <div className="ripple-effect w-full relative">
                                            <TextareaAutosize
                                                {...field}
                                                onKeyDown={handleKeyDown}
                                                onFocus={(e) => {
                                                    setIsFocused(true);
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = 50; // Center ripple for focus
                                                    const y = 50;
                                                    setRipples([...ripples, { id: Date.now(), x, y }]);
                                                }}
                                                onBlur={() => setIsFocused(false)}
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                                                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                                                    setRipples([...ripples, { id: Date.now(), x, y }]);
                                                }}
                                                placeholder="Tell me to build something..."
                                                className="w-full min-h-[48px] max-h-[200px] pl-14 pr-14 py-3 bg-transparent border-none focus-visible:ring-0 focus:outline-none text-[15px] resize-none leading-relaxed relative z-10"
                                                disabled={isPending || isGenerating}
                                            />
                                            {ripples.map((ripple) => (
                                                <span
                                                    key={ripple.id}
                                                    className="ripple-element"
                                                    style={{
                                                        left: `${ripple.x}%`,
                                                        top: `${ripple.y}%`,
                                                        width: '100px',
                                                        height: '100px',
                                                        marginLeft: '-50px',
                                                        marginTop: '-50px',
                                                    }}
                                                    onAnimationEnd={() => {
                                                        setRipples(ripples.filter(r => r.id !== ripple.id));
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type={isCancelable ? "button" : "submit"}
                            size="icon"
                            onClick={isCancelable ? onCancel : undefined}
                            className={cn(
                                "absolute right-2 top-2 h-8 w-8 rounded-xl transition-all z-10",
                                isCancelable
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : isDisabled
                                        ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                        : "bg-primary text-primary-foreground shadow-sm"
                            )}
                            disabled={!isCancelable && isDisabled}
                        >
                            {isPending ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : isCancelable ? (
                                <SquareIcon className="h-3 w-3 fill-current" />
                            ) : (
                                <ArrowUpIcon className="h-4 w-4" />
                            )}
                        </Button>

                        {showUsage && (
                            <div className="absolute -bottom-6 right-2 text-[10px] text-muted-foreground">
                                {form.watch("value").length} / 10000
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};
