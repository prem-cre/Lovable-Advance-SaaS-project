"use client";

import { useState, useMemo } from "react";
import { Fragment } from "@prisma/client";
import {
    ExternalLink,
    Code2,
    Eye,
    Search,
    Globe,
    RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TreeView, type TreeItem } from "@/components/tree-view";

interface Props {
    fragment: Fragment | null;
}

export const PreviewArea = ({ fragment }: Props) => {
    const [view, setView] = useState<"preview" | "code">("preview");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const files = useMemo(() => {
        if (!fragment?.files) return {} as Record<string, string>;
        return fragment.files as Record<string, string>;
    }, [fragment?.files]);

    const filePaths = useMemo(() => Object.keys(files), [files]);

    const filteredPaths = useMemo(() => {
        if (!searchQuery) return filePaths;
        return filePaths.filter(path => path.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [filePaths, searchQuery]);

    const treeData = useMemo(() => {
        if (filePaths.length === 0) return [];

        const buildTree = (paths: string[]): TreeItem[] => {
            const root: any = {};

            paths.forEach(path => {
                const parts = path.split('/');
                let current = root;
                parts.forEach((part) => {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                });
            });

            const convert = (node: any): TreeItem[] => {
                return Object.keys(node)
                    .sort((a, b) => {
                        const aIsFile = Object.keys(node[a]).length === 0;
                        const bIsFile = Object.keys(node[b]).length === 0;

                        // Folders first
                        if (!aIsFile && bIsFile) return -1;
                        if (aIsFile && !bIsFile) return 1;

                        return a.localeCompare(b);
                    })
                    .map(key => {
                        const children = convert(node[key]);
                        if (children.length === 0) {
                            return key;
                        }
                        return [key, ...children];
                    });
            };

            return convert(root);
        };

        return buildTree(filteredPaths);
    }, [filteredPaths, filePaths.length]);

    const onRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    // Auto-select first file if none selected
    if (!selectedFile && filePaths.length > 0) {
        setSelectedFile(filePaths[0]);
    }

    if (!fragment) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 bg-white dark:bg-slate-900 glossy-mesh dark:glossy-mesh-dark">
                <div className="text-center glass-premium p-12 rounded-[2rem] shadow-3xl border-white animate-in fade-in zoom-in duration-500">
                    <div className="text-5xl mb-6 drop-shadow-xl animate-bounce duration-[4000ms]">✨</div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Development Area</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">Start chatting to architect your vision.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-white/50 dark:bg-slate-900/50 glossy-mesh dark:glossy-mesh-dark">
            {/* Top Header - Fixed */}
            <header className="h-14 border-b border-white/40 flex items-center justify-between px-4 glass-premium shrink-0 z-10 shadow-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/50 rounded-lg flex-1 max-w-md group focus-within:border-primary transition-all shadow-inner relative overflow-hidden">
                        <Globe className="size-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-600 truncate font-bold flex-1 tracking-tight">
                            {fragment.sandboxUrl}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all rounded-md"
                            onClick={onRefresh}
                            title="Refresh Preview"
                        >
                            <RefreshCcw className="size-3" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-white/20 dark:bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/40 shadow-inner">
                    <Button
                        variant={view === "preview" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("preview")}
                        className={cn(
                            "h-8 px-4 gap-2 rounded-lg transition-all font-black text-[11px] uppercase tracking-widest",
                            view === "preview" ? "bg-white text-slate-900 shadow-md" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        )}
                    >
                        <Eye className="size-3.5" />
                        <span>Preview</span>
                    </Button>
                    <Button
                        variant={view === "code" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setView("code")}
                        className={cn(
                            "h-8 px-4 gap-2 rounded-lg transition-all font-black text-[11px] uppercase tracking-widest",
                            view === "code" ? "bg-white text-slate-900 shadow-md" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        )}
                    >
                        <Code2 className="size-3.5" />
                        <span>Code</span>
                    </Button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-white/20 mx-1" />
                    <Button variant="ghost" size="icon" className="size-8" asChild>
                        <a href={fragment.sandboxUrl} target="_blank" rel="noopener noreferrer" title="Open in New Tab">
                            <ExternalLink className="size-3.5" />
                        </a>
                    </Button>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                {view === "preview" ? (
                    <iframe
                        key={refreshKey}
                        src={fragment.sandboxUrl}
                        className="w-full h-full border-none bg-white"
                        title="Sandbox Preview"
                    />
                ) : (
                    <div className="flex h-full overflow-hidden">
                        {/* File Siderbar - Independent Scroll */}
                        <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-50/30 dark:bg-slate-900/30">
                            <div className="p-2 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
                                    <Search className="size-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none text-[11px] outline-none w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <TreeView
                                    data={treeData}
                                    value={selectedFile}
                                    onSelect={setSelectedFile}
                                />
                            </div>
                        </div>

                        {/* Code Editor Area - Independent Scroll */}
                        <div className="flex-1 min-w-0 bg-white dark:bg-[#0d1117]">
                            {selectedFile ? (
                                <div className="h-full overflow-y-auto custom-scrollbar">
                                    <pre className="p-6 text-[13px] font-mono leading-relaxed text-slate-800 dark:text-slate-300 overflow-visible">
                                        <code>{files[selectedFile]}</code>
                                    </pre>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                                    Select a file to view code
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
