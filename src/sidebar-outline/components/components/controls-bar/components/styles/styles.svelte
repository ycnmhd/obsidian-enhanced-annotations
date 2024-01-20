<script lang="ts">
	import { l } from '../../../../../../lang/lang';
	import { LabelSettings } from 'src/settings/settings-type';
	import { Notice } from 'obsidian';
	import LabeledAnnotations from '../../../../../../main';
	import AdditionalStyles from './additional-styles.svelte';
	import { onDestroy } from 'svelte';

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
                    id: label.id,
                },
                type: 'SET_PATTERN',
            });
        }
    };
    let showAdditionalSettings = false;
    const onToggleAdditionalSettings = () => {
        showAdditionalSettings = !showAdditionalSettings;
    };

    const cleanupEmptyLabels = () => {
        const labels = plugin.settings.getValue().decoration.styles.labels;
        const stylesWithEmptyLabels = Object.values(labels)
            .flat()
            .filter((v) => !v.label)
            .sort((a, b) => Number(a.id) - Number(b.id));
        if (stylesWithEmptyLabels.length > 1) {
            stylesWithEmptyLabels.splice(stylesWithEmptyLabels.length - 1);
            stylesWithEmptyLabels.forEach((v) => {
                plugin.settings.dispatch({
                    type: 'DELETE_GROUP',
                    payload: { id: v.id },
                });
            });
        }
    };
    onDestroy(cleanupEmptyLabels);
</script>

<div
    class={`main-styles${
        showAdditionalSettings ? ' additional-settings--expanded' : ''
    }`}
>
    <input
        on:change={onLabelChange}
        pattern={'^\\w+$'}
        placeholder={l.SETTINGS_LABELS_STYLES_NAME_PLACE_HOLDER}
        style="width: 50px;"
        type="text"
        value={label.label}
    />
    <AdditionalStyles
        {label}
        {onToggleAdditionalSettings}
        {plugin}
        {showAdditionalSettings}
    />
</div>

<style>
    .main-styles {
        display: flex;
        gap: 5px;
    }
    .additional-settings--expanded {
        margin-bottom: 10px;
        margin-top: 10px;
    }
</style>
