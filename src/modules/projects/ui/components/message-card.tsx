import { MessageRole, Fragment as PrismaFragment, MessageType } from "@prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Code2, ChevronRight } from "lucide-react";

interface FragmentCardProps {
    fragment: PrismaFragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: PrismaFragment) => void;
}

const FragmentCard = ({
    fragment,
    isActiveFragment,
    onFragmentClick,
}: FragmentCardProps) => {
    return (
        <button
            className={cn(
                "flex items-start text-start gap-2 border border-slate-200/50 dark:border-white/10 glass dark:glass-dark w-fit p-3 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group",
                isActiveFragment &&
                "bg-primary text-primary-foreground border-primary hover:bg-primary shadow-primary/20"
            )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2 className="size-4 mt-0.5 text-slate-500 group-hover:text-primary transition-colors" />
            <div className="flex flex-col flex-1">
                <span className="text-sm font-black line-clamp-1 text-slate-900 group-hover:text-slate-950">
                    {fragment.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500">Preview</span>
            </div>
            <div className="flex items-center justify-center mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="size-4 text-slate-400" />
            </div>
        </button>
    );
};

interface AssistantMessageProps {
    content: string;
    fragment: PrismaFragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: PrismaFragment) => void;
    type: MessageType;
}

const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}: AssistantMessageProps) => {
    // Simple regex to remove <task_summary> tags if present
    const cleanContent = content.replace(/<\/?task_summary>/g, "").trim();

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2 group">
                <div className="size-8 rounded-full border bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm mt-1">
                    <Image src="/vibe-logo.png" alt="Vibe" width={20} height={20} />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-x-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Vibe</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest opacity-60">
                            {format(new Date(createdAt), "HH:mm 'on' MMM dd, yyyy")}
                        </span>
                    </div>
                </div>
            </div>
            <div className="pl-[44px] flex flex-col gap-y-4">
                <div className="text-[15px] leading-relaxed text-slate-950 dark:text-slate-900 font-medium whitespace-pre-wrap glass-premium p-5 rounded-2xl shadow-xl border-white/80 ring-1 ring-black/5">
                    {cleanContent}
                </div>
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    );
};

interface UserMessageProps {
    content: string;
    createdAt: Date;
}

const UserMessage = ({ content, createdAt }: UserMessageProps) => {
    return (
        <div className="flex flex-col items-end mb-8">
            <div className="max-w-[80%] rounded-2xl bg-[#007AFF] px-4 py-2 text-[15px] text-white shadow-lg shadow-blue-500/20 font-medium glossy-shimmer">
                {content}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 mr-1">
                {format(new Date(createdAt), "HH:mm")}
            </span>
        </div>
    );
};

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment?: PrismaFragment | null;
    createdAt: Date;
    onFragmentClick: (fragment: PrismaFragment) => void;
    type: MessageType;
    isActiveFragment?: boolean;
}

export const MessageCard = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}: MessageCardProps) => {
    const isUser = role === "USER";

    return (
        <div className="w-full mb-8">
            {isUser ? (
                <UserMessage content={content} createdAt={createdAt} />
            ) : (
                <AssistantMessage
                    content={content}
                    createdAt={createdAt}
                    fragment={fragment ?? null}
                    type={type}
                    isActiveFragment={!!isActiveFragment}
                    onFragmentClick={onFragmentClick}
                />
            )}
        </div>
    );
};
