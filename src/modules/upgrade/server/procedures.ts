import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { updateUsagePoints } from "@/lib/usage";
import { TRPCError } from "@trpc/server";

// Pro plan configuration
const PRO_PLAN_CREDITS = 100; // Pro users get 100 credits per month

export const upgradeRouter = createTRPCRouter({
    /**
     * Upgrades a user to Pro plan
     * In production, this would be called after successful payment via Stripe webhook
     */
    upgradeToPro: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                plan: z.enum(["pro", "enterprise"]).default("pro"),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                const credits = input.plan === "pro" ? PRO_PLAN_CREDITS : 500;

                // Update user's credits
                await updateUsagePoints(input.userId, credits);

                console.log(`✅ User ${input.userId} upgraded to ${input.plan} with ${credits} credits`);

                return {
                    success: true,
                    plan: input.plan,
                    credits: credits,
                    message: `Successfully upgraded to ${input.plan} plan with ${credits} credits!`,
                };
            } catch (error) {
                console.error("❌ Error upgrading user:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to upgrade user plan",
                });
            }
        }),

    /**
     * Manually add credits to a user (admin function)
     */
    addCredits: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                credits: z.number().min(1).max(10000),
            })
        )
        .mutation(async ({ input }) => {
            try {
                await updateUsagePoints(input.userId, input.credits);

                console.log(`✅ Added ${input.credits} credits to user ${input.userId}`);

                return {
                    success: true,
                    credits: input.credits,
                    message: `Successfully added ${input.credits} credits!`,
                };
            } catch (error) {
                console.error("❌ Error adding credits:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to add credits",
                });
            }
        }),
});
