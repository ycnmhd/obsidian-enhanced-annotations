<script lang="ts">
	export let label: string;
	export let onClick: () => void;
</script>

<button aria-label={label} class={'toggle-button'} on:click={onClick}>
	<slot />
</button>

<style>
	.toggle-button {
		cursor: pointer;
		color: var(--icon-color);
		opacity: 100%;
		width: 30px;
		height: 30px;
		padding: 2px;
	}
</style>
