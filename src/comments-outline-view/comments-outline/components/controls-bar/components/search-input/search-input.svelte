<script>

	import { searchTerm } from "./search-input.store";

	let term = "";
	$: searchTerm.set(term);
</script>

<div class="search-input-container" style="width: 90%">
	<input bind:value={term} enterkeyhint="search" placeholder="Filter comments..." type="search" spellcheck="false" />
	<div class="search-input-clear-button" aria-label="Clear search" on:click={()=>{term=""}}></div>
</div>

