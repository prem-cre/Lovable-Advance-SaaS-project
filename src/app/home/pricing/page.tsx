"use client";

import { PricingTable } from "@clerk/nextjs";
import { Sparkles, Zap, Crown, Check, ArrowRight, Star, Rocket } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Page = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
            {/* Navbar - Matching Home Page */}
            <header className="sticky top-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-border/40">
                <div className="relative max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <Link href="/home" className="flex items-center gap-3 group">
                            <div className="relative size-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg transition-all duration-300 border border-white/20">
                                <Image
                                    src="/vibe-logo.png"
                                    alt="Vibe"
                                    width={28}
                                    height={28}
                                    className="brightness-0 invert drop-shadow-md"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-black text-foreground tracking-tight">
                                    Vibe
                                </h1>
                                <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 tracking-widest uppercase opacity-90">AI Development</p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                href="/home"
                                className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all rounded-full"
                            >
                                Home
                            </Link>
                            <Link
                                href="/home/pricing"
                                className="px-5 py-2 text-sm font-bold text-orange-600 dark:text-orange-400 bg-accent rounded-full"
                            >
                                Pricing
                            </Link>

                            {mounted && (
                                <>
                                    <ModeToggle />
                                    <SignedIn>
                                        <div className="ml-4">
                                            <UserButton
                                                afterSignOutUrl="/home"
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
                        </nav>
                    </div>
                </div>
            </header>

            {/* Dynamic Floating Background Orbs - Matching Home Page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Main floating orbs with your project's colors */}
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-40 left-20 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[140px] animate-float-reverse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow" />

                {/* Additional ambient glows */}
                <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-[90px] animate-float-reverse" style={{ animationDelay: '3s' }} />
            </div>

            {/* Main Content */}
            <main className="flex-1 relative">
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

                    {/* Hero Section - Matching Home Page Style */}
                    <section className="text-center relative z-10 mb-20">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/50 border border-border/50 rounded-full mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700 backdrop-blur-md">
                            <Rocket className="size-4 text-orange-600 dark:text-orange-500" />
                            <span className="text-sm font-bold text-foreground">
                                Limited Time Offer - 50% Off First Month
                            </span>
                        </div>

                        {/* Main Heading with Silver Gradient */}
                        <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter mb-8 leading-[0.9]">
                            Choose Your
                            <br />
                            <span className="text-silver-gradient relative inline-block">
                                Power Plan
                                <span className="absolute -inset-1 bg-white/10 blur-3xl -z-10" />
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                            Unlock unlimited AI-powered code generation.
                            <br />
                            <span className="text-sm text-muted-foreground/70">
                                Secure payments • Instant access • Cancel anytime
                            </span>
                        </p>
                    </section>

                    {/* Feature Cards Grid - Glossy Silver Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        {[
                            {
                                icon: Sparkles,
                                title: "Instant Magic",
                                description: "Generate production-ready code in seconds with cutting-edge AI",
                            },
                            {
                                icon: Zap,
                                title: "Lightning Speed",
                                description: "Experience blazing-fast performance with our optimized infrastructure",
                            },
                            {
                                icon: Crown,
                                title: "Premium Quality",
                                description: "Enterprise-grade code generation with advanced AI models",
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="group">
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

                                        {/* Animated arrow */}
                                        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                                            Learn more
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Premium Pricing Table Container - Glossy Card Style */}
                    <div className="relative mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        {/* Decorative floating orbs */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

                        {/* Main Glossy Container */}
                        <div className="relative group">
                            {/* Glossy Card with your project's style */}
                            <div className="glossy-card rounded-[32px] p-8 md:p-16 relative overflow-hidden">
                                {/* Glossy shimmer effect */}
                                <div className="glossy-shimmer absolute inset-0 pointer-events-none" />

                                {/* Section header */}
                                <div className="text-center mb-12 relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50 backdrop-blur-md mb-6">
                                        <Star className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                                        <span className="text-sm font-bold text-foreground">Choose Your Plan</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                                        Simple, Transparent Pricing
                                    </h2>
                                    <p className="text-muted-foreground text-lg font-medium">
                                        All plans include our core features. Upgrade anytime.
                                    </p>
                                </div>

                                {/* Clerk Pricing Table */}
                                <div className="pricing-table-wrapper relative z-10">
                                    <PricingTable />
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground relative z-10">
                                    {[
                                        { icon: Check, text: "No credit card required" },
                                        { icon: Check, text: "Cancel anytime" },
                                        { icon: Check, text: "Secure payments" },
                                        { icon: Check, text: "Instant activation" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <item.icon className="w-3 h-3 text-green-600 dark:text-green-500" />
                                            </div>
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section - Glossy Silver Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        {[
                            { value: "10K+", label: "Developers" },
                            { value: "1M+", label: "Generations" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, i) => (
                            <div key={i} className="glossy-silver p-6 rounded-3xl text-center hover:-translate-y-1 transition-transform duration-300 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none rounded-3xl" />
                                <div className="text-4xl font-black text-orange-600 dark:text-orange-500 mb-2 group-hover:scale-110 transition-transform relative z-10">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider relative z-10">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Section */}
                    <div className="text-center pb-24 space-y-12 animate-in fade-in duration-700 delay-400">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                            Trusted by developers at
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10">
                            {["GITHUB", "MICROSOFT", "GOOGLE", "VERCEL", "META", "AMAZON"].map((company, i) => (
                                <span
                                    key={i}
                                    className="text-2xl font-black tracking-tighter text-muted-foreground/40 hover:text-foreground hover:scale-110 transition-all duration-300 cursor-pointer"
                                >
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                /* Custom scrollbar matching your project */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #F97316, #EA580C);
                    border-radius: 6px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #EA580C, #C2410C);
                    background-clip: padding-box;
                }

                /* Ensure proper scrolling */
                html, body {
                    overflow-y: auto !important;
                }

                /* Fix Clerk Pricing Table z-index stacking */
                .pricing-table-wrapper {
                    position: relative;
                    z-index: 50 !important;
                    isolation: isolate;
                }

                /* Ensure Clerk components have proper z-index */
                .pricing-table-wrapper > * {
                    position: relative;
                    z-index: 50 !important;
                }

                /* Clerk modal/checkout overlay */
                [data-clerk-modal],
                [data-clerk-dialog],
                .cl-modalBackdrop,
                .cl-modal {
                    z-index: 9999 !important;
                }

                /* Clerk pricing table cards */
                .cl-pricingCard,
                .cl-card {
                    position: relative !important;
                    z-index: 100 !important;
                }

                /* Ensure text in pricing cards is visible */
                .cl-pricingCard *,
                .cl-card * {
                    position: relative;
                    z-index: 101 !important;
                }

                /* Fix any backdrop issues */
                .cl-modalBackdrop {
                    background: rgba(0, 0, 0, 0.6) !important;
                    backdrop-filter: blur(8px) !important;
                }
            `}</style>
        </div>
    );
};

export default Page;
