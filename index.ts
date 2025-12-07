import {
  Experimental_Agent as Agent,
  hasToolCall,
  stepCountIs,
  tool,
} from "ai";
import { experimental_createMCPClient as createMCPClient } from "./node_modules/@ai-sdk/mcp/dist/index.mjs";
import { z } from "zod";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { generateReport } from "./lib/report.ts";
import { getModelProvider, loadEnvConfig } from "./lib/providers.ts";

/**
 * Generate a timestamped filename
 * @param prefix - The prefix for the filename (e.g., "result")
 * @param extension - The file extension (e.g., "json", "html")
 * @returns Formatted filename like "result-2024-12-07-14-30-45.json"
 */
function getTimestampedFilename(prefix: string, extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${prefix}-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.${extension}`;
}

const mcp_client = await createMCPClient({
  transport: {
    type: "http",
    url: "https://mcp.svelte.dev/mcp",
  },
});

// Load environment configuration and get model provider
const envConfig = loadEnvConfig();
const model = getModelProvider(envConfig);

const svelte_agent = new Agent({
  model,

  stopWhen: hasToolCall("ResultWrite"),
  tools: {
    ResultWrite: tool({
      description: "Write content to a result file",
      inputSchema: z.object({
        content: z.string().describe("The content to write to the result file"),
      }),
      execute: async ({ content }) => {
        console.log("[ResultWrite called]", content);
        return { success: true };
      },
    }),
    ...(await mcp_client.tools()),
  },
});

const result = await svelte_agent.generate({
  prompt:
    "Can you build a counter component in svelte? Use the ResultWrite tool to write the result to a file when you are done.",
});

// Extract ResultWrite content from tool calls
let resultWriteContent: string | null = null;
for (const step of result.steps) {
  for (const content of step.content) {
    if (content.type === "tool-call" && content.toolName === "ResultWrite") {
      resultWriteContent = (content.input as { content: string }).content;
      break;
    }
  }
  if (resultWriteContent) break;
}

// Ensure results directory exists
const resultsDir = "results";
if (!existsSync(resultsDir)) {
  mkdirSync(resultsDir, { recursive: true });
}

// Generate timestamped filenames
const jsonFilename = getTimestampedFilename("result", "json");
const htmlFilename = getTimestampedFilename("result", "html");
const jsonPath = `${resultsDir}/${jsonFilename}`;
const htmlPath = `${resultsDir}/${htmlFilename}`;

// Save result JSON with timestamped filename
writeFileSync(
  jsonPath,
  JSON.stringify({ ...result, resultWriteContent }, null, 2)
);

console.log(`✓ Results saved to ${jsonPath}`);

// Generate HTML report with timestamped filename
await generateReport(jsonPath, htmlPath);
