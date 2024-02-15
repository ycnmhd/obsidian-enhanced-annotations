<script lang="ts">
    import { fontSize } from '../controls-bar/controls-bar.store';
    import { selectText } from './helpers/focus-text';
    import LabeledAnnotations from '../../../../main';
    import {
        Annotation
    } from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

    export let plugin: LabeledAnnotations;
    export let annotation: Annotation;
    export let isActive: boolean;
    const onClick = () => {
        selectText(annotation, plugin);
    };
</script>

<div
    class={'annotation ' + (isActive ? 'active' : '')}
    on:click={onClick}
    on:keyup={onClick}
    role="button"
    tabindex="0"
>
    <span class={'annotation-text'} style={`font-size:${$fontSize}px;`}>
        {#if annotation.isHighlight}
            <mark class={isActive ? 'active' : ''}>{annotation.text}</mark>
        {:else}
            {annotation.text}
        {/if}
    </span>
    <span class="annotation-badge">

        <span >{annotation.range.from.line + 1}</span>
        <span style="position: absolute; bottom: 0; white-space:nowrap">{annotation.label}</span>
    </span>
</div>

<style>
    .annotation {
        position: relative;
        display: flex;
        cursor: pointer;
        align-items: center;
        box-sizing: border-box;
        height: fit-content;

        color: var(--nav-item-color);
        border-radius: var(--radius-s);
        font-size: var(--nav-item-size);
        line-height: var(--line-height-tight);
        font-weight: var(--nav-item-weight);
        margin-bottom: var(--size-2-1);
        padding: var(--size-4-2);
    }
    .annotation:hover {
        color: var(--nav-item-color-hover);
        background-color: var(--nav-item-background-hover);
    }

    mark {
        color: var(--nav-item-color);
        background-color: var(--nav-item-background-active);
        font-style: italic;
    }

    .annotation-badge {
        position: absolute;
        right: 4px;
        bottom: 2px;
        top: 2px;
        font-size: 10px;
        opacity: 0.5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
    }
    .active {
        color: var(--nav-item-color-highlighted);
        background-color: var(--nav-item-background-active);
    }
</style>
