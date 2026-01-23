"use client";

import { Suspense, useState } from "react";
import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from "@/components/ui/resizable";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { PreviewArea } from "../components/preview-area";
import { ErrorBoundary } from "@/components/error-boundary";
import type { Fragment } from "@prisma/client";

interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
    const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(null);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950 h-full overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={40}
                    minSize={25}
                    className="flex flex-col min-h-0 border-r border-slate-200 dark:border-slate-800"
                >
                    <div className="flex-1 overflow-hidden flex flex-col h-full">
                        <Suspense fallback={
                            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0 animate-pulse">
                                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mx-auto sm:mx-0"></div>
                            </div>
                        }>
                            <ErrorBoundary fallback={<div className="h-14 border-b border-red-200 bg-red-50 dark:bg-red-900/10 flex items-center px-4 text-xs text-red-600">Header Error</div>}>
                                <ProjectHeader projectId={projectId} />
                            </ErrorBoundary>
                        </Suspense>

                        <div className="flex-1 min-h-0 overflow-hidden relative">
                            <Suspense fallback={
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            }>
                                <ErrorBoundary fallback={<div className="flex-1 flex items-center justify-center h-full text-sm text-red-500 bg-red-50/30">Failed to load messages</div>}>
                                    <MessagesContainer
                                        projectId={projectId}
                                        activeFragment={selectedFragment}
                                        setActiveFragment={setSelectedFragment}
                                    />
                                </ErrorBoundary>
                            </Suspense>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="w-1 bg-slate-200 dark:border-slate-800 hover:bg-primary/20 transition-colors" />

                <ResizablePanel
                    defaultSize={60}
                    minSize={30}
                    className="bg-white dark:bg-slate-900 overflow-hidden"
                >
                    <ErrorBoundary fallback={
                        <div className="h-full flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-950 p-8 text-center">
                            <div className="text-4xl">🛠️</div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Live Preview Unavailable</h3>
                            <p className="text-sm text-slate-500 max-w-xs">There was an error rendering the preview area. This might be due to an unexpected response from the sandbox.</p>
                        </div>
                    }>
                        <PreviewArea fragment={selectedFragment} />
                    </ErrorBoundary>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
