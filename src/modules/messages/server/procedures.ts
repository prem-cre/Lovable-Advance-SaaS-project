import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { consumeCredits } from "@/lib/usage";
import { TRPCError } from "@trpc/server";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1, { message: "Project ID is required" }),
            })
        )
        .query(async ({ input }) => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                },
                include: {
                    fragment: true,
                },
                orderBy: {
                    updatedAt: "asc",
                },

            });

            return messages;
        }),
    create: protectedProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Message is required" }).max(10000, { message: "Message is too long" }),
                projectId: z.string().min(1, { message: "Project ID is required" }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const project = await prisma.project.findUnique({
                where: { id: input.projectId },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            try {
                console.log("🔍 Attempting to consume credits...");
                const result = await consumeCredits();
                console.log("✅ Credits consumed successfully:", result);
            } catch (error: any) {
                console.error("❌ Error consuming credits:", error);

                if (error.message?.includes("Insufficient credits")) {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "You have run out of credits. Please upgrade to continue.",
                    });
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to verify usage credits.",
                    cause: error,
                });
            }

            // Create the user message in the database
            const createdMessage = await prisma.message.create({
                data: {
                    projectId: input.projectId,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                },
            });

            // Trigger the Inngest function to process the message
            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: input.projectId,
                },
            });

            return createdMessage;
        }),

    getAll: baseProcedure.query(async () => {
        // Fetch all messages with their fragments
        const messages = await prisma.message.findMany({
            include: {
                fragment: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    }),

    getById: baseProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .query(async ({ input }) => {
            const message = await prisma.message.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    fragment: true,
                },
            });

            return message;
        }),

    delete: baseProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .mutation(async ({ input }) => {
            // Delete the message (fragment will be cascade deleted)
            const deletedMessage = await prisma.message.delete({
                where: {
                    id: input.id,
                },
            });

            return deletedMessage;
        }),

    deleteAll: baseProcedure.mutation(async () => {
        // Delete all messages (fragments will be cascade deleted)
        const result = await prisma.message.deleteMany({});

        return { count: result.count };
    }),
});
