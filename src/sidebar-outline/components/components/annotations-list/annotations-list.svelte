<script lang="ts">
  import { selectText } from "./helpers/focus-text";
  import { fontSize } from "../controls-bar/controls-bar.store";
  import { activeAnnotationIndex, filteredBySearchAndCategoryAndLabel, labelSettings } from "./annotations-list.store";
  import NoComments from "../no-annotations.svelte";
  import LabeledAnnotations from "../../../../main";


  export let plugin: LabeledAnnotations;
  let outlineRef: HTMLDivElement;
  activeAnnotationIndex.subscribe(index => {
    if (outlineRef) {
      const active = outlineRef.querySelectorAll("div")[index];
      if (active) {
        active.scrollIntoView({ block: "nearest" });
      }
    }

  });
</script>

{#if $filteredBySearchAndCategoryAndLabel.length > 0}
  <div class="annotations-container" bind:this={outlineRef}>

    {#each $filteredBySearchAndCategoryAndLabel as annotation,i}
			<span class="annotation-label"
            style={`font-size:${$fontSize}px;color: ${$labelSettings[annotation.label]?.style?.color||""};`}>{annotation.label || "/"}</span>
      <div class={"annotation " +($activeAnnotationIndex===i? "active":"") }
           on:click={()=>{
				selectText(annotation,plugin)
			}}>
        <span class={"annotation-text"+(annotation.isHighlight?" highlight":"")}
              style={`font-size:${$fontSize}px;`}>{annotation.text}</span>
        <span class="annotation-line-number">{annotation.range.from.line + 1}</span>
      </div>
    {/each}
  </div>
{:else }
  <NoComments />
{/if}

<style>

    .annotations-container {
        display: grid;
        grid-template-columns: max-content auto;
        width: 100%;
        gap: 5px;
        align-items: center;
        margin-top: 10px;
        overflow-y: auto;
    }

    .annotation {
        padding: 5px 10px;
        color: var(--nav-item-color);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        height: fit-content;

        border-radius: var(--radius-s);
        font-size: var(--nav-item-size);
        line-height: var(--line-height-tight);
        font-weight: var(--nav-item-weight);
        margin-bottom: var(--size-2-1);
    }

    .highlight {
        font-style: italic;
        background-color: var(--nav-item-background-active)
    }

    .annotation-label {
        text-overflow: ellipsis;
        opacity: 0.8;
    }


    .annotation-line-number {
        opacity: 0.5;
        font-size: 12px;
        margin-left: auto;
    }

    .annotation:hover {
        color: var(--nav-item-color-hover);
        background-color: var(--nav-item-background-hover)
    }

    .active {
        color: var(--nav-item-color-active) !important;
        background-color: var(--nav-item-background-active) !important;
    }


</style>
