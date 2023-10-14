<script lang="ts">
	export let onClick: (e: MouseEvent) => void;
	export let label: string;
	export let isActive: boolean;
	export let hasEnabledItems: boolean;
</script>
<button aria-label={label} style="position:relative"
		class={"clickable-icon nav-action-button "+(isActive?"is-active":"")}
		on:click={onClick}>
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
