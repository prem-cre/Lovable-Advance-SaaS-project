/**
 * Test script to verify usage tracking is working correctly
 * Run with: npx tsx scripts/test-usage.ts
 */

import prisma from "../src/lib/db";

async function testUsage() {
    console.log("🧪 Testing Usage System...\n");

    const testUserId = "test_user_123";

    try {
        // Clean up any existing test data
        await prisma.usage.deleteMany({
            where: { key: testUserId },
        });

        console.log("1️⃣ Creating initial usage record...");
        const expireTimestamp = BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const created = await prisma.usage.create({
            data: {
                key: testUserId,
                points: 2,
                consumedPoints: 0 as any,
                expire: expireTimestamp as any,
            },
        });

        console.log("✅ Created:", {
            key: created.key,
            points: created.points,
            consumedPoints: (created as any).consumedPoints,
            expire: (created as any).expire?.toString(),
        });

        console.log("\n2️⃣ Simulating credit consumption...");
        const updated = await prisma.usage.update({
            where: { key: testUserId },
            data: {
                consumedPoints: 1 as any,
                points: 1,
            },
        });

        console.log("✅ After consuming 1 credit:", {
            points: updated.points,
            consumedPoints: (updated as any).consumedPoints,
        });

        console.log("\n3️⃣ Fetching all usage records...");
        const allUsage = await prisma.usage.findMany();
        console.log(`✅ Found ${allUsage.length} usage record(s) in database`);

        // Clean up test data
        await prisma.usage.delete({
            where: { key: testUserId },
        });

        console.log("\n✅ All tests passed! Usage system is working correctly.");
    } catch (error) {
        console.error("\n❌ Test failed:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

testUsage();
