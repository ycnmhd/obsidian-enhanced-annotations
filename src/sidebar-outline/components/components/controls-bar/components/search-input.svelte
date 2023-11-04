<script>

  import { searchTerm } from "./search-input.store";
  import { l } from "../../../../../lang/lang";

  let term = $searchTerm;
  $: searchTerm.set(term);
</script>

<div class="search-input-container" style="width: 90%">
  <input bind:value={term} enterkeyhint="search" placeholder={l.OUTLINE_FILTER_ANNOTATIONS} type="search"
         spellcheck="false" />
  <div class="search-input-clear-button" aria-label={l.OUTLINE_FILTER_COMMENTS_CLEAR} on:click={()=>{term=""}}></div>
</div>

