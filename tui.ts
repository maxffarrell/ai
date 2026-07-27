import { isCancel, intro, outro, select, note, cancel } from "@clack/prompts";
import { spawn } from "node:child_process";
import { getTuiCommand, tuiActions, type TuiAction } from "./lib/tui.ts";

function runCommand(args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn("bun", args, {
      stdio: "inherit",
      env: process.env,
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

async function main(): Promise<void> {
  intro("Svelte AI Bench · TUI");
  note(
    "A terminal dashboard for the existing benchmark workflow.\n" +
      "The benchmark runner and test suites remain unchanged.",
    "Welcome",
  );

  while (true) {
    const action = await select<TuiAction>({
      message: "Choose an action",
      options: tuiActions.map(({ value, label, hint }) => ({
        value,
        label,
        hint,
      })),
    });

    if (isCancel(action)) {
      cancel("Operation cancelled.");
      return;
    }

    if (action === "exit") {
      outro("Goodbye.");
      return;
    }

    const command = getTuiCommand(action);
    note(
      `bun ${command.args.join(" ")}\n\n` +
        "Press Ctrl-C at any time to stop the active command.",
      command.label,
    );

    try {
      const exitCode = await runCommand(command.args);
      if (exitCode === 0) {
        note("Command completed successfully.", "Done");
      } else {
        note(`Command exited with status ${exitCode}.`, "Command failed");
      }
    } catch (error) {
      note(
        error instanceof Error ? error.message : String(error),
        "Could not start command",
      );
    }
  }
}

main().catch((error) => {
  console.error("Fatal TUI error:", error);
  process.exitCode = 1;
});
