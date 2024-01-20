<script lang="ts">
    import TabsFilter from './components/tabs-filter.svelte';
    import SearchInput from './components/search-input.svelte';
    import { controls } from './controls-bar.store';
    import NavButton from './components/clickable-icon.svelte';
    import { l } from '../../../../lang/lang';
    import { searchTerm } from './components/search-input.store';
    import { ListFilter, MoreHorizontal, Search } from 'lucide-svelte';
    import { filteredHiddenCategories, filteredHiddenLabels } from '../annotations-list/annotations-list.store';
    import SecondaryControlsBar from './components/extra-buttons.svelte';
    import LabeledAnnotations from '../../../../main';
    import OutlineSettings from './components/outline-settings.svelte';

    export let plugin: LabeledAnnotations;
	const toggleLabelsFilter = () => {
		controls.dispatch({type:"TOGGLE_LABELS_FILTERS"})
	};
	const toggleShowSearchInput = () => {
		controls.dispatch({type:"TOGGLE_SEARCH_INPUT"})
	};

	const toggleSecondaryControlsBar = () => {
		controls.dispatch({type:"TOGGLE_EXTRA_BUTTONS"})
	};




</script>

<div class="nav-header outline-controls">
	<div class="nav-buttons-container">
		<NavButton
			hasEnabledItems={!!$searchTerm}
			isActive={$controls.showSearchInput}
			label={l.OUTLINE_SEARCH_ANNOTATIONS}
			onClick={toggleShowSearchInput}
		>
			<Search class="svg-icon" />
		</NavButton>
		<NavButton
			hasEnabledItems={$filteredHiddenLabels.size > 0 ||
                $filteredHiddenCategories.size > 0}
			isActive={$controls.showLabelsFilter}
			label={l.OUTLINE_FILTER_ANNOTATIONS}
			onClick={toggleLabelsFilter}
		>
			<ListFilter class="svg-icon" />
		</NavButton>
		<NavButton
			isActive={$controls.showExtraButtons}
			label={l.OUTLINE_SHOW_ALL_CONTROLS}
			onClick={toggleSecondaryControlsBar}
		>
			<MoreHorizontal class="svg-icon" />
		</NavButton>
	</div>

	{#if $controls.showExtraButtons}
		<SecondaryControlsBar plugin={plugin} />
	{/if}

	{#if $controls.showSearchInput}
		<SearchInput />
	{/if}
	{#if $controls.showLabelsFilter}
		<TabsFilter />
	{/if}
	{#if $controls.showOutlineSettings}
		<OutlineSettings/>
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
