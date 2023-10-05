import { writable } from 'svelte/store';

export const hiddenLabels = writable<Set<string>>(new Set<string>());
