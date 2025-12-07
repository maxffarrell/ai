import { generateReport } from "./lib/report.ts";
import { readdirSync } from "node:fs";

/**
 * Get the most recent result file from the results directory
 */
function getMostRecentResultFile(): string {
  const resultsDir = "results";
  const files = readdirSync(resultsDir);
  
  // Filter for result JSON files
  const resultFiles = files.filter((file) => 
    file.startsWith("result-") && file.endsWith(".json")
  );
  
  if (resultFiles.length === 0) {
    throw new Error("No result files found in results/ directory");
  }
  
  // Sort by filename (which includes timestamp) in descending order
  resultFiles.sort((a, b) => b.localeCompare(a));
  
  return `${resultsDir}/${resultFiles[0]}`;
}

// Get JSON file path from command line argument or use most recent
const jsonPath = process.argv[2] || getMostRecentResultFile();

// Generate HTML filename by replacing .json with .html
const htmlPath = jsonPath.replace(/\.json$/, ".html");

console.log(`Generating report from ${jsonPath}...`);
await generateReport(jsonPath, htmlPath);
