<script lang="ts">
	export let label: string;
	export let onClick: () => void;
	export let enabled = false;
</script>

<button
	aria-label={`${label}: ${enabled ? 'enabled' : 'disabled'}`}
	class={'toggle-button' + (enabled ? ' toggle-button--enabled' : '')}
	on:click={onClick}
>
	<slot />
</button>

<style>
	.toggle-button {
		cursor: pointer;
		color: var(--icon-color);
		opacity: 30%;
		width: 30px;
		height: 30px;
		padding: 2px;
	}

	.toggle-button--enabled {
		/*color: var(--color-accent);*/
		opacity: 100%;
	}
</style>
