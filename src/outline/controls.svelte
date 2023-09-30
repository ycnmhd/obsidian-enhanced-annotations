<script>

	import { displayMode, outlineFilter } from "./comments-outline-store";

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
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
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
	</div>
</div>

<style>
	.controls {
		display: flex;
		justify-content: center;
		width: 200px;
		gap: 10px;
		align-self: center;
		justify-self: center;
	}

	.search-input-container {
	}

	.search-input {
	}


</style>
