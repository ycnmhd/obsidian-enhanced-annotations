<script lang="ts">
	import { l } from '../../../../lang/lang';
	import { LabelSettings } from 'src/settings/settings-type';
	import { Notice } from 'obsidian';
	import LabeledAnnotations from '../../../../main';
	import AdditionalStyles from './additional-styles.svelte';

	export let label: LabelSettings;
	export let plugin: LabeledAnnotations;

	const onLabelChange = (e: any) => {
		const value = e.target.value;
		const input = e.target;
		input.checkValidity();
		if (input.validity.patternMismatch) {
			input.reportValidity();
			new Notice(l.SETTINGS_LABELS_STYLES_LABEL_INVALID);
		} else {
			plugin.settings.dispatch({
				payload: {
					pattern: value,
					id: label.id
				},
				type: 'SET_PATTERN'
			});
		}
	};
</script>

<div class="main-styles">
	<input
		on:change={onLabelChange}
		pattern={'^\\w+$'}
		placeholder={l.SETTINGS_LABELS_STYLES_NAME_PLACE_HOLDER}
		style="width: 50px;"
		type="text"
		value={label.label}
	/>
	<AdditionalStyles {label} {plugin} />
</div>

<style>
	.main-styles {
		display: flex;
		gap: 5px;
	}
</style>
