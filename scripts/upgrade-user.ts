/**
 * Test script to demonstrate upgrading a user to Pro plan
 * Run with: npx tsx scripts/upgrade-user.ts <userId>
 * 
 * Example: npx tsx scripts/upgrade-user.ts user_2abc123def
 */

import prisma from "../src/lib/db";
import { updateUsagePoints } from "../src/lib/usage";

const PRO_PLAN_CREDITS = 100;
const ENTERPRISE_PLAN_CREDITS = 500;

async function upgradeUser(userId: string, plan: "pro" | "enterprise" = "pro") {
    console.log(`\n🚀 Upgrading user ${userId} to ${plan.toUpperCase()} plan...\n`);

    try {
        const credits = plan === "pro" ? PRO_PLAN_CREDITS : ENTERPRISE_PLAN_CREDITS;

        // Check if user exists in Usage table
        const existingUsage = await prisma.usage.findUnique({
            where: { key: userId },
        });

        if (existingUsage) {
            console.log(`📊 Current usage:`, {
                points: existingUsage.points,
                consumedPoints: (existingUsage as any).consumedPoints,
            });
        } else {
            console.log(`📊 No existing usage record found. Creating new one...`);
        }

        // Upgrade user
        await updateUsagePoints(userId, credits);

        // Verify upgrade
        const updated = await prisma.usage.findUnique({
            where: { key: userId },
        });

        console.log(`\n✅ Successfully upgraded to ${plan.toUpperCase()} plan!`);
        console.log(`📊 New usage:`, {
            points: updated?.points,
            consumedPoints: (updated as any)?.consumedPoints,
        });

        console.log(`\n🎉 User now has ${credits} credits!`);
    } catch (error) {
        console.error("\n❌ Error upgrading user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Get userId from command line arguments
const userId = process.argv[2];
const plan = (process.argv[3] as "pro" | "enterprise") || "pro";

if (!userId) {
    console.error("❌ Please provide a userId as an argument");
    console.log("\nUsage: npx tsx scripts/upgrade-user.ts <userId> [plan]");
    console.log("Example: npx tsx scripts/upgrade-user.ts user_2abc123def pro");
    process.exit(1);
}

upgradeUser(userId, plan);
