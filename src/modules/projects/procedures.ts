import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                projectId: z.string().min(1),
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
                    createdAt: "asc",
                },
            });

            return messages;
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Value is required" }).max(10000, { message: "Value is  long" }),
                projectId: z.string().min(1, { message: "Project ID is required" }),
            })
        )
        .mutation(async ({ input }) => {
            const createdMessage = await prisma.message.create({
                data: {
                    projectId: input.projectId,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                },
            });

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

export const projectsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                id: z.string().min(1, { message: "Project ID is required" }),
            })
        )
        .query(async ({ input }) => {
            const existingProject = await prisma.project.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    messages: {
                        include: {
                            fragment: true,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });
            if (!existingProject) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Project not found",
                });
            }

            return existingProject;
        }),
    create: baseProcedure
        .input(
            z.object({
                value: z.string().min(1, { message: "Value is required" }).max(10000, { message: "Value is too long" }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth?.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to create a project",
                });
            }

            const createdProject = await prisma.project.create({
                data: {
                    userId: userId,
                    name: generateSlug(2, {
                        format: "kebab",
                    }),
                    messages: {
                        create: {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        },
                    },
                },
            });

            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId: createdProject.id,
                },
            });

            return createdProject;
        }),

    getById: baseProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .query(async ({ input }) => {
            const project = await prisma.project.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    messages: {
                        include: {
                            fragment: true,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });

            return project;
        }),

    getMessages: baseProcedure
        .input(
            z.object({
                projectId: z.string().uuid(),
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
                    createdAt: "asc",
                },
            });

            return messages;
        }),
    getMany: baseProcedure.query(async ({ ctx }) => {
        const userId = ctx.auth?.userId;

        if (!userId) {
            return [];
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return projects;
    }),
});

