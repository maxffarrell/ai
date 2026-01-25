<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		closeOnOverlay?: boolean;
		closeOnEscape?: boolean;
		onclose?: () => void;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		open,
		title,
		closeOnOverlay = true,
		closeOnEscape = true,
		onclose,
		children,
		actions
	}: Props = $props();

	function handle_close() {
		onclose?.();
	}

	function handle_overlay_click(event: MouseEvent) {
		if (closeOnOverlay && event.target === event.currentTarget) {
			handle_close();
		}
	}

	function handle_keydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			handle_close();
		}
	}

	$effect(() => {
		if (open && closeOnEscape) {
			window.addEventListener('keydown', handle_keydown);
			return () => {
				window.removeEventListener('keydown', handle_keydown);
			};
		}
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={handle_overlay_click}>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="modal-header">
				<h2 id="modal-title">{title}</h2>
				<button
					type="button"
					class="close-button"
					aria-label="Close"
					onclick={handle_close}
				>
					&times;
				</button>
			</div>
			<div class="modal-body">
				{@render children?.()}
			</div>
			{#if actions}
				<div class="modal-footer">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		border-radius: 8px;
		max-width: 500px;
		width: 90%;
		max-height: 90vh;
		overflow: auto;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #eee;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		line-height: 1;
	}

	.modal-body {
		padding: 1rem;
	}

	.modal-footer {
		padding: 1rem;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}
</style>
