import { anthropic } from "@ai-sdk/anthropic";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

interface ProviderConfig {
  modelString: string;
  anthropicApiKey?: string;
  openrouterApiKey?: string;
}

/**
 * Smart provider routing based on model string prefix
 * @param config - Configuration object with model string and API keys
 * @returns Configured language model instance
 * @throws Error if required API key is missing or model format is invalid
 */
export function getModelProvider(config: ProviderConfig): LanguageModel {
  const { modelString, anthropicApiKey, openrouterApiKey } = config;

  // Validate model string format
  if (!modelString || typeof modelString !== "string") {
    throw new Error(
      "MODEL environment variable is required and must be a string"
    );
  }

  // Route to Anthropic provider
  if (modelString.startsWith("anthropic/")) {
    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is required for Anthropic models");
    }

    // Extract model name (e.g., "anthropic/claude-haiku-4-5" -> "claude-haiku-4-5")
    const modelName = modelString.replace("anthropic/", "");
    // The Anthropic SDK reads the API key from process.env.ANTHROPIC_API_KEY automatically
    return anthropic(modelName);
  }

  // Route to OpenRouter provider
  if (modelString.startsWith("openrouter/")) {
    if (!openrouterApiKey) {
      throw new Error("OPENROUTER_API_KEY is required for OpenRouter models");
    }

    // Create OpenRouter provider instance
    const openrouter = createOpenRouter({
      apiKey: openrouterApiKey,
    });

    // Extract full model path (e.g., "openrouter/anthropic/claude-sonnet-4" -> "anthropic/claude-sonnet-4")
    const modelPath = modelString.replace("openrouter/", "");
    return openrouter.chat(modelPath);
  }

  // Invalid format
  throw new Error(
    `Invalid MODEL format: "${modelString}". Must start with "anthropic/" or "openrouter/"`
  );
}

/**
 * Load and validate environment variables
 * @returns Configuration object with validated environment variables
 */
export function loadEnvConfig(): ProviderConfig {
  const modelString = process.env.MODEL;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  // Model is required
  if (!modelString) {
    throw new Error(
      "MODEL environment variable is required. Format: 'anthropic/model-name' or 'openrouter/provider/model-name'"
    );
  }

  return {
    modelString,
    anthropicApiKey,
    openrouterApiKey,
  };
}
