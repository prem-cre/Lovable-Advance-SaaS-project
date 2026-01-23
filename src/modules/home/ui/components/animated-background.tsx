"use client";

import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            fadeSpeed: number;
            color: string;
            phase: number; // For fading in/out

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3; // Gentle horizontal drift
                this.speedY = -Math.random() * 0.5 - 0.1; // Float upward
                this.opacity = 0;
                this.phase = Math.random() * Math.PI * 2;
                this.fadeSpeed = 0.02; // Initialized

                // Deep blue, purple, and soft white for "firefly" effect
                const colors = [
                    "147, 197, 253", // Blue-300
                    "167, 139, 250", // Violet-400
                    "255, 255, 255"  // White
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Soft sine wave fade
                this.phase += 0.02;
                this.opacity = (Math.sin(this.phase) + 1) / 2 * 0.8; // Max opacity 0.8

                // Reset if out of bounds (top)
                if (this.y < -10) {
                    this.y = canvas!.height + 10;
                    this.x = Math.random() * canvas!.width;
                }
                // Horizontal wrapping
                if (this.x > canvas!.width + 10) this.x = -10;
                if (this.x < -10) this.x = canvas!.width + 10;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                // Create soft glow particle
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
                gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(${this.color}, 0)`);

                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth * 0.08, 80); // Responsive count
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optional: Add trail effect for glassiness
            // ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener("resize", () => {
            resize();
            init();
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Base Deep Background */}
            <div className="absolute inset-0 bg-[#020617]" />

            {/* Flowing Gradient Waves (CSS) */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 bg-[length:200%_200%] animate-gradient-slow" />

            {/* Secondary Wave Layer for Depth */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-gradient-to-bl from-transparent via-blue-800 to-transparent bg-[length:200%_200%] animate-gradient-reverse-slow" />

            {/* Canvas for Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

            {/* Glassy Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

            {/* Ambient Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
        </div>
    );
};
