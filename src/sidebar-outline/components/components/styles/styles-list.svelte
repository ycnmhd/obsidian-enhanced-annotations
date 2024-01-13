<script lang="ts">
	import Styles from './styles.svelte';
	import LabeledAnnotations from '../../../../main';
	import NewStyle from './new-style.svelte';

	export let plugin: LabeledAnnotations;

	let labels = (Object.values(
		plugin.settings.getValue().decoration.styles.labels
	));
	plugin.settings.subscribe(v => {
		labels = (Object.values(
			v.decoration.styles.labels
		));
	});
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
