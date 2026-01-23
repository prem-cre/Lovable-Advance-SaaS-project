"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTRPCOptions } from "@/trpc/client";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { PROJECT_TEMPLATES } from "../../constants";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
    value: z.string().min(1, "Project description is required"),
});

export const ProjectForm = () => {
    const router = useRouter();
    const trpc = useTRPCOptions();
    const { userId } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    // Restore prompt from local storage if available
    useEffect(() => {
        const savedPrompt = localStorage.getItem("waiting_project_prompt");
        if (savedPrompt && userId) {
            form.setValue("value", savedPrompt);
            localStorage.removeItem("waiting_project_prompt");
            toast.success("Welcome back! We've restored your prompt.");
        }
    }, [userId, form]);

    const createProject = useMutation(
        trpc.projects.create.mutationOptions({
            onSuccess: (data) => {
                toast.success("Project created! Let's build something amazing.");
                form.reset();
                router.push(`/projects/${data?.id}`);
            },
            onError: (error: any) => {
                // If the error implies not logged in, we might want to suggest signing in?
                // But generally, the onSubmit check handles the preemptive case.
                toast.error("Failed to create project. Please try again.");
                console.error(error);
            },
        })
    );

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!userId) {
            // Save prompt to local storage
            localStorage.setItem("waiting_project_prompt", values.value);
            toast.error("Please sign in to build your project");
            router.push("/sign-in");
            return;
        }
        await createProject.mutateAsync({ value: values.value });
    };

    // ... rest of the component

    const onSelect = (prompt: string) => {
        form.setValue("value", prompt, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const isPending = createProject.isPending;

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative group max-w-2xl mx-auto">
                {/* 3D Glossy Container */}
                <div className="relative p-2 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-[28px] shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 ring-4 ring-white/5 active:ring-orange-500/20 transition-all duration-300">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            {...form.register("value")}
                            placeholder="Build a glossy landing page..."
                            className="w-full h-16 pl-6 pr-4 bg-transparent text-xl font-medium text-white placeholder:text-gray-500 outline-none"
                            disabled={isPending}
                            autoComplete="off"
                        />
                    </div>
                    {/* Floating Action Button */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button
                            type="submit"
                            disabled={isPending || !form.watch("value").trim()}
                            className="vibrant-orange text-white size-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {isPending ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="size-6" />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Templates Grid */}
            <div className="flex flex-wrap justify-center gap-3 hidden md:flex max-w-4xl mx-auto">
                {PROJECT_TEMPLATES.map((template, index) => (
                    <button
                        key={template.title}
                        onClick={() => onSelect(template.prompt)}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="staggered-card inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all duration-200"
                    >
                        <span>{template.emoji}</span>
                        <span>{template.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
