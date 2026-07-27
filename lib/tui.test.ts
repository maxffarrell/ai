import { describe, expect, test } from "bun:test";
import { getTuiCommand, tuiActions } from "./tui.ts";

describe("TUI actions", () => {
  test("exposes the dashboard actions in a stable order", () => {
    expect(tuiActions.map((action) => action.value)).toEqual([
      "benchmark",
      "verify",
      "reports",
      "exit",
    ]);
  });

  test("delegates each runnable action to the existing project command", () => {
    expect(getTuiCommand("benchmark").args).toEqual(["./index.ts"]);
    expect(getTuiCommand("verify").args).toEqual(["run", "verify-tests"]);
    expect(getTuiCommand("reports").args).toEqual(["run", "build"]);
  });
});
