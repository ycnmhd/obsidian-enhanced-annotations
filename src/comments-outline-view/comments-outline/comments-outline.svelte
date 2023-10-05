<script lang="ts">
	import ControlsBar from "./components/controls-bar/controls-bar.svelte";
	import FlatOutline from "./comments-list/comments-list.svelte";
	import NoComments from "./components/no-comments.svelte";
	import { searchTerm } from "./components/controls-bar/components/search-input/search-input.store";
	import { filteredComments } from "./comments-list/comments-list.store";
</script>

<div class="outline">

	{#if Object.values($filteredComments.labels).flat().length || $searchTerm.length}
		<ControlsBar />
		<FlatOutline />

	{:else }
		<NoComments />
	{/if}
</div>

<style>


	.outline {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
	}


</style>
