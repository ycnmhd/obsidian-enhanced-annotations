<script lang="ts">
	export let onClick: (e: MouseEvent) => void;
	export let label: string;
	export let isActive: boolean;
</script>
<button aria-label={label} class={"clickable-icon nav-action-button "+(isActive?"is-active":"")}
		on:click={onClick}>
	<slot />

</button>
