<script lang="ts">
	import Styles from './styles.svelte';
	import LabeledAnnotations from '../../../../../../main';
	import NewStyle from './new-style.svelte';
	import { onDestroy } from 'svelte';

	export let plugin: LabeledAnnotations;

	let labels = (Object.values(
		plugin.settings.getValue().decoration.styles.labels
	));
	const unsub = plugin.settings.subscribe(v => {
		labels = (Object.values(
			v.decoration.styles.labels
		));
	});
	onDestroy(unsub);
</script>

<div class="styles-list">
	{#each labels as label (label.id)}
		<Styles {plugin} {label} />
	{/each}
	<NewStyle plugin={plugin} />
</div>

<style>
	.styles-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 100%;
		align-items: center;
		padding: 10px;
	}
</style>
