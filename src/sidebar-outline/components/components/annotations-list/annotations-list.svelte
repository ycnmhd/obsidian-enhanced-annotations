<script lang="ts">
    import { activeAnnotationIndex, filteredBySearchAndCategoryAndLabel } from './annotations-list.store';
    import NoComments from '../no-annotations.svelte';
    import LabeledAnnotations from '../../../../main';
    import Annotation from './annotation.svelte';
    import { onDestroy } from 'svelte';

    export let plugin: LabeledAnnotations;
    let outlineRef: HTMLDivElement;
    const unsub = activeAnnotationIndex.subscribe((index) => {
        if (outlineRef) {
            const active = outlineRef.querySelectorAll('div')[index];
            if (active) {
                active.scrollIntoView({ block: 'nearest' });
            }
        }
    });
    onDestroy(unsub)
</script>

{#if $filteredBySearchAndCategoryAndLabel.length > 0}
    <div class="annotations-container" bind:this={outlineRef}>
        {#each $filteredBySearchAndCategoryAndLabel as annotation, index}
            <Annotation
                {annotation}
                {plugin}
                isActive={$activeAnnotationIndex === index}
            />
        {/each}
    </div>
{:else}
    <NoComments />
{/if}

<style>
    .annotations-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 5px;
        margin-top: 10px;
        overflow-y: auto;

    }
</style>
