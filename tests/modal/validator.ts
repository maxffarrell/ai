interface ValidationResult {
	valid: boolean;
	errors: string[];
}

export function validate(code: string): ValidationResult {
	const errors: string[] = [];

	// Must use $props() for reactive props
	if (!code.includes('$props()')) {
		errors.push('Must use $props() for component props');
	}

	// Must use {@render} for slots, not <slot>
	if (code.includes('<slot') && code.includes('</slot>')) {
		errors.push('Must use {@render} for slots instead of <slot> element');
	}
	if (code.includes('<slot/>') || code.includes('<slot />')) {
		errors.push('Must use {@render} for slots instead of <slot/> element');
	}

	// Must have proper ARIA attributes
	if (!code.includes('role="dialog"') && !code.includes("role='dialog'")) {
		errors.push('Must have role="dialog" attribute');
	}

	if (!code.includes('aria-modal')) {
		errors.push('Must have aria-modal attribute');
	}

	if (!code.includes('aria-labelledby')) {
		errors.push('Must have aria-labelledby attribute');
	}

	// Must use $effect() for escape key listener
	// This is a valid use case for $effect (DOM event listeners)
	if (code.includes('closeOnEscape') && !code.includes('$effect')) {
		errors.push('Must use $effect() for escape key listener with cleanup');
	}

	// Must NOT use export let (legacy Svelte 4 syntax)
	if (/export\s+let\s+/.test(code)) {
		errors.push('Must NOT use "export let" - use $props() instead');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
