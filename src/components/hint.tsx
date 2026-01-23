"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
    children: React.ReactNode;
    text: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

export const Hint = ({
    children,
    text,
    side = "top",
    align = "center"
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className="bg-slate-900 text-white border-slate-800 px-3 py-1.5 rounded-lg shadow-xl"
                >
                    <p className="text-[11px] font-bold uppercase tracking-widest">
                        {text}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
