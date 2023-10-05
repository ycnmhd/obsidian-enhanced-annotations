<script>

	import { copyCommentsToClipboard } from "../../../helpers/copy-comments-to-clipboard";
	import TabsFilter from "./components/tabs-filter/tabs-filter.svelte";
	import SearchInput from "./components/search-input/search-input.svelte";
	import { fontSize, POSSIBLE_FONT_SIZES, showLabelsFilter, showSearchInput } from "./controls-bar.store";


	const toggleFontSize = (e) => {
		const delta = e.shiftKey ? -1 : 1;
		const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) + delta;
		fontSize.set(POSSIBLE_FONT_SIZES[i] ? POSSIBLE_FONT_SIZES[i] : POSSIBLE_FONT_SIZES[i < 0 ? POSSIBLE_FONT_SIZES.length - 1 : 0]);
	};

	const toggleLabelsFilter = () => {
		showLabelsFilter.set(!$showLabelsFilter);
	};
	const toggleShowSearchInput = () => {
		showSearchInput.set(!$showSearchInput);
	};

</script>

<div class="outline-controls">

	<div class="nav-buttons-container">

		<button aria-label="Filter labels" class="clickable-icon nav-action-button" on:click={toggleLabelsFilter}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 6h18" />
				<path d="M7 12h10" />
				<path d="M10 18h4" />
			</svg>

		</button>
		<button aria-label="Filter comments" class="clickable-icon nav-action-button" on:click={toggleShowSearchInput}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>

		</button>
		<button aria-label="Toggle font size" class="clickable-icon nav-action-button" on:click={toggleFontSize}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m3 15 4-8 4 8" />
				<path d="M4 13h6" />
				<circle cx="18" cy="12" r="3" />
				<path d="M21 9v6" />
			</svg>
		</button>
		<button aria-label="Copy visible comments to clipboard"
				class="clickable-icon nav-action-button"
				on:click={copyCommentsToClipboard}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
				 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				 class="lucide lucide-clipboard-copy">
				<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
				<path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
				<path d="M16 4h2a2 2 0 0 1 2 2v4" />
				<path d="M21 14H11" />
				<path d="m15 10-4 4 4 4" />
			</svg>
		</button>


	</div>

	{#if $showSearchInput}
		<SearchInput />
	{/if}
	{#if $showLabelsFilter}
		<TabsFilter />
	{/if}
</div>

<style>
	.outline-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		gap: 10px;
		align-self: center;
		justify-self: center;
		margin-bottom: 10px;
		box-sizing: border-box;
		height: auto;
	}

	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}


</style>
