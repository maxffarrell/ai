import type { ValidationResult } from "../../lib/validator-runner.ts";

/**
 * Validates that the temperature converter component uses proper Svelte 5 patterns:
 * - Single $state() as source of truth
 * - $derived() for other temperature scales
 * - No multiple $state that update each other (causes loops)
 * - No $effect for conversions
 * - No export let (Svelte 4 pattern)
 */
export function validate(code: string): ValidationResult {
	const errors: string[] = [];

	// Must have $state() for the source of truth
	if (!code.includes("$state")) {
		errors.push("Component must use $state() for the source of truth temperature value");
	}

	// Must use $derived() for calculated values
	if (!code.includes("$derived")) {
		errors.push("Component must use $derived() for the other temperature scales");
	}

	// Count $state occurrences - should only have one for temperature
	// Allow for potential UI state like focus indicators, but warn if multiple temperature states
	const stateMatches = code.match(/\$state\s*\(/g);
	if (stateMatches && stateMatches.length > 1) {
		// Check if it looks like multiple temperature states (bad pattern)
		const hasCelsiusState = /celsius\s*=\s*\$state/.test(code);
		const hasFahrenheitState = /fahrenheit\s*=\s*\$state/.test(code);
		const hasKelvinState = /kelvin\s*=\s*\$state/.test(code);

		const temperatureStateCount = [hasCelsiusState, hasFahrenheitState, hasKelvinState].filter(
			Boolean,
		).length;

		if (temperatureStateCount > 1) {
			errors.push(
				"Component should have only one $state for temperature (single source of truth). " +
					"Multiple $state values for different temperature scales can cause update loops.",
			);
		}
	}

	// Must NOT use $effect for conversions (anti-pattern that causes loops)
	if (code.includes("$effect")) {
		errors.push(
			"Component should NOT use $effect for temperature conversions. " +
				"Use $derived() instead for reactive calculations.",
		);
	}

	// Must NOT use export let (Svelte 4 pattern)
	if (/export\s+let\s+/.test(code)) {
		errors.push(
			"Component should NOT use 'export let' (Svelte 4 pattern). " +
				"Use $props() for Svelte 5 if props are needed.",
		);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
