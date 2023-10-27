<script lang="ts">
  import { selectText } from "./helpers/focus-text";
  import { fontSize } from "../controls-bar/controls-bar.store";
  import { activeCommentIndex, labelSettings, visibleComments } from "./comments-list.store";
  import NoComments from "../no-comments.svelte";
  import CommentLabels from "../../../../main";


  export let plugin: CommentLabels;
  let outlineRef: HTMLDivElement;
  activeCommentIndex.subscribe(index => {
    if (outlineRef) {
      const active = outlineRef.querySelectorAll("div")[index];
      if (active) {
        active.scrollIntoView({ block: "nearest" });
      }
    }

  });
</script>

{#if $visibleComments.length > 0}
  <div class="comments-container" bind:this={outlineRef}>

    {#each $visibleComments as comment,i}
			<span class="comment-label"
            style={`font-size:${$fontSize}px;color: ${$labelSettings[comment.label]?.style?.color||""};`}>{comment.label || "/"}</span>
      <div class={"comment " +($activeCommentIndex===i? "active":"")} on:click={()=>{
				selectText(comment,plugin)
			}}>
        <span class="comment-text" style={`font-size:${$fontSize}px;`}>{comment.text}</span>
        <span class="comment-line-number">{comment.range.from.line + 1}</span>
      </div>
    {/each}
  </div>
{:else }
  <NoComments />
{/if}

<style>

    .comments-container {
        display: grid;
        grid-template-columns: max-content auto;
        width: 100%;
        gap: 5px;
        align-items: center;
        margin-top: 10px;
        overflow-y: auto;
    }

    .comment {
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

    .comment-label {
        text-overflow: ellipsis;
        opacity: 0.8;
    }


    .comment-line-number {
        opacity: 0.5;
        font-size: 12px;
        margin-left: auto;
    }

    .comment:hover {
        color: var(--nav-item-color-hover);
        background-color: var(--nav-item-background-hover)
    }

    .active {
        color: var(--nav-item-color-active) !important;
        background-color: var(--nav-item-background-active) !important;
    }


</style>
