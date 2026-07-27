import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  checkpointMatches,
  clearCheckpoint,
  createCheckpoint,
  loadCheckpoint,
  saveCheckpoint,
} from "./checkpoint.ts";

describe("benchmark checkpoints", () => {
  test("round trips checkpoint state atomically", () => {
    const directory = mkdtempSync(join(tmpdir(), "ai-checkpoint-test-"));
    const path = join(directory, "checkpoint.json");
    const config = {
      models: ["openai/gpt-4o"],
      mcp: undefined,
      testingTool: true,
      pricingEnabled: true,
      testNames: ["counter"],
    };

    const checkpoint = createCheckpoint(config, { "openai/gpt-4o": [] });
    saveCheckpoint(checkpoint, path);

    expect(loadCheckpoint(path)).toEqual(checkpoint);
    expect(readFileSync(path, "utf-8")).toContain('"version": 1');

    clearCheckpoint(path);
    expect(loadCheckpoint(path)).toBeNull();
    rmSync(directory, { recursive: true, force: true });
  });

  test("only resumes a matching benchmark configuration", () => {
    const checkpoint = createCheckpoint({
      models: ["model-a"],
      testingTool: false,
      pricingEnabled: false,
      testNames: ["counter"],
    });

    expect(checkpointMatches(checkpoint, checkpoint.config)).toBe(true);
    expect(
      checkpointMatches(checkpoint, { ...checkpoint.config, models: ["model-b"] }),
    ).toBe(false);
  });
});
