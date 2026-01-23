"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPCOptions } from "@/trpc/client";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        credits: 2,
        features: [
            "2 AI generations per month",
            "Basic code generation",
            "Community support",
            "30-day credit reset",
        ],
        icon: Sparkles,
        gradient: "from-slate-500 to-slate-700",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "per month",
        credits: 100,
        features: [
            "100 AI generations per month",
            "Advanced code generation",
            "Priority support",
            "30-day credit reset",
            "Early access to new features",
            "Custom templates",
        ],
        icon: Zap,
        gradient: "from-orange-500 to-pink-500",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "per month",
        credits: 500,
        features: [
            "500 AI generations per month",
            "Premium code generation",
            "24/7 dedicated support",
            "30-day credit reset",
            "Custom integrations",
            "Team collaboration",
            "Advanced analytics",
            "SLA guarantee",
        ],
        icon: Crown,
        gradient: "from-purple-500 to-indigo-600",
        popular: false,
    },
];

export function PricingCards() {
    const { user } = useUser();
    const trpc = useTRPCOptions();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState<string | null>(null);

    const upgradeMutation = useMutation(
        trpc.upgrade.upgradeToPro.mutationOptions({
            onSuccess: (data) => {
                toast.success("Upgrade Successful! 🎉", {
                    description: `You now have ${data.credits} credits!`,
                });
                queryClient.invalidateQueries({
                    queryKey: trpc.usage.status.queryOptions().queryKey
                });
                setLoading(null);
            },
            onError: (error) => {
                toast.error("Upgrade Failed", {
                    description: error.message || "Please try again",
                });
                setLoading(null);
            },
        })
    );

    const handleUpgrade = async (planName: string) => {
        if (!user) {
            toast.error("Please sign in to upgrade");
            return;
        }

        if (planName === "Free") {
            toast.info("You're already on the Free plan!");
            return;
        }

        setLoading(planName);

        // In production, this would redirect to Stripe Checkout
        // For demo purposes, we'll directly upgrade the user
        try {
            await upgradeMutation.mutateAsync({
                userId: user.id,
                plan: planName.toLowerCase() as "pro" | "enterprise",
            });
        } catch (error) {
            console.error("Upgrade error:", error);
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                    <div
                        key={plan.name}
                        className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-105 ${plan.popular
                                ? "border-orange-500 shadow-2xl shadow-orange-500/20 dark:shadow-orange-500/40"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                    MOST POPULAR
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient}`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-slate-500 dark:text-slate-400">
                                    {plan.period}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                {plan.credits} credits per month
                            </p>
                        </div>

                        <Button
                            onClick={() => handleUpgrade(plan.name)}
                            disabled={loading !== null}
                            className={`w-full mb-6 ${plan.popular
                                    ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                                    : ""
                                }`}
                            size="lg"
                        >
                            {loading === plan.name ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : plan.name === "Free" ? (
                                "Current Plan"
                            ) : (
                                `Upgrade to ${plan.name}`
                            )}
                        </Button>

                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
