<script>
	import { hiddenLabels } from "./tabs-filter.store";
	import { filteredComments } from "../../../comments-list/comments-list.store";

	let allLabels;
	$: allLabels = Object.keys($filteredComments.labels);
	const toggleTab = (label, inverted) => {
		hiddenLabels.update(hidden => {
			if (inverted) {
				const notHidden = allLabels.filter(l => !hidden.has(l));
				hidden.clear();
				notHidden.forEach(l => hidden.add(l));
			} else hidden.has(label) ? hidden.delete(label) : hidden.add(label);
			return hidden;
		});
	};
</script>

{#if Object.keys($filteredComments.labels).length}
	<div class="tabs-container">
		{#each Object.entries($filteredComments.labels) as [label, group]}
			<div class={`tab ${$hiddenLabels.has(label)? "is-hidden":""}`} on:click={(e)=>toggleTab(label,e.shiftKey)}>
				<span>{label}</span>
				<span class="tab-badge">{group.length}</span>
			</div>
		{/each}
	</div>
{/if}

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

		position: relative;

		background-color: var(--nav-item-background-active);
		color: var(--nav-item-color-active);
		opacity: 1;
	}

	.tab:hover {
		background-color: var(--nav-item-background-hover);
		color: var(--nav-item-color-hover);
		opacity: 1;
	}

	.tab.is-hidden {
		background-color: transparent;
		color: var(--nav-item-color);
		opacity: 0.3;
	}
</style>
