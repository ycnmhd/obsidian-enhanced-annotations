<script lang="ts">
	import { selectText } from "./helpers/focus-text";
	import { fontSize } from "../controls-bar/controls-bar.store";
	import { labelSettings, visibleComments } from "./comments-list.store";
	import NoComments from "../no-comments.svelte";
	import CommentLabels from "../../../../main";

	export let plugin: CommentLabels;
</script>

{#if $visibleComments.length > 0}
	<div class="comments-container">

		{#each $visibleComments as comment}
			<span class="comment-label"
				  style={`font-size:${$fontSize}px;color: ${$labelSettings[comment.label]?.style?.color||""};`}>{comment.label || "/"}</span>
			<div class="comment" on:click={()=>{
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
		/*max-height: calc(100% - 80px);*/
		/*flex: 1;*/
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

	.comment:active {
		color: var(--nav-item-color-active);
		background-color: var(--nav-item-background-active)
	}
</style>
