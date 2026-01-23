"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
    vx: number;
    vy: number;
    parallaxSpeed: number;
}

interface DarkGlossyParticleDriftProps {
    particleCount?: number;
    speed?: number;
    enableParallax?: boolean;
}

export const DarkGlossyParticleDrift: React.FC<DarkGlossyParticleDriftProps> = ({
    particleCount = 80,
    speed = 1,
    enableParallax = true,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);
    const sweepRef = useRef({ x: -200, speed: 1.5, nextSweepTime: Date.now() + 5000 });
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, resolvedTheme } = useTheme();

    const currentTheme = resolvedTheme || theme || 'light';

    useEffect(() => {
        setMounted(true);
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            const colors = currentTheme === 'dark'
                ? [
                    "rgba(255, 255, 255,",   // White
                    "rgba(192, 192, 192,",   // Silver
                    "rgba(0, 255, 255,",     // Faint Cyan
                    "rgba(138, 43, 226,",    // Faint Violet
                ]
                : [
                    "rgba(185, 75, 46,",      // Brand Orange
                    "rgba(10, 10, 26,",       // Deep Navy
                    "rgba(79, 70, 229,",      // Indigo
                    "rgba(20, 20, 20,",       // Near Black
                ];

            particlesRef.current = Array.from({ length: particleCount }, () => {
                const size = Math.random() * 2 + 2;
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: size,
                    opacity: currentTheme === 'dark' ? Math.random() * 0.05 + 0.03 : Math.random() * 0.07 + 0.05,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 0.4 * speed,
                    vy: (Math.random() - 0.5) * 0.4 * speed,
                    parallaxSpeed: size * 0.05,
                };
            });
        };

        const drawParticle = (p: Particle) => {
            if (!ctx) return;

            // Subtle Parallax
            const mouseXOffset = (mouseRef.current.x - window.innerWidth / 2) * p.parallaxSpeed * 0.01;
            const mouseYOffset = (mouseRef.current.y - window.innerHeight / 2) * p.parallaxSpeed * 0.01;

            const x = p.x + (enableParallax ? mouseXOffset : 0);
            const y = p.y + (enableParallax ? mouseYOffset : 0);

            ctx.beginPath();
            ctx.fillStyle = `${p.color}${p.opacity})`;
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Glossy highlight
            const grad = ctx.createRadialGradient(
                x - p.size * 0.3,
                y - p.size * 0.3,
                p.size * 0.1,
                x,
                y,
                p.size
            );

            const highlightColor = currentTheme === 'dark' ? '255, 255, 255' : '185, 75, 46';
            grad.addColorStop(0, `rgba(${highlightColor}, 0.15)`);
            grad.addColorStop(0.5, `rgba(${highlightColor}, 0.02)`);
            grad.addColorStop(1, `rgba(${highlightColor}, 0)`);
            ctx.fillStyle = grad;
            ctx.fill();
        };

        const drawSweep = () => {
            if (!ctx || Date.now() < sweepRef.current.nextSweepTime) return;

            const sweep = sweepRef.current;
            const grad = ctx.createLinearGradient(sweep.x, 0, sweep.x + 300, 0);

            const sweepBaseColor = currentTheme === 'dark' ? '255, 255, 255' : '185, 75, 46';
            grad.addColorStop(0, `rgba(${sweepBaseColor}, 0)`);
            grad.addColorStop(0.5, `rgba(${sweepBaseColor}, ${currentTheme === 'dark' ? '0.03' : '0.015'})`);
            grad.addColorStop(1, `rgba(${sweepBaseColor}, 0)`);

            ctx.fillStyle = grad;
            ctx.fillRect(sweep.x, 0, 300, canvas.height);

            sweep.x += sweep.speed;

            if (sweep.x > canvas.width) {
                sweep.x = -300;
                sweep.nextSweepTime = Date.now() + Math.random() * 10000 + 10000; // Next sweep in 10-20s
            }
        };

        const drawBackground = () => {
            if (!ctx) return;

            // Fill background based on theme
            if (currentTheme === 'dark') {
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Ambient radial gradients
                const grad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, canvas.width);
                grad1.addColorStop(0, "rgba(10, 10, 26, 0.4)");
                grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad1;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const grad2 = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, canvas.width);
                grad2.addColorStop(0, "rgba(185, 75, 46, 0.05)");
                grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Vignette
                const vignette = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 4,
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 1.2
                );
                vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
                vignette.addColorStop(1, "rgba(0, 0, 0, 0.6)");
                ctx.fillStyle = vignette;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                // Light Theme: Transparent background so CSS gradient shows through
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Subtle light mode vignette
                const vignette = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 3,
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 1.1
                );
                vignette.addColorStop(0, "rgba(255, 255, 255, 0)");
                vignette.addColorStop(1, "rgba(185, 75, 46, 0.03)");
                ctx.fillStyle = vignette;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };

        const render = () => {
            drawBackground();

            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < -p.size) p.x = canvas.width + p.size;
                if (p.x > canvas.width + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = canvas.height + p.size;
                if (p.y > canvas.height + p.size) p.y = -p.size;

                drawParticle(p);
            });

            drawSweep();
            animationFrameId = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        resize();
        render();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleCount, speed, enableParallax, prefersReducedMotion, currentTheme]);

    if (prefersReducedMotion) {
        return <div className="fixed inset-0 bg-background -z-10" />;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ filter: "blur(0.5px)" }}
        />
    );
};
