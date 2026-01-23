import prisma from "@/lib/db";

const FREE_POINTS = 2;
const DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Initializes usage credits for a user if they don't exist yet.
 * This ensures every user starts with their free credits.
 */
export async function initializeUserUsage(userId: string) {
    const existingUsage = await prisma.usage.findUnique({
        where: { key: userId },
    });

    if (!existingUsage) {
        const expireTimestamp = BigInt(Date.now() + DURATION_SECONDS * 1000);

        await prisma.usage.create({
            data: {
                key: userId,
                points: FREE_POINTS,
                consumedPoints: 0,
                expire: expireTimestamp as any, // Type will be correct after Prisma regeneration
            },
        });

        console.log(`✅ Initialized ${FREE_POINTS} credits for user ${userId}`);
    }

    return existingUsage;
}

/**
 * Gets or creates usage record for a user
 */
export async function ensureUsageExists(userId: string) {
    let usage = await prisma.usage.findUnique({
        where: { key: userId },
    });

    if (!usage) {
        await initializeUserUsage(userId);
        usage = await prisma.usage.findUnique({
            where: { key: userId },
        });
    }

    return usage;
}
