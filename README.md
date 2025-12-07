# ai-sdk-bench

AI SDK benchmarking tool that tests AI agents with MCP (Model Context Protocol) integration.

## Installation

To install dependencies:

```bash
bun install
```

## Setup

To set up `.env`:

```bash
cp .env.example .env
```

Then configure your API keys and model in `.env`:

```bash
MODEL=anthropic/claude-sonnet-4
ANTHROPIC_API_KEY=your_key_here
```

## Usage

To run a benchmark:

```bash
bun run index.ts
```

Results are saved to the `results/` directory with timestamped filenames:
- `results/result-2024-12-07-14-30-45.json` - Full execution trace
- `results/result-2024-12-07-14-30-45.html` - Interactive HTML report

To regenerate an HTML report from a JSON file:

```bash
# Regenerate most recent result
bun run generate-report.ts

# Regenerate specific result
bun run generate-report.ts results/result-2024-12-07-14-30-45.json
```

## Documentation

See [AGENTS.md](AGENTS.md) for detailed documentation on:
- Architecture and components
- Environment variables and model configuration
- MCP integration
- Development commands

---

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
