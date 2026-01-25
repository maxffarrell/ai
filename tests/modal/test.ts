import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Component from './Component.svelte';

describe('Modal Component', () => {
	it('is visible when open', () => {
		render(Component, {
			props: {
				open: true,
				title: 'Test Modal'
			}
		});

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Test Modal')).toBeInTheDocument();
	});

	it('is hidden when closed', () => {
		render(Component, {
			props: {
				open: false,
				title: 'Test Modal'
			}
		});

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('close button emits close event', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				onclose
			}
		});

		const closeButton = screen.getByRole('button', { name: /close/i });
		await fireEvent.click(closeButton);

		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('escape key closes when closeOnEscape is true', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				closeOnEscape: true,
				onclose
			}
		});

		await fireEvent.keyDown(window, { key: 'Escape' });

		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('escape key does not close when closeOnEscape is false', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				closeOnEscape: false,
				onclose
			}
		});

		await fireEvent.keyDown(window, { key: 'Escape' });

		expect(onclose).not.toHaveBeenCalled();
	});

	it('overlay click closes when closeOnOverlay is true', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				closeOnOverlay: true,
				onclose
			}
		});

		const overlay = screen.getByRole('dialog').parentElement!;
		await fireEvent.click(overlay);

		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('overlay click does not close when closeOnOverlay is false', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				closeOnOverlay: false,
				onclose
			}
		});

		const overlay = screen.getByRole('dialog').parentElement!;
		await fireEvent.click(overlay);

		expect(onclose).not.toHaveBeenCalled();
	});

	it('clicking modal content does not trigger overlay close', async () => {
		const onclose = vi.fn();

		render(Component, {
			props: {
				open: true,
				title: 'Test Modal',
				closeOnOverlay: true,
				onclose
			}
		});

		const modal = screen.getByRole('dialog');
		await fireEvent.click(modal);

		expect(onclose).not.toHaveBeenCalled();
	});

	it('has proper ARIA attributes', () => {
		render(Component, {
			props: {
				open: true,
				title: 'Test Modal'
			}
		});

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute('aria-labelledby');

		const labelId = dialog.getAttribute('aria-labelledby');
		const titleElement = document.getElementById(labelId!);
		expect(titleElement).toBeInTheDocument();
		expect(titleElement).toHaveTextContent('Test Modal');
	});
});
