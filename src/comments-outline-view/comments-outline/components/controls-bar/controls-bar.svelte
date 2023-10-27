<script>

  import TabsFilter from "./components/tabs-filter/tabs-filter.svelte";
  import SearchInput from "./components/search-input/search-input.svelte";
  import { showLabelsFilter, showSearchInput, showSecondaryControlsBar } from "./controls-bar.store";
  import NavButton from "./components/clickable-icon.svelte";
  import { l } from "../../../../lang/lang";
  import { searchTerm } from "./components/search-input/search-input.store";

  import { filteredHiddenLabels } from "../comments-list/comments-list.store";
  import SecondaryControlsBar from "../secondary-controls-bar/secondary-controls-bar.svelte";


  const toggleLabelsFilter = () => {
    showLabelsFilter.update(v => !v);
  };
  const toggleShowSearchInput = () => {
    showSearchInput.update(v => !v);
  };


  const toggleSecondaryControlsBar = () => {
    showSecondaryControlsBar.update(v => !v);
  };

</script>

<div class="nav-header outline-controls">

  <div class="nav-buttons-container">

    <NavButton
      isActive={$showLabelsFilter}
      label={l.OUTLINE_FILTER_LABELS}
      onClick={toggleLabelsFilter}
      hasEnabledItems={$filteredHiddenLabels.size>0}
    >
      <svg
        class="svg-icon"
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
    </NavButton>

    <NavButton label={l.OUTLINE_FILTER_COMMENTS} onClick={toggleShowSearchInput} isActive={$showSearchInput}
               hasEnabledItems={$searchTerm}>
      <svg
        class="svg-icon"
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

    </NavButton>

    <NavButton label={l.OUTLINE_SHOW_ALL_CONTROLS} onClick={toggleSecondaryControlsBar}
               isActive={$showSecondaryControlsBar}>
      <svg
        class="svg-icon"
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
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </NavButton>


  </div>


  {#if $showSecondaryControlsBar}
    <SecondaryControlsBar />
  {/if}

  {#if $showLabelsFilter}
    <TabsFilter />
  {/if}
  {#if $showSearchInput}
    <SearchInput />
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
        box-sizing: border-box;
        height: auto;
    }

    .nav-buttons-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }


</style>
