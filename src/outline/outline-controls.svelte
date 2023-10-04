<script>

	import { displayMode, fontSize, outlineFilter, POSSIBLE_FONT_SIZES } from "./comments-outline-store";
	import { copyCommentsToClipboard } from "./helpers/copy-comments-to-clipboard";

	const toggleDisplayMode = () => {
		displayMode.set($displayMode === "list" ? "tabs" : "list");
	};
	const toggleFontSize = () => {
		const i = (POSSIBLE_FONT_SIZES.indexOf($fontSize) || 0) + 1;
		let newFontSize = POSSIBLE_FONT_SIZES[i] ? POSSIBLE_FONT_SIZES[i] : POSSIBLE_FONT_SIZES[0];
		fontSize.set(newFontSize);
	};
	let term = "";
	$: outlineFilter.set(term);

</script>

<div class="outline-controls">

	<div class="nav-buttons-container">
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
	<div class="search-input-container">
		<input type="search" class="search-input" bind:value={term} placeholder="filter">
	</div>
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
		height: 80px;
	}

	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-input-container {
	}

	.search-input {
	}


</style>
