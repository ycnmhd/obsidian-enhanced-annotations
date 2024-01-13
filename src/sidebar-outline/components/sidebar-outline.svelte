<script lang="ts">
	import ControlsBar from './components/controls-bar/controls-bar.svelte';
	import FlatOutline from './components/annotations-list/annotations-list.svelte';
	import NoAnnotations from './components/no-annotations.svelte';
	import { searchTerm } from './components/controls-bar/components/search-input.store';
	import { filteredBySearch } from './components/annotations-list/annotations-list.store';
	import LabeledAnnotations from '../../main';
	import { pluginIdle, showStylesSettings } from './components/controls-bar/controls-bar.store';
	import PluginIdle from './components/plugin-idle.svelte';
	import StylesList from './components/styles/styles-list.svelte';

	export let plugin: LabeledAnnotations;
</script>

<div class="outline">
	{#if $pluginIdle}
		<PluginIdle {plugin} />
	{:else}
		<ControlsBar {plugin} />
		{#if $showStylesSettings}
			<StylesList {plugin} />
		{:else if Object.values($filteredBySearch.labels).flat().length || $searchTerm.length}
			<FlatOutline {plugin} />
		{:else}
			<NoAnnotations />
		{/if}
	{/if}
</div>

<style>
	.outline {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
	}
</style>
