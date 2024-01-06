import { writable } from 'svelte/store';
import { tts } from './helpers/tts';

export const POSSIBLE_FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24] as const;
export const fontSize = writable<(typeof POSSIBLE_FONT_SIZES)[number]>(12);

export const showLabelsFilter = writable<boolean>(false);

export const showSearchInput = writable<boolean>(false);

export const isReading = writable<boolean>(false);
tts.subscribe((value) => isReading.set(value));

export const showSecondaryControlsBar = writable<boolean>(false);

export const pluginIdle = writable<boolean>(false);
