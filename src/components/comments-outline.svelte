<script lang="ts">
	import { CommentsStore, commentsStore } from "./comments-store";
	import { selectText } from "../editor/focus-text";

	let comments: CommentsStore;
	let selectedGroup: string;
	commentsStore.subscribe(newComments => {
		comments = newComments;
		if (!selectedGroup || !comments.groups[selectedGroup]) {
			selectedGroup = Object.keys(comments.groups)[0];
		}
	});

</script>

<div class="number">

	<div class="tabs-container">
		{#each Object.keys(comments.groups) as groupName}
			<div class={"tab-header "+(selectedGroup===groupName? "is-active":"")} on:click={()=>{
			 selectedGroup = groupName
			}}>{groupName}</div>
		{/each}
	</div>
	<div class="comments-outline">
		{#if comments.groups[selectedGroup]}
			{#each comments.groups[selectedGroup] as comment}
				<div class="comment" on:click={()=>{
				selectText({ position: comment.position})
			}}>{comment.text}</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.tabs-container {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px;
	}

	.tab-header {
		padding: 5px 10px;
		/*;*/
		color: var(--nav-item-color);
		cursor: pointer;
		border-radius: 3px;
	}

	.tab-header:hover {
		background-color: var(--tab-container-background)
	}

	.tab-header.is-active {
		/**/
		background-color: var(--tab-container-background);
		color: var(--nav-item-color-active);
	}

	.comments-outline {
		display: flex;
		flex-direction: column;
		gap: 5px
	}

	.comment {
		padding: 5px;

		color: var(--nav-item-color);
		cursor: pointer;
		border-radius: 3px;
	}

	.comment:hover {
		background-color: var(--nav-item-background-active);
	}
</style>
