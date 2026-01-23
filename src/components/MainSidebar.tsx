"use client"

import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    Plus,
    History,
    Search,
    Home,
    User
} from "lucide-react"

import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useTRPCOptions } from "@/trpc/client"

import type { Project } from "@prisma/client"

export function MainSidebar() {
    const trpc = useTRPCOptions()
    const router = useRouter()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    const { data: projects = [] } = useQuery(
        trpc.projects.getMany.queryOptions()
    )

    const projectList = projects as Project[]

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out">
            <SidebarHeader className={cn(
                "h-14 flex items-center transition-all duration-300 px-4",
                isCollapsed ? "justify-center px-0" : "flex-row justify-between px-4"
            )}>
                <div className={cn(
                    "flex items-center gap-2 transition-all duration-300 overflow-hidden",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                    <div className="size-8 flex items-center justify-center shrink-0">
                        <Image src="/vibe-logo.png" alt="Vibe" width={32} height={32} />
                    </div>
                    <span className="font-black text-2xl text-[#B94B2E] whitespace-nowrap tracking-tighter drop-shadow-sm">
                        Vibe
                    </span>
                </div>

                <div className={cn(
                    "flex items-center justify-center transition-all duration-300",
                    isCollapsed ? "w-full" : ""
                )}>
                    {isCollapsed ? (
                        <div className="flex flex-col items-center gap-4 py-2">
                            <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" />
                            <div className="size-8 flex items-center justify-center shrink-0 animate-in fade-in zoom-in duration-300">
                                <Image src="/vibe-logo.png" alt="Vibe" width={24} height={24} />
                            </div>
                        </div>
                    ) : (
                        <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0" />
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-xl border border-transparent hover:border-white/20 dark:hover:border-white/10 glass-hover">
                                <Link href="/" prefetch={true}>
                                    <div className="size-8 rounded-lg bg-[#B94B2E] flex items-center justify-center shrink-0 shadow-lg shadow-[#B94B2E]/20">
                                        <Plus className="size-5 text-white" />
                                    </div>
                                    <span className={cn(
                                        "transition-all duration-300 truncate font-semibold text-slate-900 dark:text-white",
                                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                                    )}>New Project</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className={cn(
                        "transition-all duration-300 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                        isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-auto"
                    )}>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg animate-neon-pulse"
                                >
                                    <Link href="/home" prefetch={true}>
                                        <Home className="size-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white magnetic-icon" />
                                        <span className={cn(
                                            "transition-all duration-300 truncate font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white",
                                            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                                        )}>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg animate-neon-pulse">
                                    <MessageSquare className="size-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white magnetic-icon" />
                                    <span className={cn(
                                        "transition-all duration-300 truncate font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white",
                                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                                    )}>Chat</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg animate-neon-pulse">
                                    <LayoutDashboard className="size-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white magnetic-icon" />
                                    <span className={cn(
                                        "transition-all duration-300 truncate font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white",
                                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                                    )}>Projects</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg animate-neon-pulse">
                                    <History className="size-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white magnetic-icon" />
                                    <span className={cn(
                                        "transition-all duration-300 truncate font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white",
                                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                                    )}>Recent</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className={cn(
                        "transition-all duration-300 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                        isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-auto"
                    )}>History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectList.map((project) => (
                                <SidebarMenuItem key={project.id}>
                                    <SidebarMenuButton
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                        className="text-xs group hover:bg-white/10 dark:hover:bg-white/5 transition-all rounded-lg py-5 px-3"
                                    >
                                        <div className="size-1.5 rounded-full bg-[#B94B2E] shrink-0 shadow-lg shadow-[#B94B2E]/50 group-hover:scale-125 transition-transform" />
                                        <span className={cn(
                                            "transition-all duration-300 truncate font-medium",
                                            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                        )}>{project.name || "Untitled Project"}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 sidebar-dynamic-footer">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:bg-white/10 dark:hover:bg-white/10 transition-all rounded-lg animate-neon-pulse">
                            <Settings className="size-4 shrink-0 text-slate-500 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white magnetic-icon" />
                            <span className={cn(
                                "transition-all duration-300 truncate font-medium text-slate-700 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white",
                                isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                            )}>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mt-2">
                        <div className={cn(
                            "flex items-center gap-3 px-3 py-2.5 glass-premium rounded-xl shadow-lg border-white/60 relative overflow-hidden group cursor-pointer glossy-shimmer",
                            isCollapsed ? "justify-center px-2" : ""
                        )}>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "size-9 ring-2 ring-white/20 hover:ring-white/40 transition-all shadow-md",
                                        userButtonPopoverCard: "shadow-2xl",
                                    }
                                }}
                                afterSignOutUrl="/home"
                            />
                            <div className={cn(
                                "flex flex-col transition-all duration-300 truncate",
                                isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                            )}>
                                <span className="text-sm font-black text-slate-900 tracking-tight">User Account</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70">Click to manage</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
