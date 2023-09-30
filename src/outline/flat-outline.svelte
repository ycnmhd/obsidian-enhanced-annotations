<script>
	import { filteredComments } from "./comments-outline-store";
	import { selectText } from "./helpers/focus-text";


	let comments;
	$: {
		comments = Object.values($filteredComments.labels).flat().sort((a, b) => a.position.line - b.position.line);
	}
</script>


<div class="comments-container">
	{#each comments as comment}
		<div class="comment" on:click={()=>{
				selectText({ position: comment.position})
			}}>

			<span>
			<span>{comment.text}</span>
			<span class="comment-label">{comment.label}</span>
			</span>
			<span class="line-number">{comment.position.line + 1}</span>
		</div>
	{/each}
</div>

<style>

	.comments-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.comment {
		padding: var(--nav-item-padding);
		color: var(--nav-item-color);
		cursor: pointer;
		border-radius: 3px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.comment-label {
		opacity: 0.5;
		font-size: 12px;
	}

	.line-number {
		opacity: 0.5;
		font-size: 12px;
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
