<script lang="ts">
	import { displayMode, filteredComments, outlineFilter } from "./comments-outline-store";
	import Controls from "./outline-controls.svelte";
	import FlatOutline from "./flat-outline.svelte";
	import TabbedOutline from "./tabbed-outline.svelte";
</script>

<div class="outline">

	{#if Object.values($filteredComments.labels).flat().length || $outlineFilter.length}
		<Controls />
		{#if $displayMode === "tabs"}
			<TabbedOutline />
		{:else }
			<FlatOutline />
		{/if}

	{:else }
		<div class="no-comments">No comments</div>
	{/if}
</div>

<style>


	.no-comments {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 40%;
		padding: 10px;

	}

	.outline {
		height: 100%;
	}


</style>
