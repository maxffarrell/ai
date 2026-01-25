import type { ValidationResult } from "../../lib/validator-runner.ts";

/**
 * Validates that the tabs component follows Svelte 5 best practices
 */
export function validate(code: string): ValidationResult {
	const errors: string[] = [];

	// Must use $state() for activeIndex
	if (!code.includes("$state")) {
		errors.push("Component must use $state() for managing activeIndex");
	}

	// Must have role="tablist"
	if (!code.includes('role="tablist"') && !code.includes("role='tablist'")) {
		errors.push("Component must have role=\"tablist\" on the tab container");
	}

	// Must have role="tab"
	if (!code.includes('role="tab"') && !code.includes("role='tab'")) {
		errors.push("Component must have role=\"tab\" on tab buttons");
	}

	// Must have role="tabpanel"
	if (!code.includes('role="tabpanel"') && !code.includes("role='tabpanel'")) {
		errors.push("Component must have role=\"tabpanel\" on content container");
	}

	// Must NOT use $: reactive statements (Svelte 4 syntax)
	if (code.includes("$:")) {
		errors.push("Component must NOT use '$:' reactive statements - use Svelte 5 runes instead");
	}

	// Must NOT use export let (Svelte 4 syntax)
	if (code.includes("export let")) {
		errors.push("Component must NOT use 'export let' - use $props() instead");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
