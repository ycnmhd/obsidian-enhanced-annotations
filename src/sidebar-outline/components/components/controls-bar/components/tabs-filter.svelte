<script lang="ts">
	import {
		filteredBySearch,
		filteredBySearchAndCategory,
		hiddenLabels,
		hiddenTypes
	} from '../../annotations-list/annotations-list.store';
	import { Highlighter, MessageSquare } from 'lucide-svelte';

	let allLabels: string[];
	$: allLabels = Object.keys($filteredBySearchAndCategory.labels);
	type Stats = {
		comments: number,
		highlights: number
	};
	let stats: Stats;
	$: stats = Object.values($filteredBySearch.labels).flat().reduce((acc, v) => {
		if (v.isHighlight)
			acc.highlights++;
		else acc.comments++;
		return acc;
	}, { comments: 0, highlights: 0 } as Stats);

	const toggleTab = (label: string, inverted: boolean) => {
		hiddenLabels.update(hidden => {
			if (inverted) {
				const notHidden = allLabels.filter(l => !hidden.has(l));
				hidden.clear();
				notHidden.forEach(l => hidden.add(l));
			} else hidden.has(label) ? hidden.delete(label) : hidden.add(label);
			return hidden;
		});
	};
	const toggleCategory = (category: 'highlight' | 'comment') => {
		hiddenTypes.update(c => {
			if (c.has(category)) {
				c.delete(category);
			} else
				c.add(category);
			return c;
		});
	};
</script>

	<div class="tabs-container">
		<div class={`tab ${$hiddenTypes.has("comment")? "is-hidden":""}`}
			 on:click={()=>toggleCategory("comment",)}>
			<span><MessageSquare size="13px" /></span>
			<span class="tab-badge">{stats.comments}</span>
		</div>
		<div class={`tab ${$hiddenTypes.has("highlight")? "is-hidden":""}`}
			 on:click={()=>toggleCategory("highlight")}>
			<span><Highlighter size="13px" /></span>
			<span class="tab-badge">{stats.highlights}</span>
		</div>
	</div>
{#if Object.keys($filteredBySearchAndCategory.labels).length}
	<div class="tabs-container">
		{#each Object.entries($filteredBySearchAndCategory.labels) as [label, group]}
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
