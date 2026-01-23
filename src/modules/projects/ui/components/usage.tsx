"use client";

import React from "react";

import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface UsageProps {
    points?: number;
    remainingPoints?: number;
    consumedPoints?: number;
    msBeforeNext?: number;
}

export const Usage = ({ points: propsPoints, remainingPoints: propsRemainingPoints, consumedPoints: propsConsumedPoints }: UsageProps) => {
    const { has } = useAuth();
    const hasProAccess = has?.({ plan: "pro" });
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || propsPoints === undefined || propsRemainingPoints === undefined) {
        return null;
    }

    // Calculate time until reset (30 days from now for demo purposes)
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + 30);

    const duration = intervalToDuration({
        start: new Date(),
        end: resetDate,
    });

    const formattedDuration = formatDuration(duration, {
        format: ["months", "days", "hours"],
    });

    return (
        <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
            <div className="flex items-center gap-x-2 justify-between">
                <div>
                    <p className="text-sm">
                        {propsRemainingPoints} / {propsPoints} {hasProAccess ? "paid" : "free"} credits remaining
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Resets in {formattedDuration}
                    </p>
                </div>
                {!hasProAccess && (
                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                    >
                        <Link href="/home/pricing">
                            <CrownIcon className="w-4 h-4 mr-2" /> Upgrade
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
};
