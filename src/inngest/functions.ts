import { Sandbox } from "@e2b/code-interpreter";
import { gemini, createAgent, createNetwork, createTool, type UserMessage, createState } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent, parseAgentOutput } from "./util";
import { z } from "zod";
import { PROMPT, RESPONSE_PROMPT, FRAGMENT_TITLE_PROMPT } from "../prompt";
import prisma from "@/lib/db";

interface AgentState {
    summary: string;
    files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
    { id: "code-agent" },
    { event: "code-agent/run" },
    async ({ event, step }) => {
        // Get sandbox ID from a step
        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("vibe-nextjs-test-2");
            await sandbox.setTimeout(60_000 * 10 * 2);
            return sandbox.sandboxId;
        });

        const previousMessages = await step.run("get-previous-messages", async () => {
            const messages = await prisma.message.findMany({
                where: {
                    projectId: event.data.projectId,
                    // Don't include the message we're about to create
                },
                orderBy: { createdAt: "desc" },
                take: 10, // Increased from 5 to 10 for better context
            });

            // Return in chronological order (oldest first)
            return messages.map((message) => ({
                role: message.role === "ASSISTANT" ? "assistant" : "user",
                content: message.content,
            })).reverse();
        });

        // Create tools using createTool helper to avoid naming issues
        const createOrUpdateFilesTool = createTool({
            name: "createOrUpdateFiles",
            description: "Create or update files in the sandbox",
            parameters: z.object({
                files: z.array(
                    z.object({
                        path: z.string(),
                        content: z.string(),
                    }),
                ),
            }),
            handler: async ({ files }, { step, network }) => {
                const newFiles = await step?.run("createOrUpdateFiles", async () => {
                    try {
                        const updatedFiles = (network?.state?.data?.files as Record<string, string>) || {};
                        const sandbox = await getSandbox(sandboxId);

                        for (const file of files) {
                            // Sanitize content: strip surrounding backticks if they exist (common AI error)
                            let sanitizedContent = file.content.trim();
                            if (sanitizedContent.startsWith("```") && sanitizedContent.endsWith("```")) {
                                sanitizedContent = sanitizedContent.slice(3, -3).trim();
                                // Strip language identifier if it exists (e.g., ```tsx)
                                if (sanitizedContent.match(/^[a-z]+\n/i)) {
                                    sanitizedContent = sanitizedContent.replace(/^[a-z]+\n/i, "");
                                }
                            } else if (sanitizedContent.startsWith("`") && sanitizedContent.endsWith("`")) {
                                sanitizedContent = sanitizedContent.slice(1, -1).trim();
                            }

                            await sandbox.files.write(file.path, sanitizedContent);
                            updatedFiles[file.path] = sanitizedContent;
                        }

                        return updatedFiles;
                    } catch (error) {
                        console.error("Error creating/updating files:", error);
                        throw error;
                    }
                });

                if (newFiles && typeof newFiles === "object" && network && network.state.data) {
                    (network.state.data as unknown as AgentState).files = newFiles as { [path: string]: string };
                }
            },
        });

        const terminalTool = createTool({
            name: "terminal",
            description: "Use the terminal to run commands",
            parameters: z.object({
                command: z.string(),
            }),
            handler: async ({ command }, { step }) => {
                return await step?.run("terminal", async () => {
                    const buffers = { stdout: "", stderr: "" };

                    try {
                        const sandbox = await getSandbox(sandboxId);
                        const result = await sandbox.commands.run(command, {
                            onStdout: (data: string) => {
                                buffers.stdout += data;
                            },
                            onStderr: (data: string) => {
                                buffers.stderr += data;
                            },
                        });

                        return {
                            stdout: buffers.stdout,
                            stderr: buffers.stderr,
                            exitCode: result.exitCode,
                        };
                    } catch (error) {
                        console.error("Error running terminal command:", error);
                        return {
                            stdout: buffers.stdout,
                            stderr: buffers.stderr + (error instanceof Error ? error.message : String(error)),
                            exitCode: 1,
                        };
                    }
                });
            },
        });

        const readFilesTool = createTool({
            name: "readFiles",
            description: "Read files from the sandbox",
            parameters: z.object({
                paths: z.array(z.string()),
            }),
            handler: async ({ paths }, { step }) => {
                return await step?.run("readFiles", async () => {
                    try {
                        const sandbox = await getSandbox(sandboxId);
                        const fileContents: Record<string, string> = {};

                        for (const path of paths) {
                            try {
                                const content = await sandbox.files.read(path);
                                fileContents[path] = content;
                            } catch (error) {
                                console.error(`Error reading file ${path}:`, error);
                                fileContents[path] = `Error: ${error instanceof Error ? error.message : String(error)}`;
                            }
                        }

                        return fileContents;
                    } catch (error) {
                        console.error("Error reading files:", error);
                        throw error;
                    }
                });
            },
        });

        // Create the AI code agent with tools
        const codeAgent = createAgent<AgentState>({
            name: "code-agent",
            description: "AI code agent for generating code",
            system: PROMPT,
            model: gemini({ model: "gemini-2.0-flash-exp" }),
            tools: [createOrUpdateFilesTool, terminalTool, readFilesTool],
            lifecycle: {
                onResponse: async ({ result, network }) => {
                    const lastAssistantMessageText =
                        lastAssistantTextMessageContent(result);

                    if (lastAssistantMessageText && network?.state?.data) {
                        if (lastAssistantMessageText.includes("<task_summary>")) {
                            network.state.data.summary = lastAssistantMessageText;
                        }
                    }

                    return result;
                },
            },
        });

        const fragmentTitleGenerator = createAgent({
            name: "fragment-title-generator",
            description: "A fragment title generator",
            system: FRAGMENT_TITLE_PROMPT,
            model: gemini({ model: "gemini-2.0-flash-exp" }),
        });

        const responseGenerator = createAgent({
            name: "response-generator",
            description: "A response generator",
            system: RESPONSE_PROMPT,
            model: gemini({ model: "gemini-2.0-flash-exp" }),
        });

        const network = createNetwork<AgentState>({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            defaultState: createState<AgentState>(
                {
                    summary: "",
                    files: {},
                },
                {
                    messages: previousMessages as any[],
                },
            ),
            router: async ({ network }) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return;
                }

                return codeAgent;
            },
        });

        // Run the network to generate code
        const userMessage: UserMessage = {
            id: `msg-${Date.now()}`,
            content: event.data.value, // Pass raw user input for proper context
            role: "user",
        };
        const result = await network.run(userMessage);

        const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary);
        const { output: responseOutput } = await responseGenerator.run(result.state.data.summary);


        const isError =
            result.state.data.summary.toLowerCase().includes("error") &&
            Object.keys(result.state.data.files).length === 0;

        // Get sandbox URL to connect to the created sandbox
        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host = await sandbox.getHost(3000);
            return `https://${host}`;
        });

        await step.run("save-result", async () => {
            if (isError) {
                return await prisma.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: "something went wrong",
                        role: "ASSISTANT",
                        type: "ERROR",
                    },
                });
            }
            await prisma.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: parseAgentOutput(responseOutput),
                    role: "ASSISTANT",
                    type: "RESULT",
                    fragment: {
                        create: {
                            sandboxUrl: sandboxUrl,
                            title: parseAgentOutput(fragmentTitleOutput),
                            files: (result.state.data.files || {}) as any,
                        },
                    },
                },
            });
        });

        // Return the output
        return {
            url: sandboxUrl,
            title: "Fragment",
            files: result.state.data.files,
            summary: result.state.data.summary,
        };
    },
);
