<script lang="ts">
    import NavButton from './clickable-icon.svelte';
    import { l } from '../../../../../lang/lang';
    import { controls, isReading } from '../controls-bar.store';
    import { tts } from '../helpers/tts';
    import { Paintbrush, Settings } from 'lucide-svelte';
    import LabeledAnnotations from '../../../../../main';
    import { get } from 'svelte/store';
    import { filteredBySearchAndCategory } from '../../annotations-list/annotations-list.store';
    import { annotationsToText } from '../../../../../clipboard/helpers/annotations-to-text';
    import { clipboard } from 'electron';
    import { Notice } from 'obsidian';
    import { onDestroy } from 'svelte';

    export let plugin: LabeledAnnotations;

    export const copyAnnotationsToClipboard = () => {
        const annotations = Object.values(
            get(filteredBySearchAndCategory).labels,
        )
            .flat()
            .sort((a, b) => a.position.from - b.position.from);
        const outline = plugin.outline;
        const f = outline.getValue().view?.file;
        if (f) {
            const path = f.parent?.path as string;
            const name = f.basename;

            const text = annotationsToText(
                [{ path, name, annotations }],
                plugin.settings.getValue().clipboard.templates,
                path,
            );
            clipboard.writeText(text);
            new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
        } else {
            new Notice(l.OUTLINE_NOTICE_COULD_NOT_COPY);
        }
    };

    const read = () => {
        if (!tts.isReading) {
            tts.read();
        } else {
            tts.stop();
        }
    };

    const toggleShowStylesSettings = () => {
        controls.dispatch({ type: 'TOGGLE_STYLES_SETTINGS' });
    };

    const unsub = tts.subscribe((value) => isReading.set(value));
    onDestroy(unsub);
</script>

<div class="nav-buttons-container">
    <NavButton
        isActive={$isReading}
        label={l.OUTLINE_READ_ANNOTATIONS}
        onClick={read}
    >
        {#if $isReading}
            <svg
                class="svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <rect width="6" height="6" x="9" y="9" />
            </svg>
        {:else}
            <svg
                class="svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path
                    d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"
                />
                <polyline points="14 2 14 8 20 8" />
                <path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" />
                <path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" />
                <path d="M2 19v-3a6 6 0 0 1 12 0v3" />
            </svg>
        {/if}
    </NavButton>
    <NavButton
        label={l.OUTLINE_COPY_ANNOTATIONS_TO_CLIPBOARD}
        onClick={copyAnnotationsToClipboard}
    >
        <svg
            class="svg-icon lucide lucide-clipboard-copy"
            fill="none"
            height="18"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
            <path
                d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            />
            <path d="M16 4h2a2 2 0 0 1 2 2v4" />
            <path d="M21 14H11" />
            <path d="m15 10-4 4 4 4" />
        </svg>
    </NavButton>

    <NavButton
        isActive={$controls.showStylesSettings}
        label={l.OUTLINE_TOGGLE_STYLES_SETTINGS}
        onClick={toggleShowStylesSettings}
    >
        <Paintbrush class="svg-icon" />
    </NavButton>
    <NavButton
        isActive={$controls.showOutlineSettings}
        label={l.OUTLINE_SETTINGS}
        onClick={() => controls.dispatch({ type: 'TOGGLE_OUTLINE_SETTINGS' })}
    >
        <Settings class="svg-icon" />
    </NavButton>
</div>

<style>
    .nav-buttons-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
