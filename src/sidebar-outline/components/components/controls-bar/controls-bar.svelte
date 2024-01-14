<script lang="ts">
	import TabsFilter from './components/tabs-filter.svelte';
	import SearchInput from './components/search-input.svelte';
	import { showLabelsFilter, showSearchInput, showSecondaryControlsBar } from './controls-bar.store';
	import NavButton from './components/clickable-icon.svelte';
	import { l } from '../../../../lang/lang';
	import { searchTerm } from './components/search-input.store';
	import { ListFilter, MoreHorizontal, Search } from 'lucide-svelte';
	import { filteredHiddenCategories, filteredHiddenLabels } from '../annotations-list/annotations-list.store';
	import SecondaryControlsBar from '../secondary-controls-bar/secondary-controls-bar.svelte';
	import LabeledAnnotations from '../../../../main';

	export let plugin: LabeledAnnotations;
	const toggleLabelsFilter = () => {
		showLabelsFilter.update((v) => !v);
		plugin.idling.logActivity();
	};
	const toggleShowSearchInput = () => {
		showSearchInput.update((v) => !v);
		plugin.idling.logActivity();
	};

	const toggleSecondaryControlsBar = () => {
		showSecondaryControlsBar.update((v) => !v);
		plugin.idling.logActivity();
	};
</script>

<div class="nav-header outline-controls">
	<div class="nav-buttons-container">
		<NavButton
			hasEnabledItems={!!$searchTerm}
			isActive={$showSearchInput}
			label={l.OUTLINE_FILTER_ANNOTATIONS}
			onClick={toggleShowSearchInput}
		>
			<Search class="svg-icon" />
		</NavButton>
		<NavButton
			hasEnabledItems={$filteredHiddenLabels.size > 0 ||
                $filteredHiddenCategories.size > 0}
			isActive={$showLabelsFilter}
			label={l.OUTLINE_FILTER_LABELS}
			onClick={toggleLabelsFilter}
		>
			<ListFilter class="svg-icon" />
		</NavButton>
		<NavButton
			isActive={$showSecondaryControlsBar}
			label={l.OUTLINE_SHOW_ALL_CONTROLS}
			onClick={toggleSecondaryControlsBar}
		>
			<MoreHorizontal class="svg-icon" />
		</NavButton>
	</div>

	{#if $showSecondaryControlsBar}
		<SecondaryControlsBar plugin={plugin} />
	{/if}

	{#if $showSearchInput}
		<SearchInput />
	{/if}
	{#if $showLabelsFilter}
		<TabsFilter />
	{/if}
</div>

<style>
	.outline-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		gap: 10px;
		align-self: center;
		justify-self: center;
		box-sizing: border-box;
		height: auto;
	}

	.nav-buttons-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
