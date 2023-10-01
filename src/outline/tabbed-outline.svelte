<script>

	import { filteredComments, safeSelectedLabel, selectTab } from "./comments-outline-store";
	import { selectText } from "./helpers/focus-text";
</script>

<div class="tabs-container">
	{#each Object.entries($filteredComments.labels) as [groupName, group]}
		<div class={"tab "+($safeSelectedLabel===groupName? "is-active":"")} on:click={()=>selectTab(groupName)}>
			<span>{groupName}</span>
			<span class="tab-badge">{group.length}</span>
		</div>
	{/each}
</div>
<div class="comments-container">
	{#if $filteredComments.labels[$safeSelectedLabel]}
		{#each $filteredComments.labels[$safeSelectedLabel] as comment}
			<div class="comment" on:click={()=>{
				selectText({ position: comment.position})
			}}>

				<span>{comment.text}</span>
				<span class="line-number">{comment.position.line + 1}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
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
