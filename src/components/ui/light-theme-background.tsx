"use client";

import { useEffect, useState } from "react";

export const LightThemeBackground = () => {
    const [stars, setStars] = useState<any[]>([]);
    const [meteors, setMeteors] = useState<any[]>([]);

    // These are the "red like" and colorful dots you see
    const starColors = [
        { color: "#ADD8E6", shadow: "0 0 4px #ADD8E6" }, // Light Blue
        { color: "#FFB6C1", shadow: "0 0 4px #FFB6C1" }, // Light Pink (The "Red" one)
        { color: "#E6E6FA", shadow: "0 0 4px #E6E6FA" }, // Lavender
    ];

    const generateStars = () => {
        const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 8000);
        const newStars = [];
        for (let i = 0; i < numberOfStars; i++) {
            const colorIndex = Math.floor(Math.random() * starColors.length);
            newStars.push({
                id: i,
                size: Math.random() * 3 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.5,
                animationDuration: Math.random() * 4 + 2,
                animationDelay: Math.random() * 4,
                color: starColors[colorIndex].color,
                shadow: starColors[colorIndex].shadow,
            });
        }
        setStars(newStars);
    };

    const generateMeteors = () => {
        const numberOfMeteors = 20;
        const newMeteors = [];
        for (let i = 0; i < numberOfMeteors; i++) {
            const colorIndex = Math.floor(Math.random() * starColors.length);
            newMeteors.push({
                id: i,
                size: Math.random() * 2 + 1,
                x: Math.random() * 100,
                y: Math.random() * 20 - 20, // Start slightly above the viewport
                delay: Math.random() * 10, // continuous flow
                animationDuration: Math.random() * 3 + 2, // 2-5s duration
                color: starColors[colorIndex].color,
                shadow: starColors[colorIndex].shadow,
            });
        }
        setMeteors(newMeteors);
    };

    useEffect(() => {
        generateStars();
        generateMeteors();

        const handleResize = () => generateStars();
        // Removed setInterval to allow CSS infinite animation to handle the loop smoothly

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Dots */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="animate-pulse-subtle"
                    style={{
                        position: "absolute",
                        width: star.size + "px",
                        height: star.size + "px",
                        left: star.x + "%",
                        top: star.y + "%",
                        opacity: star.opacity,
                        animationDuration: star.animationDuration + "s",
                        animationDelay: star.animationDelay + "s",
                        backgroundColor: star.color,
                        boxShadow: star.shadow,
                        borderRadius: "50%",
                    }}
                />
            ))}

            {/* Falling Stars (Meteors) */}
            {meteors.map((meteor) => (
                <div
                    key={meteor.id}
                    className="animate-meteor"
                    style={{
                        position: "absolute",
                        width: meteor.size * 80 + "px",
                        height: meteor.size * 1.5 + "px",
                        left: meteor.x + "%",
                        top: meteor.y + "%",
                        animationDelay: meteor.delay + "s",
                        animationDuration: meteor.animationDuration + "s",
                        background: `linear-gradient(90deg, transparent, ${meteor.color})`,
                        boxShadow: meteor.shadow,
                    }}
                />
            ))}
        </div>
    );
};
