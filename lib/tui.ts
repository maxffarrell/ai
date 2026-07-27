export type TuiAction = "benchmark" | "verify" | "reports" | "exit";

export interface TuiActionDefinition {
  value: TuiAction;
  label: string;
  hint: string;
}

export const tuiActions: readonly TuiActionDefinition[] = [
  {
    value: "benchmark",
    label: "Run benchmark",
    hint: "Open the existing model/MCP benchmark workflow",
  },
  {
    value: "verify",
    label: "Verify reference tests",
    hint: "Run every checked-in reference implementation",
  },
  {
    value: "reports",
    label: "Build reports",
    hint: "Regenerate HTML reports and the results index",
  },
  {
    value: "exit",
    label: "Exit",
    hint: "Return to the shell",
  },
];

export function getTuiCommand(action: Exclude<TuiAction, "exit">): {
  args: string[];
  label: string;
} {
  switch (action) {
    case "benchmark":
      return { args: ["./index.ts"], label: "Starting benchmark" };
    case "verify":
      return { args: ["run", "verify-tests"], label: "Verifying references" };
    case "reports":
      return { args: ["run", "build"], label: "Building reports" };
  }
}
