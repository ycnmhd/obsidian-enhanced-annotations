import { writable } from 'svelte/store';
import { tts } from './helpers/tts';

export const POSSIBLE_FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24] as const;
export const fontSize = writable<(typeof POSSIBLE_FONT_SIZES)[number]>(12);

export const showLabelsFilter = writable<boolean>(false);

export const showSearchInput = writable<boolean>(false);

export const isReading = writable<boolean>(false);
tts.subscribe((value) => isReading.set(value));

export const showSecondaryControlsBar = writable<boolean>(false);

export const pluginIdle = writable(false);

export const showStylesSettings = writable(false);

// hide style settings
showSecondaryControlsBar.subscribe((v) => {
    if (!v) showStylesSettings.set(false);
});
showSearchInput.subscribe((v) => {
    if (v) showStylesSettings.set(false);
});
showLabelsFilter.subscribe((v) => {
    if (v) showStylesSettings.set(false);
});

// hide filters
showStylesSettings.subscribe((v) => {
    if (v) {
        showSearchInput.set(false);
        showLabelsFilter.set(false);
    }
});
