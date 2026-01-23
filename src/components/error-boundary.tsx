"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full">
                            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 italic">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
                            We encountered an unexpected error while rendering this part of the app.
                        </p>
                        <button
                            className="mt-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors shadow-sm"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Try again
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
