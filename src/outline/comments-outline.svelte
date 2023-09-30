<script lang="ts">
	import { filteredComments, outlineFilter } from "./outline-comments";
	import { selectText } from "./helpers/focus-text";

	let selectedGroup: string;
	filteredComments.subscribe(newComments => {
		if (!selectedGroup || !newComments.groups[selectedGroup]) {
			selectedGroup = Object.keys(newComments.groups)[0];
		}
	});
	let term = "";

	$: outlineFilter.set(term);
</script>

<div class="outline">

	{#if Object.values($filteredComments.groups).flat().length || term.length}
		<div class="search-input-container">
			<input type="text" class="search-input" bind:value={term}>
		</div>
		<div class="tabs-container">
			{#each Object.entries($filteredComments.groups) as [groupName, group]}
				<div class={"tab "+(selectedGroup===groupName? "is-active":"")} on:click={()=>{
			 selectedGroup = groupName
			}}>
					<span>{groupName}</span>
					<span class="tab-badge">{group.length}</span>
				</div>
			{/each}
		</div>
		<div class="comments-container">
			{#if $filteredComments.groups[selectedGroup]}
				{#each $filteredComments.groups[selectedGroup] as comment}
					<div class="comment" on:click={()=>{
				selectText({ position: comment.position})
			}}>

						<span>{comment.text}</span>
						<span class="line-number">{comment.position.line + 1}</span>
					</div>
				{/each}
			{/if}
		</div>
	{:else }
		<div class="no-comments">No comments</div>
	{/if}
</div>

<style>
	.search-input-container {
		display: flex;
		justify-content: center;
		width: 200px;
		align-self: center;
		justify-self: center;
	}

	.no-comments {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 40%;
		padding: 10px;
	}

	.search-input {
	}

	.outline {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.tab-badge {
		position: absolute;
		right: -6px;
		top: 2px;
		font-size: 10px;
		width: 15px;
		height: 15px;
		opacity: 50%;
	}

	.tabs-container {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px;
		max-width: 100%;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--tab-outline-color)
	}

	.tab {
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 3px;
		color: var(--nav-item-color);
		opacity: 0.5;
		position: relative;
	}

	.tab:hover {
		background-color: var(--nav-item-background-hover);
		color: var(--nav-item-color-hover);
		opacity: 1;
	}

	.tab.is-active {
		background-color: var(--nav-item-background-active);
		color: var(--nav-item-color-active);
		opacity: 1;
	}

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
