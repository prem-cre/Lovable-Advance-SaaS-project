"use client";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Code2, Zap, ArrowRight, Github, Twitter, MessageSquare, Rocket } from "lucide-react";
import { FeaturesSection } from "@/modules/home/ui/components/features-section";
import { Footer } from "@/modules/home/ui/components/footer";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Page = () => {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            icon: MessageSquare,
            title: "Chat to Build",
            description: "Describe what you want to build in plain English, and watch AI generate production-ready code instantly.",
        },
        {
            icon: Code2,
            title: "Live Preview",
            description: "See your app come to life in real-time with instant previews, live code editing, and hot module reloading.",
        },
        {
            icon: Zap,
            title: "Ship Fast",
            description: "From concept to deployment in minutes. Export clean code, access full source control, and deploy anywhere.",
        }
    ];

    return (
        <div className="flex-1 flex flex-col relative">
            {/* Dark Glass Header */}
            <header className="sticky top-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-border/40">
                <div className="relative max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center gap-3 group">
                            <div className="relative size-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg transition-all duration-300 border border-white/20">
                                <Image
                                    src="/vibe-logo.png"
                                    alt="Vibe"
                                    width={28}
                                    height={28}
                                    className="drop-shadow-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-black text-foreground tracking-tight">
                                    Vibe
                                </h1>
                                <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 tracking-widest uppercase opacity-90">AI Development</p>
                            </div>
                        </div>

                        {/* Navigation - Glassy Pills */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="#features"
                                className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full border border-transparent"
                            >
                                Features
                            </Link>
                            <Link
                                href="/home/pricing"
                                className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full border border-transparent"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/docs"
                                className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full border border-transparent"
                            >
                                Docs
                            </Link>

                            {mounted && (
                                <>
                                    <SignedOut>
                                        <div className="w-px h-4 bg-border/40 mx-2" />
                                        <Link href="/sign-in" className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full border border-transparent">
                                            Sign In
                                        </Link>
                                        <Link href="/sign-up" className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full border border-transparent">
                                            Sign Up
                                        </Link>
                                    </SignedOut>

                                    <ModeToggle />

                                    <SignedOut>
                                        <button className="ml-4 px-6 py-2.5 vibrant-orange text-white text-sm font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                            Start Building
                                            <ArrowRight className="size-4" />
                                        </button>
                                    </SignedOut>

                                    <SignedIn>
                                        <div className="ml-4">
                                            <UserButton
                                                afterSignOutUrl="/"
                                                appearance={{
                                                    elements: {
                                                        userButtonAvatarBox: "size-10 ring-2 ring-white/20 hover:ring-white/40 transition-all"
                                                    }
                                                }}
                                            />
                                        </div>
                                    </SignedIn>
                                </>
                            )}

                            {!mounted && <ModeToggle />}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative max-w-7xl mx-auto px-6 py-24">

                    {/* Hero Section */}
                    <section className="text-center relative z-10 mb-24">
                        {/* Dynamic Glossy Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/50 border border-border/50 rounded-full mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700 backdrop-blur-md animate-badge-flicker relative overflow-hidden group">
                            <div className="premium-spark" style={{ '--spark-x': '15px', '--spark-y': '-20px', left: '20%', top: '50%' } as any} />
                            <div className="premium-spark" style={{ '--spark-x': '-10px', '--spark-y': '-15px', left: '70%', top: '40%', animationDelay: '0.5s' } as any} />
                            <div className="premium-spark" style={{ '--spark-x': '5px', '--spark-y': '-25px', left: '40%', top: '60%', animationDelay: '1.2s' } as any} />

                            <Rocket className="size-4 text-orange-600 dark:text-orange-500 animate-pulse" />
                            <span className="text-sm font-bold text-foreground">
                                Vibe AI 2.0.0 Alpha
                            </span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter mb-8 leading-[0.9]">
                            Build faster with
                            <br />
                            <div className="inline-block liquid-chrome-container pb-4">
                                <span className="text-silver-gradient relative z-10">
                                    Vibe
                                    <span className="absolute -inset-4 bg-white/10 blur-3xl -z-10" />
                                </span>
                                <div className="liquid-chrome-sweep" />
                            </div>
                        </h2>

                        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                            Experience the future of development with our premium AI-powered platform.
                            Stunning gloss, unmatched speed.
                        </p>

                        {/* Premium Input Form and Templates */}
                        <ProjectForm />
                    </section>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    onMouseEnter={() => setHoveredFeature(index)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                    className="group"
                                >
                                    <div className="h-full glossy-silver p-8 rounded-[32px] hover:-translate-y-2 transition-transform duration-300 relative">
                                        {/* Reflection Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none rounded-[32px]" />

                                        <div className="size-16 rounded-2xl vibrant-orange flex items-center justify-center mb-6 shadow-[0_10px_20px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                            <Icon className="size-8 text-white drop-shadow-md" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed font-medium relative z-10">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* New Expanded Features Section */}
                    <FeaturesSection />

                    {/* New Detailed Footer */}
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Page;
