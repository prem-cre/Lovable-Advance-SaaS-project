"use client";

import { useMutation } from "@tanstack/react-query";
import { useTRPCOptions } from "@/trpc/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";

const newsletterSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const Footer = () => {
    const trpc = useTRPCOptions();
    const form = useForm<z.infer<typeof newsletterSchema>>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof newsletterSchema>) => {
        toast.success("Thanks for subscribing!");
        form.reset();
    };

    return (
        <footer className="w-full bg-slate-50 dark:bg-black/40 border-t border-border/40 py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none mb-24">
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-orange-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">V</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Vibe Inc.</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering developers to build the future with AI-driven tools and premium design components.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6">Product</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Features', href: '#features' },
                                { name: 'Integrations', href: '#' },
                                { name: 'Pricing', href: '/home/pricing' },
                                { name: 'Changelog', href: '#' },
                                { name: 'Docs', href: '/docs' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6">Stay Updated</h4>
                        <p className="text-muted-foreground mb-6 text-sm">
                            Subscribe to our newsletter for the latest updates and exclusive templates.
                        </p>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <input
                                    {...form.register("email")}
                                    placeholder="Enter your email"
                                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-white/5 border border-border/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                            >
                                Subscribe
                                <ArrowRight className="size-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Vibe Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
