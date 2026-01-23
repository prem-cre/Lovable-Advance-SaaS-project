"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    ChevronDown,
    ChevronLeft,
    Sun,
    Moon,
    Monitor,
    LayoutDashboard,
    LogOut,
    Check,
    Crown
} from "lucide-react";
import { useTRPCOptions } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";


interface Props {
    projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
    const trpc = useTRPCOptions();
    const { theme, setTheme } = useTheme();
    const { has } = useAuth();
    // explicit boolean conversion to avoid any undefined issues and force HMR
    const hasProAccess = !!(has && has({ plan: "pro" }));

    const { data: project } = useSuspenseQuery(
        trpc.projects.getOne.queryOptions({ id: projectId })
    );

    return (
        <header className="h-14 border-b border-white/40 flex items-center justify-between px-4 glass-premium shrink-0 z-50 shadow-xl">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="size-8 text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-950 hover:bg-white/10 transition-all rounded-lg">
                    <Link href="/">
                        <ChevronLeft className="size-4" />
                    </Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 px-2 flex items-center gap-2 hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg group">
                            <div className="size-6 flex items-center justify-center shrink-0">
                                <Image src="/vibe-logo.png" alt="Vibe" width={24} height={24} />
                            </div>
                            <span className="font-black text-slate-900 dark:text-slate-950 max-w-[150px] truncate tracking-tight text-shadow-premium">
                                {project?.name || "Untitled Project"}
                            </span>
                            <ChevronDown className="size-3 text-slate-500 group-hover:text-slate-900" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                                <LayoutDashboard className="size-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <Sun className="size-4 dark:hidden" />
                                <Moon className="size-4 hidden dark:block" />
                                <span>Appearance</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                        <DropdownMenuRadioItem value="light" className="flex items-center gap-2">
                                            <Sun className="size-4" />
                                            <span>Light</span>
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark" className="flex items-center gap-2">
                                            <Moon className="size-4" />
                                            <span>Dark</span>
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system" className="flex items-center gap-2">
                                            <Monitor className="size-4" />
                                            <span>System</span>
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500 flex items-center gap-2">
                            <LogOut className="size-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
                {!hasProAccess && (
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all rounded-lg"
                    >
                        <Link href="/home/pricing">
                            <Crown className="size-4" />
                            <span>Upgrade</span>
                        </Link>
                    </Button>
                )}
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-950 hover:bg-white/10 transition-all rounded-lg">
                    <Check className="size-3" />
                    <span>Saved</span>
                </Button>
                <div className="size-8 rounded-full bg-[#B94B2E]/5 flex items-center justify-center border border-[#B94B2E]/10 overflow-hidden shrink-0 shadow-lg shadow-[#B94B2E]/5">
                    <Image src="/vibe-logo.png" alt="Profile" width={20} height={20} />
                </div>
            </div>
        </header>
    );
};
