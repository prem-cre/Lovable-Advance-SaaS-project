"use client";

import { CheckCircle2, Zap, Shield, Globe, Cpu, Users } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Built on top of Next.js 15 and Turbopack for instant page loads and seamless interactions.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption and secure authentication powered by Clerk and advanced middleware.",
    },
    {
        icon: Globe,
        title: "Global Edge Network",
        description: "Deploy your applications to the edge with Vercel for low-latency access worldwide.",
    },
    {
        icon: Cpu,
        title: "AI Powered Core",
        description: "Integrated with advanced LLMs to assist, generate, and optimize your codebase in real-time.",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description: "Work together with your team in real-time with live cursors and instant updates.",
    },
    {
        icon: CheckCircle2,
        title: "Production Ready",
        description: "Everything you need to ship to production: CI/CD, monitoring, analytics, and more.",
    },
];

export const FeaturesSection = () => {
    return (
        <section className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                        Why choose <span className="text-orange-600 dark:text-orange-500">Vibe?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        We provide the most advanced tools and infrastructure to help you build better software, faster.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-8 rounded-3xl bg-white/50 dark:bg-black/20 border border-border/50 hover:border-orange-500/30 transition-all hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                                <div className="relative z-10">
                                    <div className="size-14 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="size-7 text-orange-600 dark:text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
