import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 2;
const PRO_POINTS = 100;
const DURATION_DAYS = 30;
const GENERATION_COST = 1;

/**
 * Get user's current plan and calculate total points
 */
async function getUserPlanPoints(): Promise<number> {
    try {
        const { has } = await auth();
        const hasProAccess = has?.({ plan: "pro" });
        return hasProAccess ? PRO_POINTS : FREE_POINTS;
    } catch (error) {
        console.error("Error checking user plan:", error);
        return FREE_POINTS; // Default to free plan on error
    }
}

/**
 * Initialize or get usage record for a user
 */
async function getOrCreateUsage(userId: string, totalPoints: number) {
    let usage = await prisma.usage.findUnique({
        where: { key: userId },
    });

    if (!usage) {
        const expireTimestamp = BigInt(Date.now() + DURATION_DAYS * 24 * 60 * 60 * 1000);
        usage = await prisma.usage.create({
            data: {
                key: userId,
                points: totalPoints,
                consumedPoints: 0,
                expire: expireTimestamp as any,
            },
        });
    }

    return usage;
}

/**
 * Check if usage has expired and reset if needed
 */
async function checkAndResetIfExpired(usage: any, totalPoints: number) {
    const now = BigInt(Date.now());
    const expire = usage.expire ? BigInt(usage.expire.toString()) : BigInt(0);

    if (expire > 0 && now > expire) {
        // Reset credits
        const newExpire = BigInt(Date.now() + DURATION_DAYS * 24 * 60 * 60 * 1000);
        const updated = await prisma.usage.update({
            where: { key: usage.key },
            data: {
                points: totalPoints,
                consumedPoints: 0,
                expire: newExpire as any,
            },
        });
        return updated;
    }

    return usage;
}

/**
 * Consumes credits for a specific user action (e.g., AI generation).
 * Throws an error if the user is out of credits.
 */
export async function consumeCredits() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        // Get user's plan and total points
        const totalPoints = await getUserPlanPoints();

        // Get or create usage record
        let usage = await getOrCreateUsage(userId, totalPoints);

        // Check if expired and reset if needed
        usage = await checkAndResetIfExpired(usage, totalPoints);

        // Calculate remaining points
        const consumedPoints = (usage as any).consumedPoints || 0;
        const remainingPoints = usage.points - consumedPoints;

        // Check if user has credits
        if (remainingPoints <= 0) {
            throw new Error(`Insufficient credits. Remaining: 0`);
        }

        // Consume 1 credit
        const updated = await prisma.usage.update({
            where: { key: userId },
            data: {
                consumedPoints: consumedPoints + 1,
            },
        });

        const newRemaining = usage.points - (consumedPoints + 1);

        return {
            success: true,
            remainingPoints: newRemaining,
            consumedPoints: consumedPoints + 1,
            totalPoints: usage.points,
        };
    } catch (error: any) {
        console.error("Error consuming credits:", error);
        throw error;
    }
}

/**
 * Retrieves the current usage status for the authenticated user.
 * If no usage record exists yet, it initializes one with default points.
 */
export async function getUsageStatus() {
    const { userId } = await auth();

    if (!userId) {
        return {
            points: 0,
            remainingPoints: 0,
            consumedPoints: 0,
            isLimited: true,
        };
    }

    try {
        // Get user's plan and total points
        const totalPoints = await getUserPlanPoints();

        // Get or create usage record
        let usage = await getOrCreateUsage(userId, totalPoints);

        // Check if expired and reset if needed
        usage = await checkAndResetIfExpired(usage, totalPoints);

        const consumedPoints = (usage as any).consumedPoints || 0;
        const remainingPoints = usage.points - consumedPoints;

        return {
            points: usage.points,
            remainingPoints: remainingPoints,
            consumedPoints: consumedPoints,
            isLimited: remainingPoints <= 0,
        };
    } catch (error) {
        console.error("Error getting usage status:", error);
        // Return default values on error
        return {
            points: FREE_POINTS,
            remainingPoints: FREE_POINTS,
            consumedPoints: 0,
            isLimited: false,
        };
    }
}

/**
 * Manually update user's credits (for admin or upgrade purposes)
 */
export async function updateUsagePoints(userId: string, newPoints: number) {
    const expireTimestamp = BigInt(Date.now() + DURATION_DAYS * 24 * 60 * 60 * 1000);

    return await prisma.usage.upsert({
        where: { key: userId },
        update: {
            points: newPoints,
            consumedPoints: 0,
            expire: expireTimestamp as any,
        },
        create: {
            key: userId,
            points: newPoints,
            consumedPoints: 0,
            expire: expireTimestamp as any,
        },
    });
}
