<script>
	import { selectText } from "../../helpers/focus-text";
	import { fontSize } from "../components/controls-bar/controls-bar.store";
	import { filteredComments, labelSettings } from "./comments-list.store";
	import { hiddenLabels } from "../components/controls-bar/components/tabs-filter/tabs-filter.store";


	let comments;
	$: {
		comments = Object.values($filteredComments.labels)
			.flat()
			.sort((a, b) => a.position.line - b.position.line)
			.filter(c => !$hiddenLabels.has(c.label));
	}
</script>


<div class="comments-container">
	{#each comments as comment}
			<span class="comment-label"
				  style={`font-size:${$fontSize}px;color: ${$labelSettings[comment.label]?.style?.color||""};`}>{comment.label}</span>
		<div class="comment" on:click={()=>{
				selectText({ position: comment.position})
			}}>
			<span class="comment-text" style={`font-size:${$fontSize}px;`}>{comment.text}</span>
			<span class="comment-line-number">{comment.position.line + 1}</span>
		</div>
	{/each}
</div>

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
		border-radius: 3px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		height: fit-content;
	}

	.comment-label {
		text-overflow: ellipsis;
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
