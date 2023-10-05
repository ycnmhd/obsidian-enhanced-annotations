<script>

	import { searchTerm } from "./search-input.store";

	let term = "";
	$: searchTerm.set(term);
</script>
<div class="search-input-container">
	<input type="search" class="search-input" bind:value={term} placeholder="filter">
</div>

<style>
	.search-input-container {
	}

	.search-input {
	}


</style>
