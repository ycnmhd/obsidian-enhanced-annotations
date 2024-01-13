<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	export let onClick: MouseEventHandler<any>;
	export let label: string;
	export let isActive = false;
	export let hasEnabledItems = false;
	export let disabled = false;
</script>

<button
	aria-label={label}
	class={'clickable-icon nav-action-button ' + (isActive ? 'is-active ' : '')}
	{disabled}
	on:click={onClick}
	style="position:relative"
>
	{#if hasEnabledItems}
		<span class="asterisk">*</span>
	{/if}
	<slot />
</button>

<style>
	.asterisk {
		position: absolute;
		top: 1px;
		right: 1px;
		opacity: 0.8;
	}
</style>
