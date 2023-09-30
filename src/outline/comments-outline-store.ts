import { derived, writable } from 'svelte/store';

import type { Comment } from './helpers/update-comments-outline';

export type OutlineStore = {
    labels: {
        [name: string | number]: Comment[];
    };
};
export const outlineComments = writable<OutlineStore>({ labels: {} });

export const outlineFilter = writable('');
export const displayMode = writable<'list' | 'tabs'>('tabs');
export const filteredComments = derived(
    [outlineFilter, outlineComments],
    ([$term, $items]) => {
        const term = $term.toLowerCase();
        if (!term) return $items;
        const filteredDictionary = { labels: {} } as typeof $items;
        for (const [label, comments] of Object.entries($items.labels)) {
            const filteredComments = comments.filter((v) =>
                v.text.toLowerCase().includes(term),
            );
            if (filteredComments.length) {
                filteredDictionary.labels[label] = filteredComments;
            }
        }
        return filteredDictionary;
    },
);
