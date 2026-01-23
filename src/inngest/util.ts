import { Sandbox } from "@e2b/code-interpreter";
import { type Message } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(60_000 * 10 * 2);
    return sandbox;
}

export function lastAssistantTextMessageContent(result: any): string {
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message: any) => message.role === "assistant",
    );

    const message =
        result.output[lastAssistantTextMessageIndex] as
        | { role: string; content: string }
        | undefined;
    return message?.content
        ? typeof message.content === "string"
            ? message.content
            : (message.content as any).map((c: any) => c.text).join("")
        : "";
}

export const parseAgentOutput = (value: Message[]) => {
    const output = value[0];

    if (output.type !== "text") {
        return "Fragment";
    }

    if (Array.isArray(output.content)) {
        return output.content.map((txt: any) => (typeof txt === 'string' ? txt : txt.text)).join("");
    } else {
        return output.content as string;
    }
};
