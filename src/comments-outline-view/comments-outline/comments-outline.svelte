<script lang="ts">
	import ControlsBar from "./components/controls-bar/controls-bar.svelte";
	import FlatOutline from "./components/comments-list/comments-list.svelte";
	import NoComments from "./components/no-comments.svelte";
	import { searchTerm } from "./components/controls-bar/components/search-input/search-input.store";
	import { filteredComments } from "./components/comments-list/comments-list.store";
	import CommentLabels from "../../main";

	export let plugin: CommentLabels;
</script>

<div class="outline">

	{#if Object.values($filteredComments.labels).flat().length || $searchTerm.length}
		<ControlsBar />

		<FlatOutline plugin={plugin} />

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
