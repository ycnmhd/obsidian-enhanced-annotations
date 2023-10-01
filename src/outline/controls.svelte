<script>

	import { displayMode, outlineFilter } from "./comments-outline-store";
	import { copyCommentsToClipboard } from "./helpers/copy-comments-to-clipboard";

	const toggleDisplayMode = () => {
		displayMode.set($displayMode === "list" ? "tabs" : "list");
	};
	let term = "";
	$: outlineFilter.set(term);

</script>

<div class="controls">
	<div class="search-input-container">
		<input type="search" class="search-input" bind:value={term} placeholder="filter">
	</div>
	<div class="nav-buttons-container">
		<button aria-label="Toggle display mode" class="clickable-icon nav-action-button" on:click={toggleDisplayMode}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
				 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
				 class="lucide lucide-list">
				<line x1="8" x2="21" y1="6" y2="6" />
				<line x1="8" x2="21" y1="12" y2="12" />
				<line x1="8" x2="21" y1="18" y2="18" />
				<line x1="3" x2="3.01" y1="6" y2="6" />
				<line x1="3" x2="3.01" y1="12" y2="12" />
				<line x1="3" x2="3.01" y1="18" y2="18" />
			</svg>
		</button>
		<button aria-label="Copy visible comments to clipboard (press shift to include labels)"
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
</div>

<style>
	.controls {
		display: flex;
		justify-content: center;
		width: 300px;
		gap: 10px;
		align-self: center;
		justify-self: center;
	}

	.search-input-container {
	}

	.search-input {
	}


</style>
