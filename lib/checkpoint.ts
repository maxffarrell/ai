import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type { SingleTestResult } from "./report.ts";

export const CHECKPOINT_PATH = join(process.cwd(), ".ai-checkpoint.json");
const CHECKPOINT_VERSION = 1;

export interface CheckpointConfig {
  models: string[];
  mcp?: string;
  testingTool: boolean;
  pricingEnabled: boolean;
  testNames: string[];
}

export interface BenchmarkCheckpoint {
  version: number;
  createdAt: string;
  config: CheckpointConfig;
  completedResults: Record<string, SingleTestResult[]>;
}

export function createCheckpoint(
  config: CheckpointConfig,
  completedResults: Record<string, SingleTestResult[]> = {},
): BenchmarkCheckpoint {
  return {
    version: CHECKPOINT_VERSION,
    createdAt: new Date().toISOString(),
    config,
    completedResults,
  };
}

export function loadCheckpoint(
  path: string = CHECKPOINT_PATH,
): BenchmarkCheckpoint | null {
  if (!existsSync(path)) return null;

  try {
    const parsed: unknown = JSON.parse(readFileSync(path, "utf-8"));
    return isBenchmarkCheckpoint(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCheckpoint(
  checkpoint: BenchmarkCheckpoint,
  path: string = CHECKPOINT_PATH,
): void {
  const temporaryPath = `${path}.tmp`;
  try {
    writeFileSync(temporaryPath, JSON.stringify(checkpoint, null, 2), "utf-8");
    renameSync(temporaryPath, path);
  } catch (error) {
    console.warn(
      `⚠️  Could not save checkpoint: ${error instanceof Error ? error.message : String(error)}`,
    );
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
}

export function clearCheckpoint(path: string = CHECKPOINT_PATH): void {
  if (existsSync(path)) unlinkSync(path);
  const temporaryPath = `${path}.tmp`;
  if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
}

export function checkpointMatches(
  checkpoint: BenchmarkCheckpoint,
  config: CheckpointConfig,
): boolean {
  return (
    checkpoint.version === CHECKPOINT_VERSION &&
    JSON.stringify(checkpoint.config) === JSON.stringify(config)
  );
}

function isBenchmarkCheckpoint(value: unknown): value is BenchmarkCheckpoint {
  if (!value || typeof value !== "object") return false;
  const checkpoint = value as Partial<BenchmarkCheckpoint>;
  return (
    checkpoint.version === CHECKPOINT_VERSION &&
    typeof checkpoint.createdAt === "string" &&
    !!checkpoint.config &&
    typeof checkpoint.config === "object" &&
    !!checkpoint.completedResults &&
    typeof checkpoint.completedResults === "object"
  );
}
