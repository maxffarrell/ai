import type { ValidationResult } from "../../lib/validator-runner.ts";

/**
 * Validates that the todo list component follows Svelte 5 best practices
 */
export function validate(code: string): ValidationResult {
	const errors: string[] = [];

	// Must use $state() for todos array
	if (!code.includes("$state")) {
		errors.push("Component must use $state() for the todos array");
	}

	// Must use $derived() for remaining count
	if (!code.includes("$derived")) {
		errors.push("Component must use $derived() for the remaining count");
	}

	// Must use {#each ... as ... (key)} with a key
	const eachRegex = /\{#each\s+\w+\s+as\s+\w+\s*\(\s*\w+(\.\w+)?\s*\)/;
	if (!eachRegex.test(code)) {
		errors.push("Component must use {#each todos as todo (todo.id)} with a key for proper list rendering");
	}

	// Must NOT use $effect for count calculation
	if (code.includes("$effect")) {
		errors.push("Component must NOT use $effect for count calculation - use $derived instead");
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
